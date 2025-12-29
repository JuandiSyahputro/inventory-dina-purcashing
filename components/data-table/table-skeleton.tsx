/* eslint-disable react-hooks/incompatible-library */
"use client";

import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useSearchFetch } from "@/hooks/use-search-fetch";

/* ----------------------------------------------------
   Skeleton helpers
---------------------------------------------------- */

const SKELETON_ROWS = 10;

function TableCellSkeleton() {
  return <div className="h-4 w-full rounded bg-muted animate-pulse" />;
}

function TableHeaderSkeleton() {
  return <div className="h-4 w-24 rounded bg-muted animate-pulse" />;
}

/* ----------------------------------------------------
   DataTable
---------------------------------------------------- */

export function DataTable<TData, TValue>({ columns, title, dataProps, fetchData, elements }: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const limitSize = searchParams?.get("limit");
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState<TData[]>(dataProps);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchData, setSearchData] = useState("");
  const [paginateCursor, setPaginateCursor] = useState({
    limit: limitSize ? Number(limitSize) : 10,
    offset: 0,
  });

  /* ----------------------------------------------------
     Skeleton-aware data
  ---------------------------------------------------- */

  const tableData = useMemo<TData[]>(() => {
    if (isPending) {
      return Array.from({ length: SKELETON_ROWS }, () => ({} as TData));
    }
    return searchData ? data : dataProps;
  }, [isPending, data, dataProps, searchData]);

  /* ----------------------------------------------------
     Skeleton-aware columns (v8)
  ---------------------------------------------------- */

  const tableColumns = useMemo<ColumnDef<TData, TValue>[]>(() => {
    if (!isPending) return columns;

    return columns.map((col) => ({
      ...col,
      header: () => <TableHeaderSkeleton />,
      cell: () => <TableCellSkeleton />,
      accessorFn: (row: TData) => {
        if ("accessorKey" in col) {
          return row[col.accessorKey as keyof TData];
        }
        return null;
      },
    })) as ColumnDef<TData, TValue>[];
  }, [isPending, columns]);

  /* ----------------------------------------------------
     React Table
  ---------------------------------------------------- */

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /* ----------------------------------------------------
     Pagination handlers
  ---------------------------------------------------- */

  const handleNext = async () => {
    startTransition(async () => {
      const res = await fetchData({
        offset: paginateCursor.offset + paginateCursor.limit,
        limit: paginateCursor.limit,
      });
      setData(res.data);
      setPaginateCursor((prev) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }));
    });
  };

  const handlePrev = async () => {
    startTransition(async () => {
      const res = await fetchData({
        offset: paginateCursor.offset - paginateCursor.limit,
        limit: paginateCursor.limit,
      });
      setData(res.data);
      setPaginateCursor((prev) => ({
        ...prev,
        offset: prev.offset - prev.limit,
      }));
    });
  };

  const handleChangeLimit = async (limit: number) => {
    startTransition(async () => {
      const res = await fetchData({ limit });
      setData(res.data);
      setPaginateCursor((prev) => ({ ...prev, limit }));
      router.push(`${pathname}?limit=${limit}`);
    });
  };

  /* ----------------------------------------------------
     Sync server data
  ---------------------------------------------------- */

  useEffect(() => {
    startTransition(() => {
      setData(dataProps);
    });
  }, [dataProps]);

  /* ----------------------------------------------------
     Search
  ---------------------------------------------------- */

  useSearchFetch({
    search: searchData,
    startTransition,
    fetchDefault: async () => {
      if (!searchData) return dataProps;
      const { data } = await fetchData({ search: "" });
      return data;
    },
    fetchSearch: async (search) => {
      const { data } = await fetchData({ search });
      return data;
    },
    onSuccess: (data) => setData(data),
  });

  /* ----------------------------------------------------
     Render
  ---------------------------------------------------- */

  return (
    <>
      {/* Search */}
      <div className="flex items-center py-4">
        <DebouncedInput value={searchData ?? ""} onChange={(value) => setSearchData(String(value))} placeholder={`Search by ${title}...`} className="max-w-sm" />
        <div className="ml-auto flex items-center gap-3">{elements}</div>
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : isPending ? null : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center py-4">
        <div className="flex w-full items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select value={`${paginateCursor.limit}`} onValueChange={(v) => handleChangeLimit(Number(v))}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" className="h-8 w-8 p-0" onClick={handlePrev} disabled={!paginateCursor.offset}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="h-8 w-8 p-0" onClick={handleNext} disabled={data.length < paginateCursor.limit}>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ----------------------------------------------------
   Debounced Input
---------------------------------------------------- */

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce);
    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}
