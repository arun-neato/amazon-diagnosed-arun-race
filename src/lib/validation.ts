import { z } from "zod/v4";

const DISPOSABLE_DOMAINS = [
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "throwaway.email",
  "yopmail.com",
  "10minutemail.com",
  "trashmail.com",
  "sharklasers.com",
  "guerrillamailblock.com",
  "grr.la",
  "dispostable.com",
  "mailnesia.com",
  "maildrop.cc",
];

export const gateSchema = z.object({
  answers: z.object({
    q1: z.enum(["A", "B", "C", "D", "E"]),
    q2: z.enum(["A", "B", "C", "D", "E", "F"]),
    q3: z.enum(["A", "B", "C", "D", "E"]),
    q4: z.enum(["A", "B", "C", "D", "E"]),
    q5: z.enum(["A", "B", "C", "D", "E"]),
    q6: z.enum(["A", "B", "C", "D", "E"]),
  }),
  email: z
    .email()
    .refine(
      (email) =>
        !DISPOSABLE_DOMAINS.some((d) => email.toLowerCase().endsWith(`@${d}`)),
      "Please use a business email address",
    ),
  firstName: z.string().min(1, "First name is required"),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  category: z.enum([
    "pet",
    "food-bev",
    "beauty",
    "supplements",
    "home",
    "other",
  ]),
});

export const finalSchema = z.object({
  gateId: z.string().uuid(),
  q7: z.array(z.string()).max(2),
  q8: z.enum(["A", "B", "C", "D", "E"]),
  q9: z.string().optional(),
});
