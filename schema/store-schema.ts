import * as z from "zod";

export const AddStoreSchema = z.object({
  id: z.string().min(3, "Id must be at least 3 characters").optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
});
