"use client";

import { useState } from "react";
import TicketCard from "./TicketCard";
import { Ticket } from "../types";

const tickets: Ticket[] = [
  {
    id: 1,
    movieTitle: "The Odyssey",
    imgUrl: "/assets/images/user-profile/ticket-poster.png",
    ageRating: "12+",
    duration: 134,
    date: "15 Sep 2026",
    time: "16:30",
    venue: "Galleria Tbilisi",
    hall: "Hall B",
    format: "MAX · Original + Subtitles",
    seats: [
      {
        code: "B3",
        ticketType: "Adult",
      },
      {
        code: "B4",
        ticketType: "Adult",
      },
      {
        code: "B5",
        ticketType: "Student",
      },
    ],
    status: "upcoming",
    orderReference: "WKX-48291",
    totalPaid: 32,
    isRefundable: true,
    refundableUntil: "11:30, Tue 15 Sep",
  },
  {
    id: 2,
    movieTitle: "Dune: Part Three",
    imgUrl: "/assets/images/user-profile/ticket-poster-2.png",
    ageRating: "12+",
    duration: 134,
    date: "20 Sep 2026",
    time: "21:00",
    venue: "Galleria Tbilisi",
    hall: "Hall B",
    format: "MAX · Original + Subtitles",
    seats: [
      {
        code: "B3",
        ticketType: "Adult",
      },
      {
        code: "B4",
        ticketType: "Adult",
      },
    ],
    status: "past",
    orderReference: "WKX-58312",
    totalPaid: 24,
    isRefundable: false,
    refundableUntil: "11:30, Tue 15 Sep",
  },
];

const MyTickets = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const visibleTickets = tickets.filter(
    (ticket) => ticket.status === activeTab,
  );

  const upcomingCount = tickets.filter(
    (ticket) => ticket.status === "upcoming",
  ).length;

  const pastCount = tickets.filter((ticket) => ticket.status === "past").length;

  return (
    <div className="mt-9 flex flex-col gap-4">
      <div className="flex h-9.75 w-49.75 rounded-xl bg-[#1E2031] px-1.25 py-1.25">
        <button
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

      <div className="mt-5">
        {visibleTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

export default MyTickets;
