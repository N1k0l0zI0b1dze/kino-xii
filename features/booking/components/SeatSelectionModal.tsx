"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Modal from "@/components/ui/Modal";
import { getSeatMap } from "@/features/movies/api/getSeatMap";
import type { MovieSession, SessionSeat } from "@/features/movies/types";

import { createHold, HoldRequestError } from "../api/createHold";
import { getFilterOptions } from "../api/getFilterOptions";
import type { CreateHoldPayload, Hold, TicketTypeSlug } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCurrentUser } from "@/features/auth/api/getCurrentUser";
import { useAuthModal } from "@/features/auth/context/AuthModalProvider";

import {
  checkoutSchema,
  type CheckoutFormValues,
} from "../schemas/checkoutSchema";

import { createOrder, OrderRequestError } from "../api/createOrder";
import type { PaidOrder } from "../types";
import OrderConfirmation from "./OrderConfirmation";

type SeatSelectionModalProps = {
  session: MovieSession;
  ageRatingMinAge: number;
  onClose: () => void;
};

type BookingStep = "seats" | "checkout";

const SeatSelectionModal = ({
  session,
  ageRatingMinAge,
  onClose,
}: SeatSelectionModalProps) => {
  const queryClient = useQueryClient();
  const [selectedSeats, setSelectedSeats] = useState<SessionSeat[]>([]);
  const [hold, setHold] = useState<Hold | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [step, setStep] = useState<BookingStep>("seats");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [ticketTypesBySeat, setTicketTypesBySeat] = useState<
    Record<number, TicketTypeSlug>
  >({});
  const [paidOrder, setPaidOrder] = useState<PaidOrder | null>(null);
  const { openLogin } = useAuthModal();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });

  const { data: currentUserData } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const currentUser = currentUserData?.data;

  useEffect(() => {
    if (!currentUser) return;

    setValue("fullName", currentUser.fullName ?? "");
    setValue("email", currentUser.email ?? "");
    setValue(
      "mobileNumber",
      formatMobileNumber(currentUser.mobileNumber ?? ""),
    );
  }, [currentUser, setValue]);

  const handleCheckoutSubmit = (values: CheckoutFormValues) => {
    if (!hold) return;

    orderMutation.mutate({
      holdId: hold.holdId,
      ...values,
    });
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["seat-map", session.id],
    queryFn: () => getSeatMap(session.id),
  });

  const { data: filterOptions } = useQuery({
    queryKey: ["filter-options"],
    queryFn: getFilterOptions,
    staleTime: Infinity,
  });

  const maxSeatsPerOrder = filterOptions?.data.maxSeatsPerOrder;

  const availableTicketTypes =
    filterOptions?.data.ticketTypes.filter(
      (ticketType) =>
        ticketType.blockedFromRatingAge === null ||
        ageRatingMinAge < ticketType.blockedFromRatingAge,
    ) ?? [];

  useEffect(() => {
    if (!hold) return;

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil((new Date(hold.expiresAt).getTime() - Date.now()) / 1000),
      );

      setSecondsLeft(remaining);

      if (remaining === 0) {
        setHold(null);
        setSelectedSeats([]);
        setTicketTypesBySeat({});
        setStep("seats");
        setBookingError("Your hold time expired. Please re-select your seats.");

        refetch();
      }
    };

    updateTimer();

    const intervalId = window.setInterval(updateTimer, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hold, refetch]);

  const formattedTime = `${Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0")}:${(secondsLeft % 60).toString().padStart(2, "0")}`;

  const holdMutation = useMutation({
    mutationFn: (payload: CreateHoldPayload) => createHold(session.id, payload),

    onSuccess: (response) => {
      setBookingError(null);
      setHold(response.data);
      setStep("checkout");
    },

    onError: async (error, payload) => {
      if (!(error instanceof HoldRequestError)) {
        setBookingError("Something went wrong.");
        return;
      }

      if (error.status === 401) {
        setBookingError(null);

        openLogin(() => {
          holdMutation.mutate(payload);
        });

        return;
      }

      if (error.status === 409 && "contested" in error.data) {
        const contested = error.data.contested;

        setSelectedSeats((currentSeats) =>
          currentSeats.filter((seat) => !contested.includes(seat.code)),
        );

        setTicketTypesBySeat((current) => {
          const next = { ...current };

          selectedSeats.forEach((seat) => {
            if (contested.includes(seat.code)) {
              delete next[seat.id];
            }
          });

          return next;
        });

        setBookingError(`These seats were just taken: ${contested.join(", ")}`);

        await refetch();
        return;
      }

      setBookingError(error.data.message);
    },
  });

  const orderMutation = useMutation({
    mutationFn: createOrder,

    onSuccess: async (response) => {
      setBookingError(null);
      setPaidOrder(response.data);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tickets"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["seat-map", session.id],
        }),

        queryClient.invalidateQueries({
          queryKey: ["movie-sessions"],
        }),
      ]);
    },

    onError: async (error, payload) => {
      if (!(error instanceof OrderRequestError)) {
        setBookingError("Something went wrong. Please try again.");
        return;
      }

      const { status, data } = error;

      if (status === 401) {
        setBookingError(null);

        openLogin(() => {
          orderMutation.mutate(payload);
        });

        return;
      }

      const hasFieldErrors = data.errors && Object.keys(data.errors).length > 0;

      if (status === 422 && hasFieldErrors) {
        Object.entries(data.errors!).forEach(([field, messages]) => {
          if (
            field === "fullName" ||
            field === "email" ||
            field === "mobileNumber" ||
            field === "cardNumber" ||
            field === "expiry" ||
            field === "cvv"
          ) {
            setError(field, {
              type: "server",
              message: messages[0],
            });
          }
        });

        return;
      }

      if (status === 422) {
        setBookingError(data.message);
        setHold(null);
        setSelectedSeats([]);
        setTicketTypesBySeat({});
        setStep("seats");

        await refetch();
        return;
      }

      if (status === 409) {
        const contested = data.contested ?? [];

        setBookingError(
          contested.length
            ? `These seats are no longer available: ${contested.join(", ")}`
            : data.message,
        );

        setHold(null);

        if (contested.length > 0) {
          const contestedSeatIds = new Set(
            selectedSeats
              .filter((seat) => contested.includes(seat.code))
              .map((seat) => seat.id),
          );

          setSelectedSeats((currentSeats) =>
            currentSeats.filter((seat) => !contested.includes(seat.code)),
          );

          setTicketTypesBySeat((current) => {
            const next = { ...current };

            contestedSeatIds.forEach((seatId) => {
              delete next[seatId];
            });

            return next;
          });
        } else {
          setSelectedSeats([]);
          setTicketTypesBySeat({});
        }

        setStep("seats");

        await refetch();
        return;
      }

      if (status === 403) {
        setBookingError(data.message);
        setHold(null);
        setSelectedSeats([]);
        setTicketTypesBySeat({});
        setStep("seats");

        await refetch();
        return;
      }

      setBookingError(
        data.message || "Something went wrong. Please try again.",
      );
    },
  });

  const createHoldPayload = (
    changedSeatId?: number,
    changedTicketType?: TicketTypeSlug,
  ): CreateHoldPayload => ({
    seats: selectedSeats.map((seat) => ({
      seatId: seat.id,
      ticketType:
        seat.id === changedSeatId && changedTicketType
          ? changedTicketType
          : (ticketTypesBySeat[seat.id] ?? "adult"),
    })),
  });

  useEffect(() => {
    if (!data) return;

    const mySeats = data.data.sections.flatMap((section) =>
      section.rows.flatMap((row) => row.seats.filter((seat) => seat.isMine)),
    );

    setSelectedSeats((currentSeats) =>
      currentSeats.length > 0 ? currentSeats : mySeats,
    );

    if (mySeats.length > 0) {
      setTicketTypesBySeat((current) => {
        const next = { ...current };

        mySeats.forEach((seat) => {
          if (!next[seat.id]) {
            next[seat.id] = "adult";
          }
        });

        return next;
      });
    }
  }, [data]);

  const handleSeatClick = (seat: SessionSeat) => {
    const isSelected = selectedSeats.some(
      (selectedSeat) => selectedSeat.id === seat.id,
    );

    if (isSelected) {
      setSelectedSeats((currentSeats) =>
        currentSeats.filter((selectedSeat) => selectedSeat.id !== seat.id),
      );

      setTicketTypesBySeat((current) => {
        const next = { ...current };
        delete next[seat.id];
        return next;
      });

      return;
    }

    if (!maxSeatsPerOrder || selectedSeats.length >= maxSeatsPerOrder) return;

    setSelectedSeats((currentSeats) => [...currentSeats, seat]);

    setTicketTypesBySeat((current) => ({
      ...current,
      [seat.id]: "adult",
    }));
  };

  const getSeatClassName = (seat: SessionSeat) => {
    const isSelected = selectedSeats.some(
      (selectedSeat) => selectedSeat.id === seat.id,
    );

    if (isSelected) {
      return "border-[#EC3013] bg-[#EC3013] text-white";
    }

    if (seat.state === "sold") {
      return "cursor-not-allowed border-white/5 bg-white/5 text-white/30";
    }

    if (seat.state === "held") {
      return "cursor-not-allowed border-[#A86A13]/20 bg-[#A86A13]/15 text-[#F4A51C]/60";
    }

    return "cursor-pointer border-white/10 bg-[#1B2030] text-white hover:border-white/30";
  };

  const getSelectedTicketType = (seatId: number) => {
    const selectedType = ticketTypesBySeat[seatId] ?? "adult";

    return availableTicketTypes.find(
      (ticketType) => ticketType.slug === selectedType,
    );
  };

  const previewSubtotal = selectedSeats.reduce((total, seat) => {
    const ticketType = getSelectedTicketType(seat.id);
    const priceRatio = ticketType?.priceRatio ?? 1;

    return total + session.price * priceRatio;
  }, 0);

  const formatMobileNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);

    return [
      digits.slice(0, 3),
      digits.slice(3, 5),
      digits.slice(5, 7),
      digits.slice(7, 9),
    ]
      .filter(Boolean)
      .join(" ");
  };

  const handleMobileNumberInput = (
    event: React.FormEvent<HTMLInputElement>,
  ) => {
    event.currentTarget.value = formatMobileNumber(event.currentTarget.value);
  };

  const handleCardNumberInput = (event: React.FormEvent<HTMLInputElement>) => {
    const digits = event.currentTarget.value.replace(/\D/g, "").slice(0, 16);

    event.currentTarget.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleExpiryInput = (event: React.FormEvent<HTMLInputElement>) => {
    const digits = event.currentTarget.value.replace(/\D/g, "").slice(0, 4);

    event.currentTarget.value =
      digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const handleCvvInput = (event: React.FormEvent<HTMLInputElement>) => {
    event.currentTarget.value = event.currentTarget.value
      .replace(/\D/g, "")
      .slice(0, 3);
  };

  return (
    <Modal onClose={onClose}>
      {paidOrder ? (
        <OrderConfirmation order={paidOrder} onClose={onClose} />
      ) : (
        <div className="w-245 max-w-[calc(100vw-40px)] rounded-2xl bg-[#070C1C] px-6 py-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {step === "seats" ? "Select seats" : "Checkout"}
              </h2>

              <p className="mt-1 text-sm text-white/50">
                {session.venue.name} · Hall {session.hall.name} · {session.time}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-xl text-white/60 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex flex-1 rounded-full bg-[#1B2030] p-1">
              <button
                type="button"
                onClick={() => setStep("seats")}
                className={`flex h-7 flex-1 cursor-pointer items-center justify-center rounded-full text-[11px] font-semibold ${step === "seats" ? "bg-[#EC3013] text-white" : "text-white/70"}`}
              >
                SEATS
              </button>

              <button
                type="button"
                onClick={() => {
                  if (hold) setStep("checkout");
                }}
                disabled={!hold}
                className={`flex h-7 flex-1 items-center justify-center rounded-full text-[11px] font-semibold ${hold ? "cursor-pointer" : "cursor-not-allowed"} ${step === "checkout" ? "bg-[#EC3013] text-white" : "text-white/70"}`}
              >
                CHECKOUT
              </button>
            </div>

            {hold && (
              <div className="flex min-w-24 flex-col items-center justify-center rounded-lg bg-[#1B2030] px-3 py-2">
                <span className="text-[8px] font-medium uppercase tracking-wide text-white/50">
                  Seats held
                </span>

                <span className="mt-0.5 text-[12px] font-semibold text-white">
                  {formattedTime}
                </span>
              </div>
            )}
          </div>
          {step === "seats" && (
            <>
              {isLoading && (
                <div className="flex h-80 items-center justify-center">
                  <p className="text-sm text-white/50">Loading seats...</p>
                </div>
              )}

              {error && (
                <div className="flex h-80 items-center justify-center">
                  <p className="text-sm text-[#EC3013]">
                    Failed to load seats.
                  </p>
                </div>
              )}

              {data && (
                <div className="mt-5 grid grid-cols-[minmax(0,1fr)_280px] gap-5">
                  <div className="pr-5">
                    <div className="h-7 w-full rounded-md bg-[#1B2030]">
                      <p className="flex h-full items-center justify-center text-[10px] font-medium uppercase text-white/70">
                        Screen
                      </p>
                    </div>

                    <div className="mt-8 flex flex-col gap-7">
                      {data.data.sections.map((section) => (
                        <div key={section.name}>
                          <h3 className="mb-3 text-[12px] font-medium uppercase text-white/50">
                            {section.name}
                          </h3>

                          <div className="flex flex-col gap-2">
                            {section.rows.map((row) => (
                              <div
                                key={row.label}
                                className="flex items-center gap-3"
                              >
                                <span className="w-5 text-[11px] font-medium text-white/50">
                                  {row.label}
                                </span>

                                <div className="flex items-center">
                                  {row.seats.map((seat) => {
                                    if (seat.state === "unavailable") {
                                      return (
                                        <span
                                          key={seat.id}
                                          className={`h-8 w-8 ${seat.aisleAfter ? "mr-4" : "mr-1.5"}`}
                                        />
                                      );
                                    }

                                    const isDisabled =
                                      seat.state === "sold" ||
                                      (seat.state === "held" && !seat.isMine);

                                    return (
                                      <div
                                        key={seat.id}
                                        className={`flex ${seat.aisleAfter ? "mr-4" : "mr-1.5"}`}
                                      >
                                        <button
                                          type="button"
                                          disabled={isDisabled}
                                          onClick={() => handleSeatClick(seat)}
                                          className={`flex h-8 w-8 items-center justify-center rounded-md border text-[11px] font-semibold transition-colors ${getSeatClassName(seat)}`}
                                        >
                                          {seat.label}
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 flex items-center justify-center gap-4 text-[9px] text-white/50">
                      <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded bg-[#1B2030] ring-1 ring-white/20" />
                        <span>Available</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded bg-[#EC3013]" />
                        <span>Selected</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded bg-white/5" />
                        <span>Sold</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded bg-[#A86A13]/20" />
                        <span>Held by another user</span>
                      </div>
                    </div>
                  </div>

                  <aside className="flex min-h-85 flex-col border-l border-white/10 pl-5">
                    <p className="text-sm font-semibold text-white">
                      Your seats · Max {maxSeatsPerOrder}
                    </p>

                    <div className="mt-3 flex flex-col gap-3">
                      {selectedSeats.length === 0 && (
                        <div className="rounded-xl bg-[#1B2030] p-4">
                          <p className="text-[11px] text-white/40">
                            Select a seat from the map.
                          </p>
                        </div>
                      )}

                      {selectedSeats.map((seat) => {
                        const selectedTicketType = getSelectedTicketType(
                          seat.id,
                        );
                        const price =
                          session.price * (selectedTicketType?.priceRatio ?? 1);

                        return (
                          <div
                            key={seat.id}
                            className="rounded-xl bg-[#1B2030] p-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-[9px] text-white/50">
                                  Seat
                                </span>

                                <span className="text-[11px] font-semibold text-white">
                                  {seat.code}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-[11px] font-semibold text-white">
                                  ₾
                                  {Number.isInteger(price)
                                    ? price
                                    : price.toFixed(2)}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleSeatClick(seat)}
                                  className="cursor-pointer text-[13px] text-white/50 hover:text-white"
                                >
                                  ×
                                </button>
                              </div>
                            </div>

                            <div className="mt-3 flex gap-2">
                              {availableTicketTypes.map((ticketType) => {
                                const isActive =
                                  (ticketTypesBySeat[seat.id] ?? "adult") ===
                                  ticketType.slug;

                                return (
                                  <button
                                    key={ticketType.id}
                                    type="button"
                                    onClick={() =>
                                      setTicketTypesBySeat((current) => ({
                                        ...current,
                                        [seat.id]: ticketType.slug,
                                      }))
                                    }
                                    className={`flex-1 cursor-pointer rounded-full px-2 py-2 text-[9px] font-medium transition-colors ${
                                      isActive
                                        ? "bg-[#EC3013] text-white"
                                        : "bg-[#101525] text-white/70 hover:bg-white/10"
                                    }`}
                                  >
                                    {ticketType.name}{" "}
                                    {Math.round(ticketType.priceRatio * 100)}%
                                  </button>
                                );
                              })}
                            </div>

                            {selectedTicketType?.note && (
                              <p className="mt-2 text-[9px] text-white/40">
                                {selectedTicketType.note}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-auto pt-6">
                      {bookingError && (
                        <p className="mb-3 text-[11px] text-[#EC3013]">
                          {bookingError}
                        </p>
                      )}

                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[10px] font-medium uppercase text-white/50">
                          Subtotal
                        </span>

                        <span className="text-lg font-bold text-white">
                          ₾
                          {Number.isInteger(previewSubtotal)
                            ? previewSubtotal
                            : previewSubtotal.toFixed(2)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => holdMutation.mutate(createHoldPayload())}
                        disabled={
                          !selectedSeats.length || holdMutation.isPending
                        }
                        className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-[#EC3013] text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {holdMutation.isPending
                          ? "Holding..."
                          : "Next: Checkout"}
                      </button>
                    </div>
                  </aside>
                </div>
              )}
            </>
          )}

          {step === "checkout" && hold && (
            <div className="mt-5">
              <div className="grid grid-cols-[minmax(0,1fr)_250px] gap-5">
                <form
                  id="checkout-form"
                  onSubmit={handleSubmit(handleCheckoutSubmit)}
                >
                  <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                    <div className="col-span-2">
                      <label className="mb-1.5 block text-[10px] font-medium text-white">
                        Full Name
                      </label>

                      <input
                        type="text"
                        autoComplete="name"
                        placeholder="e.g. John Doe"
                        {...register("fullName")}
                        className="h-10 w-full rounded-lg border border-white/5 bg-[#1B2030] px-3 text-[12px] text-white outline-none placeholder:text-white/30 focus:border-white/20"
                      />

                      {errors.fullName && (
                        <p className="mt-1 text-[10px] text-[#EC3013]">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[10px] font-medium text-white">
                        Email
                      </label>

                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="e.g. john@example.com"
                        {...register("email")}
                        className="h-10 w-full rounded-lg border border-white/5 bg-[#1B2030] px-3 text-[12px] text-white outline-none placeholder:text-white/30 focus:border-white/20"
                      />

                      {errors.email && (
                        <p className="mt-1 text-[10px] text-[#EC3013]">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[10px] font-medium text-white">
                        Mobile Number
                      </label>

                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="e.g. 555 12 34 56"
                        maxLength={12}
                        onInput={handleMobileNumberInput}
                        {...register("mobileNumber")}
                        className="h-10 w-full rounded-lg border border-white/5 bg-[#1B2030] px-3 text-[12px] text-white outline-none placeholder:text-white/30 focus:border-white/20"
                      />

                      {errors.mobileNumber && (
                        <p className="mt-1 text-[10px] text-[#EC3013]">
                          {errors.mobileNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <label className="mb-1.5 block text-[10px] font-medium text-white">
                        Card Number
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        onInput={handleCardNumberInput}
                        {...register("cardNumber")}
                        className="h-10 w-full rounded-lg border border-white/5 bg-[#1B2030] px-3 text-[12px] text-white outline-none placeholder:text-white/30 focus:border-white/20"
                      />

                      {errors.cardNumber && (
                        <p className="mt-1 text-[10px] text-[#EC3013]">
                          {errors.cardNumber.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[10px] font-medium text-white">
                        Expiry
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM/YY"
                        maxLength={5}
                        onInput={handleExpiryInput}
                        {...register("expiry")}
                        className="h-10 w-full rounded-lg border border-white/5 bg-[#1B2030] px-3 text-[12px] text-white outline-none placeholder:text-white/30 focus:border-white/20"
                      />

                      {errors.expiry && (
                        <p className="mt-1 text-[10px] text-[#EC3013]">
                          {errors.expiry.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[10px] font-medium text-white">
                        CVV
                      </label>

                      <input
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="123"
                        maxLength={3}
                        onInput={handleCvvInput}
                        {...register("cvv")}
                        className="h-10 w-full rounded-lg border border-white/5 bg-[#1B2030] px-3 text-[12px] text-white outline-none placeholder:text-white/30 focus:border-white/20"
                      />

                      {errors.cvv && (
                        <p className="mt-1 text-[10px] text-[#EC3013]">
                          {errors.cvv.message}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
                <aside className="flex flex-col">
                  <p className="mb-2 text-[10px] font-semibold text-white">
                    Summary
                  </p>

                  <div className="rounded-xl bg-[#1B2030] p-3">
                    <p className="text-[11px] font-bold text-white">
                      {session.venue.name}
                    </p>

                    <p className="mt-1 text-[9px] text-white/50">
                      Hall {session.hall.name} · {session.time}
                    </p>

                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/50">Seats</span>

                        <span className="text-[10px] font-medium text-white">
                          {hold.seats.map((seat) => seat.code).join(", ")}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-white/50">
                          Tickets
                        </span>

                        <span className="text-[10px] font-medium text-white">
                          {hold.seats
                            .map((seat) => seat.ticketType.name)
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase text-white/50">
                        Subtotal
                      </span>

                      <span className="text-lg font-bold text-white">
                        ₾{hold.subtotal}
                      </span>
                    </div>

                    <button
                      type="submit"
                      form="checkout-form"
                      disabled={isSubmitting || orderMutation.isPending}
                      className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-[#EC3013] text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isSubmitting || orderMutation.isPending
                        ? "Processing..."
                        : "Pay · Complete order"}
                    </button>
                  </div>
                </aside>
              </div>

              {bookingError && (
                <p className="mt-3 text-[12px] text-[#EC3013]">
                  {bookingError}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default SeatSelectionModal;
