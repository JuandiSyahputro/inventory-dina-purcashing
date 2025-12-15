import { Role } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatMappingProducts = (products: ProductTypes[]) => {
  return products.map((product) => ({
    id: product.id || "",
    prCode: product.prCode || null,
    productCode: product.productCode || "",
    productSubCode: product.productSubCode || "",
    name: product.name || "",
    price: product.price || 0,
    stockIn: product.stockIn || 0,
    stockCurrent: (product.stockIn ?? 0) - (product.stockOut ?? 0),
    stockOut: product.stockOut || 0,
    dateIn: product.dateIn || undefined,
    dateOut: product.dateOut || undefined,
    remarks: product.remarks || "",
    status: product.status || 0,
    storeId: product.storeId || "",
    storeName: product.store?.name || "",
    unitId: product.unitId || "",
    unitName: product.unit?.name || "",
    vendorId: product.vendorId || "",
    vendorName: product.vendor?.name || "",
    categoryId: product.categoryId || "", // Add this line
    categoryName: product.categories?.name || "",
    store: null,
    unit: null,
    vendor: null,
    categories: null,
    createdAt: product.createdAt || "",
    updatedAt: product.updatedAt || "",
  }));
};

export function filterSidebarByRole(sidebar: NavFillterTypes, role: Role) {
  return {
    navMain: sidebar.navMain
      .filter((item) => item.roles?.includes(role))
      .map((item) => ({
        ...item,
        items: item.items?.filter((sub) => sub.roles?.includes(role)) || [],
      })),

    projects: sidebar.projects.filter((item) => item.roles?.includes(role)),
  };
}

export const encodeCursor = (createdAt: Date) => Buffer.from(createdAt.toISOString()).toString("base64");

export const decodeCursor = (cursor?: string | null): Date | null => {
  if (!cursor) return null;
  const decoded = Buffer.from(cursor, "base64").toString("utf8");
  return new Date(decoded);
};
