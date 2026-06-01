import { z } from "zod";
import { CollectionCategory } from "@prisma/client";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores");

export const onboardingSchema = z.object({
  username: usernameSchema,
  displayName: z.string().min(1).max(50),
  bio: z.string().max(160).optional(),
  location: z.string().max(100).optional(),
  interests: z.array(z.nativeEnum(CollectionCategory)).min(1).max(5),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupSchema = loginSchema.extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const commentSchema = z.object({
  text: z.string().min(1).max(500),
  flexItemId: z.string(),
});
