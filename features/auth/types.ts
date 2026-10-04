export type User = {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  fullName: string | null;
  mobileNumber: string | null;
  dateOfBirth: string | null;
  age: number | null;
  preferredVenue: string | null;
  profileComplete: boolean;
};

export type CurrentUserResponse = {
  data: User;
};
