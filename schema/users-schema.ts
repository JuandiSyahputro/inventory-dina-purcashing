import * as z from "zod";

export const EditUserSchema = z.object({
  email: z.string("Invalid email").optional(),
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
});
