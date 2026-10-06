export type Ticket = {
  id: number;
  movieTitle: string;
  imgUrl: string;
  ageRating: "12+" | "16+" | "18+";
  duration: number;
  date: string;
  time: string;
  venue: string;
  hall: string;
  format: string;
  seats: {
    code: string;
    ticketType: "Adult" | "Student" | "Child";
  }[];
  status: "upcoming" | "past";
  orderReference: string;
  totalPaid: number;
  isRefundable: boolean;
  refundableUntil?: string;
};
