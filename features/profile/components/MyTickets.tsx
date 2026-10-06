"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import TicketCard from "./TicketCard";
import { getTickets } from "../api/getTickets";
import { refundOrder } from "../api/refundOrder";
import type { Ticket, TicketOrder, TicketsResponse } from "../types";

const getRefundableUntil = (startsAt: string) => {
  const sessionStart = new Date(startsAt);

  const cutoff = new Date(sessionStart.getTime() - 2 * 60 * 60 * 1000);

  return cutoff.toLocaleString("en-GB", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
};

const mapTicketOrderToTicket = (order: TicketOrder): Ticket => {
  return {
    id: order.id,
    movieTitle: order.session.movie.title,
    imgUrl: order.session.movie.posterUrl,
    ageRating: order.session.movie.ageRating.code,
    duration: order.session.movie.runtimeMinutes,

    date: order.session.date,
    time: order.session.time,

    venue: order.session.venue.name,
    hall: order.session.hall.name,

    format: `${order.session.format.name} · ${order.session.language.name}`,

    seats: order.tickets.map((ticket) => ({
      code: ticket.seatCode,
      ticketType: ticket.ticketType.name,
    })),

    status: order.isUpcoming ? "upcoming" : "past",

    orderReference: order.reference,
    totalPaid: order.totalPrice,
    isRefundable: order.isRefundable,

    refundableUntil: getRefundableUntil(order.session.startsAt),
  };
};

const MyTickets = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tickets"],
    queryFn: getTickets,
  });

  const refundMutation = useMutation({
    mutationFn: refundOrder,

    onSuccess: (response) => {
      queryClient.setQueryData<TicketsResponse>(["tickets"], (oldData) => {
        if (!oldData) return oldData;

        return {
          data: oldData.data.map((order) =>
            order.id === response.data.id ? response.data : order,
          ),
        };
      });
    },

    onError: (error) => {
      alert(error.message);
    },
  });

  const handleRefund = (orderReference: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to refund this order?",
    );

    if (!confirmed) return;

    refundMutation.mutate(orderReference);
  };

  const tickets = (data?.data ?? []).map(mapTicketOrderToTicket);

  const visibleTickets = tickets.filter(
    (ticket) => ticket.status === activeTab,
  );

  const upcomingCount = tickets.filter(
    (ticket) => ticket.status === "upcoming",
  ).length;

  const pastCount = tickets.filter((ticket) => ticket.status === "past").length;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Failed to load tickets.</p>;
  }

  return (
    <div className="mt-9 flex flex-col gap-4">
      <div className="flex h-9.75 w-49.75 rounded-xl bg-[#1E2031] px-1.25 py-1.25">
        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          disabled={activeTab === "upcoming"}
          className={`h-full w-full rounded-[10px] text-[14px] ${
            activeTab === "upcoming"
              ? "bg-[#2A2C3D] text-white"
              : "cursor-pointer text-[#A9A9A9]"
          }`}
        >
          Upcoming {upcomingCount}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("past")}
          disabled={activeTab === "past"}
          className={`h-full w-full rounded-[10px] text-[14px] ${
            activeTab === "past"
              ? "bg-[#2A2C3D] text-white"
              : "cursor-pointer text-[#A9A9A9]"
          }`}
        >
          Past {pastCount}
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {visibleTickets.length === 0 ? (
          <div className="flex min-h-40 items-center justify-center">
            <p className="text-sm text-[#A9A9A9]">
              {activeTab === "upcoming"
                ? "No upcoming tickets."
                : "No past tickets."}
            </p>
          </div>
        ) : (
          visibleTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onRefund={handleRefund}
              isRefunding={
                refundMutation.isPending &&
                refundMutation.variables === ticket.orderReference
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyTickets;
