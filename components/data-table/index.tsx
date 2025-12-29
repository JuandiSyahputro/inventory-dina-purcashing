/* eslint-disable react-hooks/incompatible-library */
"use client";

import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSearchFetch } from "@/hooks/use-search-fetch";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function DataTable<TData, TValue>({ columns, title, dataProps, fetchData, elements }: DataTableProps<TData, TValue>) {
  const { push } = useRouter();
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

  const tableData = useMemo<TData[]>(() => {
    if (isPending) {
      return Array.from({ length: 10 }, () => ({} as TData));
    }
    return data;
  }, [isPending, data]);

  /* ----------------------------------------------------
       Skeleton-aware columns (v8)
    ---------------------------------------------------- */

  const tableColumns = useMemo<ColumnDef<TData, TValue>[]>(() => {
    if (!isPending) return columns;

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
  }, [isPending, columns]);

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
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

  const handleNext = () => {
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

  const handlePrev = () => {
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
    const res = await fetchData({ limit });

    setData(res.data);
    setPaginateCursor((prev) => ({ ...prev, limit }));
    push(`${pathname}?limit=${limit}`);
  };

  useEffect(() => {
    startTransition(() => {
      setData(dataProps);
    });
  }, [dataProps]);

  useSearchFetch({
    search: searchData,
    startTransition: startTransition,
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

  return (
    <>
      <div className="flex items-center py-4">
        <DebouncedInput value={searchData ?? ""} name="search-input" onChange={(value) => setSearchData(String(value))} className="p-2 font-lg shadow border border-block" placeholder={`Search by ${title}...`} />
        <div className="ml-auto flex items-center gap-3">{elements}</div>
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
      <div className="inline-flex min-h-14 max-h-14 w-full items-center justify-between">
        <div className="space-x-6 lg:space-x-8 inline-flex">
          <span>Rows per page</span>
          <Select
            value={`${paginateCursor.limit}`}
            onValueChange={(value) => {
              handleChangeLimit(Number(value));
            }}>
            <SelectTrigger className="h-8 w-[70px] min-w-[70px] max-w-[70px]" aria-label="Rows per page">
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
    </>
  );
}

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
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} className="max-w-sm" />;
}
