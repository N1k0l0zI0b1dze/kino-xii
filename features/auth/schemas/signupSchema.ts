import { z } from "zod";

export const signupSchema = z
  .object({
    username: z.string().min(1, "Username is required"),

    email: z.string().min(1, "Email is required").email("Enter a valid email"),

    password: z.string().min(3, "At least 3 characters"),

    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
