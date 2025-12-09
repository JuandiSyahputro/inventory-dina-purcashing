import * as z from "zod";

export const ProductUserSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 characters"),
  stockIn: z.string().min(1, "In stock must be at least 1").optional(),
  storeId: z.string().min(3, "User Id must be at least 3 characters").optional(),
});

export const ProductAdminSchema = z.object({
  prCode: z.string().min(1, "Code must be at least 1 characters"),
  productCode: z.string().min(1, "Code must be at least 1 characters"),
  productSubCode: z.string().min(1, "Code must be at least 1 characters"),
  price: z.string().min(1, "Price must be at least 1 characters"),
  remarks: z.string().optional(),
  name: z.string().min(1, "Name must be at least 1 characters"),
  stockIn: z.string().min(1, "In stock must be at least 1"),
  stockOut: z.string().optional(),
  dateIn: z.string().optional(),
  dateOut: z.string().optional(),
  unitId: z.string().min(3, "User Id must be at least 3 characters"),
  vendorId: z.string().min(3, "User Id must be at least 3 characters"),
  categoryId: z.string().min(3, "User Id must be at least 3 characters"),
  storeId: z.string().min(3, "User Id must be at least 3 characters"),
});

export const DeletedProductSchema = z.object({
  id: z.string().min(3, "Id must be at least 3 characters"),
});
