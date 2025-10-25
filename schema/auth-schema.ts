import * as z from "zod";

export const LoginSchema = z.object({
  email: z
    .string({
      error: (value) => (value.input === "" || value.input === undefined ? "This is required" : "Invalid email"),
    })
    .min(5, "Email or Username must be at least 5 characters"),
  password: z
    .string({
      error: (value) => (value.input === "" || value.input === undefined ? "Password is required" : "Invalid password"),
    })
    .min(6, "Password must be at least 6 characters"),
});

export const RegisterSchema = z
  .object({
    name: z
      .string({
        error: (value) => (value.input === "" || value.input === undefined ? "Name is required" : "Invalid name"),
      })
      .min(5, "Name must be at least 5 characters"),
    storeId: z
      .string({
        error: (value) => (value.input === "" || value.input === undefined ? "Store is required" : "Invalid store"),
      })
      .min(3, "Store must be required"),
    role: z
      .string({
        error: (value) => (value.input === "" || value.input === undefined ? "Role is required" : "Invalid role"),
      })
      .min(3, "Role must be required"),
    password: z
      .string({
        error: (value) => (value.input === "" || value.input === undefined ? "Password is required" : "Invalid password"),
      })
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string({
        error: (value) => (value.input === "" || value.input === undefined ? "Confirm Password is required" : "Invalid confirm password"),
      })
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
