import * as z from "zod";

export const ProductUserSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 characters"),
  stockIn: z.string().min(1, "In stock must be at least 1").optional(),
  storeId: z.string().min(3, "User Id must be at least 3 characters").optional(),
  remarks: z.string().optional(),
});

export const ProductAdminSchema = z.object({
  prCode: z.string().min(1, "Code must be at least 1 characters"),
  productCode: z.string().min(1, "Code must be at least 1 characters"),
  productSubCode: z.string().optional(),
  price: z.string().optional(),
  remarks: z.string().optional(),
  name: z.string().min(1, "Name must be at least 1 characters"),
  stockIn: z.string().min(1, "In stock must be at least 1"),
  unitId: z.string().min(3, "User Id must be at least 3 characters"),
  vendorId: z.string().min(3, "User Id must be at least 3 characters"),
  categoryId: z.string().min(3, "User Id must be at least 3 characters"),
  storeId: z.string().min(3, "User Id must be at least 3 characters"),
});

export const ProductRejectedSchema = z.object({
  remarks: z.string().optional(),
  name: z.string().optional(),
});

export const ProductOutSchema = z.object({
  id: z.string().min(3, "Product must be required"),
  stockOut: z.string().min(1, "Out stock must be at least 1"),
  remarks: z.string().min(3, "Remarks must be required"),
});

export const DeletedProductSchema = z.object({
  id: z.string().min(3, "Id must be at least 3 characters"),
});
