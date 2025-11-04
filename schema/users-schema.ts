import * as z from "zod";

export const ChangePassSchema = z
  .object({
    oldPassword: z
      .string({
        error: (value) => (value.input === "" || value.input === undefined ? "Old Password is required" : "Invalid old password"),
      })
      .min(6, "Old Password must be at least 6 characters"),
    newPassword: z
      .string({
        error: (value) => (value.input === "" || value.input === undefined ? "Password is required" : "Invalid password"),
      })
      .min(6, "Password must be at least 6 characters"),
    confirmNewPassword: z
      .string({
        error: (value) => (value.input === "" || value.input === undefined ? "Confirm Password is required" : "Invalid confirm password"),
      })
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

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

export const DeletedSchema = z.object({
  id: z.string().min(3, "Id must be at least 3 characters"),
});
