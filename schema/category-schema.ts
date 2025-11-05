import * as z from "zod";

export const CategorySchema = z.object({
  name: z
    .string({
      error: (value) => (value.input === "" || value.input === undefined ? "Name is required" : "Invalid name"),
    })
    .min(3, "Category name must be at least 3 characters"),
});

export const DeletedCategorySchema = z.object({
  id: z.string().min(3, "Id must be at least 3 characters"),
});
