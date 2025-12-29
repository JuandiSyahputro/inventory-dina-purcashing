"use client";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import ProductAction from "@/components/products/user/product-action-user";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { CircleCheck, Loader } from "lucide-react";
import { Activity } from "react";

export const columnInboundUser: ColumnDef<ProductTypes>[] = [
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Activity mode={!row.original.status ? "visible" : "hidden"}>
          <ProductAction product={row.original} />
        </Activity>
      );
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
