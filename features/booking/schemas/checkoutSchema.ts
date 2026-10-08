import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters"),

  email: z.string().trim().email("Enter a valid email address"),

  mobileNumber: z
    .string()
    .trim()
    .refine((value) => {
      const digits = value.replace(/\s/g, "");

      return /^5\d{8}$/.test(digits);
    }, "Enter a valid Georgian mobile number"),

  cardNumber: z
    .string()
    .trim()
    .refine((value) => {
      const digits = value.replace(/\s/g, "");

      return /^\d{16}$/.test(digits);
    }, "Card number must contain 16 digits"),

  expiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format")
    .refine((value) => {
      const [month, year] = value.split("/").map(Number);

      const expiryDate = new Date(2000 + year, month, 0, 23, 59, 59);
      const now = new Date();

      return expiryDate >= now;
    }, "Card has expired"),

  cvv: z
    .string()
    .trim()
    .regex(/^\d{3}$/, "CVV must contain 3 digits"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
