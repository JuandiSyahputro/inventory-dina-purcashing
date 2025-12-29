/* eslint-disable react-hooks/incompatible-library */
"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/* ----------------------------------------------------
   Skeleton helpers
---------------------------------------------------- */

const SKELETON_ROWS = 10;

/* ----------------------------------------------------
   DataTable
---------------------------------------------------- */

export function DataTableSkeleton<TData, TValue>({ columns }: { columns: ColumnDef<TData, TValue>[] }) {
  /* ----------------------------------------------------
     Skeleton-aware data
  ---------------------------------------------------- */

  const tableData = useMemo<TData[]>(() => {
    return Array.from({ length: SKELETON_ROWS }, () => ({} as TData));
  }, []);

  /* ----------------------------------------------------
     Skeleton-aware columns (v8)
  ---------------------------------------------------- */

  const tableColumns = useMemo<ColumnDef<TData, TValue>[]>(() => {
    return columns.map((col) => ({
      ...col,
      header: () => <Skeleton className="w-full h-7" />,
      cell: () => <Skeleton className="w-full h-7" />,
      accessorFn: (row: TData) => {
        if ("accessorKey" in col) {
          return row[col.accessorKey as keyof TData];
        }
        return null;
      },
    })) as ColumnDef<TData, TValue>[];
  }, [columns]);

  /* ----------------------------------------------------
     React Table
  ---------------------------------------------------- */

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  /* ----------------------------------------------------
     Render
  ---------------------------------------------------- */

  return (
    <>
      {/* Search */}
      <div className="flex items-center py-4">
        <Skeleton className="w-full h-7" />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center py-4">
        <Skeleton className="w-full h-7" />
      </div>
    </>
  );
}
