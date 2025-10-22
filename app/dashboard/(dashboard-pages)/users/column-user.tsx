"use client";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
// import ActionCellUserManagement from "@/components/user-management/action-cell-user-management";

export const columnUser: ColumnDef<UsersTypes>[] = [
  {
    id: "No.",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}.</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nama" />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     return <ActionCellUserManagement user={row.original} />;
  //   },
  // },
];
