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
      .trim()
      .min(5, "Name must be at least 5 characters")
      .refine((val) => !/\s/.test(val), { message: "Name must not contain spaces" }),
    storeId: z.string().optional().or(z.literal("")),
    role: z.enum(["SUPERADMIN", "ADMIN", "USER", "GUEST"]).or(z.string().min(1, "Role must be required")),
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
  .superRefine((data, ctx) => {
    // password match validation
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    // conditional storeId validation
    if (data.role !== "SUPERADMIN" && !data.storeId) {
      ctx.addIssue({
        code: "custom",
        message: "Store is required",
        path: ["storeId"],
      });
    }
  });
