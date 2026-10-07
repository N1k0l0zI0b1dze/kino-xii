"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import Modal from "@/components/ui/Modal";
import { getSeatMap } from "@/features/movies/api/getSeatMap";
import type { MovieSession, SessionSeat } from "@/features/movies/types";

import { createHold, HoldRequestError } from "../api/createHold";
import { getFilterOptions } from "../api/getFilterOptions";
import type { CreateHoldPayload, Hold, TicketTypeSlug } from "../types";

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
  const [selectedSeats, setSelectedSeats] = useState<SessionSeat[]>([]);
  const [hold, setHold] = useState<Hold | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [step, setStep] = useState<BookingStep>("seats");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [ticketTypesBySeat, setTicketTypesBySeat] = useState<
    Record<number, TicketTypeSlug>
  >({});

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

    onError: async (error) => {
      if (!(error instanceof HoldRequestError)) {
        setBookingError("Something went wrong.");
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

  return (
    <Modal onClose={onClose}>
      <div className="w-225 max-w-[calc(100vw-40px)] rounded-2xl bg-[#070C1C] p-6 text-white">
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

        {step === "seats" && (
          <>
            {isLoading && (
              <div className="flex h-80 items-center justify-center">
                <p className="text-sm text-white/50">Loading seats...</p>
              </div>
            )}

            {error && (
              <div className="flex h-80 items-center justify-center">
                <p className="text-sm text-[#EC3013]">Failed to load seats.</p>
              </div>
            )}

            {data && (
              <>
                <div className="mx-auto mt-8 h-1.5 w-100 rounded-full bg-white/20" />

                <p className="mt-2 text-center text-[11px] uppercase tracking-widest text-white/40">
                  Screen
                </p>

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

                <div className="mt-8 border-t border-white/10 pt-5">
                  {bookingError && (
                    <p className="mb-3 text-sm text-[#EC3013]">
                      {bookingError}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        Your seats · Max 3
                      </p>

                      <p className="mt-1 text-[12px] text-white/50">
                        {selectedSeats.length
                          ? selectedSeats.map((seat) => seat.code).join(", ")
                          : "No seats selected"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => holdMutation.mutate(createHoldPayload())}
                      disabled={!selectedSeats.length || holdMutation.isPending}
                      className="h-10.5 cursor-pointer rounded-full bg-[#EC3013] px-7 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {holdMutation.isPending
                        ? "Holding..."
                        : "Next to checkout"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {step === "checkout" && hold && (
          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Your seats</p>

              <p className="text-sm font-semibold text-[#EC3013]">
                {formattedTime}
              </p>
            </div>

            <div className="rounded-xl bg-[#1B2030] p-5">
              <div className="flex flex-col gap-3">
                {selectedSeats.map((seat) => {
                  const holdSeat = hold.seats.find(
                    (item) => item.seatId === seat.id,
                  );

                  return (
                    <div
                      key={seat.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="w-12 text-sm font-semibold text-white">
                        {seat.code}
                      </span>

                      <select
                        value={ticketTypesBySeat[seat.id] ?? "adult"}
                        disabled={holdMutation.isPending}
                        onChange={(event) => {
                          const ticketType = event.target
                            .value as TicketTypeSlug;

                          setTicketTypesBySeat((current) => ({
                            ...current,
                            [seat.id]: ticketType,
                          }));

                          holdMutation.mutate(
                            createHoldPayload(seat.id, ticketType),
                          );
                        }}
                        className="cursor-pointer rounded-lg bg-[#101525] px-3 py-2 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {availableTicketTypes.map((ticketType) => (
                          <option key={ticketType.id} value={ticketType.slug}>
                            {ticketType.name}
                          </option>
                        ))}
                      </select>

                      <span className="ml-auto text-sm font-semibold text-white">
                        ₾{holdSeat?.price ?? 0}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-sm text-white/60">Subtotal</span>

                <span className="text-lg font-bold text-white">
                  ₾{hold.subtotal}
                </span>
              </div>
            </div>

            {bookingError && (
              <p className="mt-3 text-sm text-[#EC3013]">{bookingError}</p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SeatSelectionModal;
