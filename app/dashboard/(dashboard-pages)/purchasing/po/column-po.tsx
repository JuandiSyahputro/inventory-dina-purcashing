"use client";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import VendorAction from "@/components/vendor/vendor-action";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";

export const columnPo: ColumnDef<VendorTypes>[] = [
  {
    id: "No.",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}.</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Product Name" />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created Date" />,
    cell: ({ row }) => <span>{dayjs(row.original.createdAt).format("D MMMM YYYY - HH:mm")}</span>,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated Date" />,
    cell: ({ row }) => <span>{dayjs(row.original.updatedAt).format("D MMMM YYYY - HH:mm")}</span>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <VendorAction vendor={row.original} />;
    },
  },
];
