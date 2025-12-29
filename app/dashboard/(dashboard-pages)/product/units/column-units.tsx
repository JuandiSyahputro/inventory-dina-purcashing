"use client";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import UnitAction from "@/components/units/units-action";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";

export const columnUnits: ColumnDef<UnitTypes>[] = [
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <UnitAction unit={row.original} />;
    },
  },
  {
    id: "No.",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}.</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Unit Name" />,
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
];
