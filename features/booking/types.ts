export type HoldSeat = {
  seatId: number;
  code: string;
  ticketType: {
    slug: string;
    name: string;
  };
  price: number;
};

export type Hold = {
  holdId: string;
  sessionId: number;
  expiresAt: string;
  secondsRemaining: number;
  isLive: boolean;
  subtotal: number;
  seats: HoldSeat[];
};

export type HoldResponse = {
  data: Hold;
};

export type TicketTypeSlug = "adult" | "student" | "child";

export type CreateHoldSeat = {
  seatId: number;
  ticketType: TicketTypeSlug;
};

export type CreateHoldPayload = {
  seats: CreateHoldSeat[];
};

export type HoldConflictResponse = {
  message: string;
  contested: string[];
};

export type BookingErrorResponse = {
  message: string;
  errors?: Record<string, string[]>;
};

export type TicketTypeOption = {
  id: number;
  slug: "adult" | "child" | "student";
  name: string;
  priceRatio: number;
  note: string | null;
  blockedFromRatingAge: number | null;
};

export type FilterOptionsResponse = {
  data: {
    ticketTypes: TicketTypeOption[];
    maxSeatsPerOrder: number;
    holdMinutes: number;
  };
};

export type CreateOrderPayload = {
  holdId: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

export type OrderTicket = {
  id: number;
  seatCode: string;
  ticketType: {
    slug: string;
    name: string;
  };
  price: number;
};

export type PaidOrder = {
  id: number;
  reference: string;
  status: string;
  totalPrice: number;
  paidAt: string;
  refundedAt: string | null;
  isUpcoming: boolean;
  isRefundable: boolean;
  cardLastFour: string;

  contact: {
    fullName: string;
    email: string;
    mobileNumber: string;
  };

  session: {
    id: number;
    startsAt: string;
    date: string;
    time: string;
    timeBand: string;
    price: number;
    seatsLeft: number;
    isSoldOut: boolean;

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
      backdropUrl: string;
      ageRating: {
        code: string;
        minAge: number;
        description: string;
      };
    };
  };

  tickets: OrderTicket[];
};

export type CreateOrderResponse = {
  data: PaidOrder;
};

export type OrderErrorResponse = {
  message: string;
  errors?: Record<string, string[]>;
  contested?: string[];
};
