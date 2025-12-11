"use client";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import ProductActionAdmin from "@/components/products/admin/product-action-admin";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { CircleCheck, Loader } from "lucide-react";

export const columnInbound: ColumnDef<ProductTypes>[] = [
  {
    accessorKey: "prCode",
    header: ({ column }) => <DataTableColumnHeader column={column} title="PR Code" />,
    cell: ({ row }) => {
      const prCode = row.original.prCode || "-";
      return <span>{prCode}</span>;
    },
  },
  {
    accessorKey: "productCode",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
    cell: ({ row }) => {
      const productCode = row.original.productCode || "-";
      return <span>{productCode}</span>;
    },
  },
  {
    accessorKey: "productSubCode",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sub Code" />,
    cell: ({ row }) => {
      const productSubCode = row.original.productSubCode || "-";
      return <span>{productSubCode}</span>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const name = row.original.name || "-";
      return <span>{name}</span>;
    },
  },
  {
    accessorKey: "storeName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Store" />,
    cell: ({ row }) => {
      const storeName = row.original.storeName || "-";
      return <span>{storeName}</span>;
    },
  },
  {
    accessorKey: "categoryName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => {
      const categoryName = row.original.categoryName || "-";
      return <span>{categoryName}</span>;
    },
  },
  {
    accessorKey: "unitName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Unit" />,
    cell: ({ row }) => {
      const unitName = row.original.unitName || "-";
      return <span>{unitName}</span>;
    },
  },
  {
    accessorKey: "vendorName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Vendor" />,
    cell: ({ row }) => {
      const vendorName = row.original.vendorName || "-";
      return <span>{vendorName}</span>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => {
      const price = row.original.price || "-";
      return <span>{price}</span>;
    },
  },
  {
    accessorKey: "stockIn",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock In" />,
    cell: ({ row }) => {
      const stockIn = row.original.stockIn || "-";
      return <span>{stockIn}</span>;
    },
  },
  {
    accessorKey: "stockCurrent",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Current Stock" />,
    cell: ({ row }) => {
      const stockCurrent = row.original.stockCurrent || "-";
      return <span>{stockCurrent}</span>;
    },
  },
  {
    accessorKey: "stockOut",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock Out" />,
    cell: ({ row }) => {
      const stockOut = row.original.stockOut || "-";
      return <span>{stockOut}</span>;
    },
  },
  {
    accessorKey: "dateIn",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date In" />,
    cell: ({ row }) => {
      const dateIn = row.original.dateIn ? dayjs(row.original.dateIn).format("D MMMM YYYY") : "-";
      return <span>{dateIn}</span>;
    },
  },
  {
    accessorKey: "dateOut",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date Out" />,
    cell: ({ row }) => {
      const dateOut = row.original.dateOut ? dayjs(row.original.dateOut).format("D MMMM YYYY") : "-";
      return <span>{dateOut}</span>;
    },
  },
  {
    accessorKey: "remarks",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Remarks" />,
    cell: ({ row }) => {
      const remarks = row.original.remarks || "-";
      return <span>{remarks}</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="text-muted-foreground px-2 py-1.5">
          {row.original.status ? <CircleCheck className="fill-green-500 dark:fill-green-400" /> : <Loader />}
          {row.original.status ? "Approved" : "Pending"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Submission Date" />,
    cell: ({ row }) => <span>{dayjs(row.original.createdAt).format("D MMMM YYYY")}</span>,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated Date" />,
    cell: ({ row }) => <span>{dayjs(row.original.updatedAt).format("D MMMM YYYY")}</span>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <ProductActionAdmin product={row.original} />;
    },
  },
];
