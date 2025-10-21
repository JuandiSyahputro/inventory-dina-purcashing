import * as z from "zod";

export const RegisterSchema = z.object({
  name: z.string({
    error: (value) => (value.input === "" || value.input === undefined ? "Name is required" : "Invalid name"),
  }),
  email: z.email({
    error: (value) => (value.input === "" || value.input === undefined ? "Email is required" : "Invalid email"),
  }),
  role: z.string({
    error: (value) => (value.input === "" || value.input === undefined ? "Role is required" : "Invalid role"),
  }),
});

export const LoginSchema = z.object({
  email: z
    .email({
      error: (value) => (value.input === "" || value.input === undefined ? "Email is required" : "Invalid email"),
    })
    .min(6, "Email must be at least 5 characters"),
  password: z
    .string({
      error: (value) => (value.input === "" || value.input === undefined ? "Password is required" : "Invalid password"),
    })
    .min(6, "Password must be at least 6 characters"),
});
