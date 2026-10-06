import Image from "next/image";
import { Ticket } from "../types";

type TicketCardProps = {
  ticket: Ticket;
};
const TicketCard = ({ ticket }: TicketCardProps) => {
  return (
    <div className="flex h-45.75 w-full items-center rounded-[26px] bg-[#1E2031] pl-7.5 gap-4.5 cursor-default">
      <Image
        src={ticket.imgUrl}
        alt={ticket.movieTitle}
        width={100}
        height={133}
        className="h-[133.49px] w-[100.12px] shrink-0 rounded-[10px] object-cover"
      />

      <div className="w-250 h-auto flex flex-col items-start">
        <div className="flex flex-row items-center gap-2.5">
          <h2 className="text-[20px] font-bold text-white">
            {ticket.movieTitle}
          </h2>

          <div className="flex items-center justify-center w-9.5 h-4.75 rounded-full bg-[#EC3013]/10">
            <p className="text-[12px] font-medium text-[#EC3013]">
              {ticket.ageRating}
            </p>
          </div>

          <p className="text-[14px] font-medium text-[#A9A9A9]">
            {ticket.duration} min
          </p>
        </div>

        <div className="flex flex-row gap-10 mt-3">
          <div className="flex flex-col">
            <p className="text-[12px] font-medium text-[#A9A9A9]">DATE</p>
            <p className="text-sm font-medium text-white">
              {ticket.date} · {ticket.time}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-[12px] font-medium text-[#A9A9A9]">VENUE</p>
            <p className="text-sm font-medium text-white">
              {ticket.venue} · {ticket.hall}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-[12px] font-medium text-[#A9A9A9]">FORMAT</p>
            <p className="text-sm font-medium text-white">{ticket.format}</p>
          </div>
        </div>

        <div className="flex flex-row gap-2 mt-3">
          <p className="text-[12px] font-medium text-[#A9A9A9]">SEATS</p>

          {ticket.seats.map((seat) => (
            <div
              key={seat.code}
              className="flex items-center justify-center w-18.5 h-5.25 rounded-md bg-white/10"
            >
              {ticket.refundableUntil && (
                <p className="text-center text-[12px] font-medium text-[#A9A9A9]">
                  Refundable until {ticket.refundableUntil}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col w-75 h-full border-l border-dashed border-[#2A2C3D] px-6">
        <div className="flex flex-col mt-5">
          <p className="text-[12px] font-medium text-[#A9A9A9]">ORDER</p>
          <p className="text-sm font-medium leading-1 text-white">
            {ticket.orderReference}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 mt-4">
          <div className="flex flex-row items-center justify-between">
            <p className="text-sm font-medium text-[#A9A9A9]">Total paid</p>
            <p className="text-[24px] font-extrabold text-white">
              ₾{ticket.totalPaid}
            </p>
          </div>

          <button
            disabled={!ticket.isRefundable}
            className=" h-8.75 w-full rounded-full bg-white/10 text-sm font-bold text-white enabled:cursor-pointer enabled:hover:bg-white/20 disabled:cursor-default disabled:text-white/30"
          >
            Refund
          </button>

          <div className="w-full flex justify-center">
            <p className="text-[12px] font-medium text-[#A9A9A9]">
              Refundable until {ticket.refundableUntil}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
