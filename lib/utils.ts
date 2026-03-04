import { Role } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

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
    stockCurrent: product.status === 1 || product.status === 4 ? (product.stockIn ?? 0) - (product.stockOut ?? 0) : product.stockIn ?? 0,
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

export function camelCaseToLabel(key: string) {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (str) => str.toUpperCase());
}

export function renderValueKey(value: unknown): string {
  if (value instanceof Date) {
    return dayjs(value).format("DD MMM YYYY");
  }

  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }

  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value as string;
}

export function filterExcludedKeys<T extends Record<string, unknown>>(obj: T, excluded: (keyof T | string)[]) {
  return Object.keys(obj).filter((key) => !excluded.includes(key));
}

export const exportToExcel = ({ data, fileName }: { data: ProductTypes[]; fileName: string }) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the workbook and trigger the file download
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const generateCacheKey = (props: GetProductItemTypes) => {
  const {
    typeCache = "products",
    store_name = "all",
    status = "all",
    isByOrderStatus = false,
    queryParams: { limit = 10, offset = 0, search = "" },
  } = props;

  return `inventory:prod:${typeCache}:${store_name}:${status}:${isByOrderStatus}:${limit}:${offset}:${search}`;
};
