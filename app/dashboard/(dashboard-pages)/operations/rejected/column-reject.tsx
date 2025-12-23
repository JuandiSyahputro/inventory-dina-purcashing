"use client";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { CircleX } from "lucide-react";
import { Activity } from "react";

export const columnRejected: ColumnDef<ProductTypes>[] = [
  {
    accessorKey: "transaction_type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction Type" />,
    cell: ({ row }) => {
      return <span className="block text-center">{row.original.status < 3 ? "IN" : "OUT"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const isRejected = row.original.status === 2 || row.original.status === 5;

      return (
        <Badge variant="outline" className={cn("text-muted-foreground px-2 py-1.5 [&>svg]:size-4.5", isRejected && "text-destructive")}>
          <Activity mode={isRejected ? "visible" : "hidden"}>
            <CircleX size={30} className="text-white fill-destructive dark:fill-destructive" />
          </Activity>

          {isRejected && "Rejected"}
        </Badge>
      );
    },
  },
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
      const price = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(row.original.price || 0);
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
      const stockOut = row.original.status === 4 ? row.original.stockOut || "-" : 0;
      return <span>{stockOut}</span>;
    },
  },
  {
    accessorKey: "remarks",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Remarks" />,
    cell: ({ row }) => {
      const remarks = row.original.remarks || "-";
      return (
        <Tooltip>
          <TooltipTrigger>
            <span className="block max-w-25 truncate">{remarks}</span>
          </TooltipTrigger>
          <TooltipContent className="bg-custom-primary" arrowClassName="bg-custom-primary fill-custom-primary">
            <p>{remarks}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created Date" />,
    cell: ({ row }) => <span>{dayjs(row.original.createdAt).format("D MMMM YYYY")}</span>,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated Date" />,
    cell: ({ row }) => <span>{dayjs(row.original.updatedAt).format("D MMMM YYYY")}</span>,
  },
];
