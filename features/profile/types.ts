export type Ticket = {
  id: number;
  movieTitle: string;
  imgUrl: string;
  ageRating: string;
  duration: number;
  date: string;
  time: string;
  venue: string;
  hall: string;
  format: string;
  seats: {
    code: string;
    ticketType: string;
  }[];
  status: "upcoming" | "past";
  orderReference: string;
  totalPaid: number;
  isRefundable: boolean;
  refundableUntil?: string;
};

export type TicketOrder = {
  id: number;
  reference: string;
  status: string;
  totalPrice: number;
  paidAt: string;
  refundedAt: string | null;
  isUpcoming: boolean;
  isRefundable: boolean;
  cardLastFour: string;

  session: {
    id: number;
    startsAt: string;
    date: string;
    time: string;

    hall: {
      id: number;
      name: string;
    };

    venue: {
      id: number;
      slug: string;
      name: string;
      city: string;
    };

    format: {
      id: number;
      slug: string;
      name: string;
      priceUplift: number;
    };

    language: {
      id: number;
      slug: string;
      name: string;
      code: string;
    };

    movie: {
      id: number;
      slug: string;
      title: string;
      runtimeMinutes: number;
      posterUrl: string;

      ageRating: {
        code: string;
        minAge: number;
        description: string;
      };
    };
  };

  tickets: {
    id: number;
    seatCode: string;
    ticketType: {
      slug: string;
      name: string;
    };
    price: number;
  }[];
};

export type TicketsResponse = {
  data: TicketOrder[];
};

export type RefundOrderResponse = {
  data: TicketOrder;
};
