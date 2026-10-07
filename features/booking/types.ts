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
