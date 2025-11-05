"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import UsersAction from "@/components/users/users-action";

export const columnUser: ColumnDef<UsersTypes>[] = [
  {
    id: "No.",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}.</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <span>{row.original.email !== "" ? row.original.email : "-"}</span>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
  },
  {
    accessorKey: "store_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Store" />,
    cell: ({ row }) => <span>{row.original.store_name ?? "-"}</span>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <UsersAction user={row.original} />;
    },
  },
];
