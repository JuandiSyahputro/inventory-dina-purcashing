import * as z from "zod";

export const UnitSchema = z.object({
  name: z
    .string({
      error: (value) => (value.input === "" || value.input === undefined ? "Name is required" : "Invalid name"),
    })
    .min(1, "Unit name must be at least 1 characters"),
});

export const DeletedUnitSchema = z.object({
  id: z.string().min(3, "Id must be at least 3 characters"),
});
