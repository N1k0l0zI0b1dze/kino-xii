import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),

  mobileNumber: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^5\d{8}$/, "Enter a valid Georgian mobile number"),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((value) => {
      const birthDate = new Date(value);
      const today = new Date();

      const minimumDate = new Date(
        today.getFullYear() - 12,
        today.getMonth(),
        today.getDate(),
      );

      return birthDate <= minimumDate;
    }, "You must be at least 12 years old"),

  preferredVenueId: z.number().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
