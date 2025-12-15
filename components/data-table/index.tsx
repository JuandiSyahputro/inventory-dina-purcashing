/* eslint-disable react-hooks/incompatible-library */
"use client";

import { ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DataTable<TData, TValue>({ columns, title, dataProps, fetchData, elements, searchBy = "name" }: DataTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>(dataProps);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [paginateCursor, setPaginateCursor] = useState({
    limit: 10,
    offset: 0,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleNext = async () => {
    const res = await fetchData({
      offset: paginateCursor.offset + paginateCursor.limit,
      limit: paginateCursor.limit,
    });

    setData(res.data);

    setPaginateCursor((prev) => ({
      ...prev,
      offset: prev.offset + prev.limit,
    }));
  };

  const handlePrev = async () => {
    const res = await fetchData({
      offset: paginateCursor.offset - paginateCursor.limit,
      limit: paginateCursor.limit,
    });

    setData(res.data);

    setPaginateCursor((prev) => ({
      ...prev,
      offset: prev.offset - prev.limit,
    }));
  };

  const handleChangeLimit = async (limit: number) => {
    const res = await fetchData({ limit, offset: 0 });

    setData(res.data);
    setPaginateCursor((prev) => ({ ...prev, limit, offset: 0 }));
  };

  return (
    <>
      <div className="flex items-center py-4">
        <Input placeholder={`Search by ${title}...`} value={(table.getColumn(searchBy)?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn(searchBy)?.setFilterValue(event.target.value)} className="max-w-sm" />
        <div className="ml-auto flex items-center gap-3">
          {elements}
          {/* <DataTableViewOptions table={table} /> */}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="space-x-5">
                {headerGroup.headers.map((header) => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => {
                    return <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>;
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center space-x-2 py-4">
        <div className="flex w-full items-center justify-between px-2">
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${paginateCursor.limit}`}
                onValueChange={(value) => {
                  handleChangeLimit(Number(value));
                }}>
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={paginateCursor.limit} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="h-8 w-8 p-0 disabled:bg-accent-foreground disabled:[&>svg]:text-muted-foreground" onClick={handlePrev} disabled={!paginateCursor.offset}>
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0 disabled:bg-accent-foreground disabled:[&>svg]:text-muted-foreground" onClick={handleNext} disabled={data.length < paginateCursor.limit}>
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
