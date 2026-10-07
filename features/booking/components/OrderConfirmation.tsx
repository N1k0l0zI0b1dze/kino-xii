"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { PaidOrder } from "../types";

type OrderConfirmationProps = {
  order: PaidOrder;
  onClose: () => void;
};

const OrderConfirmation = ({ order, onClose }: OrderConfirmationProps) => {
  const router = useRouter();

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
    .format(new Date(`${order.session.date}T00:00:00`))
    .replace(",", "");

  const ticketSummary = Object.values(
    order.tickets.reduce<Record<string, { name: string; count: number }>>(
      (acc, ticket) => {
        const slug = ticket.ticketType.slug;

        if (!acc[slug]) {
          acc[slug] = {
            name: ticket.ticketType.name,
            count: 0,
          };
        }

        acc[slug].count += 1;

        return acc;
      },
      {},
    ),
  )
    .map(({ name, count }) => `${count} x ${name}`)
    .join(", ");

  const handleViewTickets = () => {
    onClose();
    router.push("/profile?tab=tickets");
  };

  const handleBackHome = () => {
    onClose();
    router.push("/");
  };

  return (
    <div className="w-170 max-w-[calc(100vw-40px)] rounded-2xl bg-[#070C1C] px-10 py-8 text-white">
      <div className="flex flex-col items-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#4ADE80] text-xl font-bold text-white">
          ✓
        </div>

        <h2 className="mt-3 text-xl font-bold">Booking confirmed!</h2>

        <p className="mt-1 max-w-70 text-center text-[10px] leading-4 text-white/50">
          Your tickets are ready. We&apos;ve sent the confirmation to your
          email.
        </p>

        <div className="mt-3 rounded-full bg-[#1B2030] px-5 py-1.5 text-[9px] font-semibold uppercase">
          Order #{order.reference}
        </div>
      </div>

      <div className="mx-auto mt-4 w-full max-w-100 rounded-xl bg-[#1B2030] p-3">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded">
            <Image
              src={order.session.movie.posterUrl}
              alt={order.session.movie.title}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase">
              {order.session.movie.title}
            </h3>

            <p className="mt-1 text-[8px] text-white/50">
              {order.session.venue.name} · Hall {order.session.hall.name} ·{" "}
              {formattedDate} · {order.session.time}
            </p>
          </div>
        </div>

        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-white/50">Seats</span>

            <span className="text-[9px] font-semibold">
              {order.tickets.map((ticket) => ticket.seatCode).join(", ")}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[9px] text-white/50">Tickets</span>

            <span className="text-[9px] font-semibold">{ticketSummary}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-[9px] font-medium uppercase text-white/50">
            Total paid
          </span>

          <span className="text-lg font-bold">₾ {order.totalPrice}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleViewTickets}
          className="h-9 cursor-pointer rounded-full bg-[#EC3013] px-6 text-[10px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          View my tickets
        </button>

        <button
          type="button"
          onClick={handleBackHome}
          className="h-9 cursor-pointer rounded-full bg-[#1B2030] px-6 text-[10px] font-semibold text-white transition-colors hover:bg-[#252B3D]"
        >
          Back to home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
