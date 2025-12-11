"use client";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import ProductAction from "@/components/products/user/product-action";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { CircleCheck, Loader } from "lucide-react";

export const columnInboundUser: ColumnDef<ProductTypes>[] = [
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
  },
  {
    accessorKey: "stockIn",
    header: ({ column }) => <DataTableColumnHeader column={column} title="In Stock" />,
  },
  {
    accessorKey: "stockCurrent",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Current Stock" />,
  },
  {
    accessorKey: "stockOut",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Out Stock" />,
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
      return <ProductAction product={row.original} />;
    },
  },
];
