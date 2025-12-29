"use client";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import ProductActionAdmin from "@/components/products/admin/product-action-admin";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { CircleCheck, Loader } from "lucide-react";
import { Activity } from "react";

export const columnInbound: ColumnDef<ProductTypes>[] = [
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <ProductActionAdmin product={row.original} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className={cn("text-foreground px-2 py-1.5 [&>svg]:size-4.5", row.original.status && "text-green-500")}>
          <Activity mode={!row.original.status ? "visible" : "hidden"}>
            <Loader size={30} />
          </Activity>
          <Activity mode={row.original.status ? "visible" : "hidden"}>
            <CircleCheck size={30} className="text-white fill-green-500 dark:fill-green-400" />
          </Activity>
          {row.original.status ? "Approved" : "Pending"}
        </Badge>
      );
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
    accessorKey: "stockIn",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock In" />,
    cell: ({ row }) => {
      const stockIn = row.original.stockIn || "-";
      return <span>{stockIn}</span>;
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
