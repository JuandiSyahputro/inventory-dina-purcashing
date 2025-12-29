"use client";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { CircleCheck, CircleX, Loader } from "lucide-react";
import { Activity } from "react";

export const columnProductUser: ColumnDef<ProductTypes>[] = [
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
      const isPending = !row.original.status || row.original.status === 3;
      const isApproved = row.original.status === 1 || row.original.status === 4;
      const isRejected = row.original.status === 2 || row.original.status === 5;

      return (
        <Badge variant="outline" className={cn("text-muted-foreground px-2 py-1.5 [&>svg]:size-4.5", isApproved && "bg-green-50 text-green-700 border-green-600", isRejected && "text-destructive")}>
          <Activity mode={isPending ? "visible" : "hidden"}>
            <Loader size={30} />
          </Activity>
          <Activity mode={isApproved ? "visible" : "hidden"}>
            <CircleCheck size={30} className="text-white fill-green-500 dark:fill-green-400" />
          </Activity>
          <Activity mode={isRejected ? "visible" : "hidden"}>
            <CircleX size={30} className="text-white fill-destructive dark:fill-destructive" />
          </Activity>

          {isPending && "Pending"}
          {isApproved && "Approved"}
          {isRejected && "Rejected"}
        </Badge>
      );
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
