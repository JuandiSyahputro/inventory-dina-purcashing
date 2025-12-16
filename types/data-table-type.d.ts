import { ColumnDef } from "@tanstack/react-table";

export {};
declare global {
  interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    dataProps: TData[];
    title?: string;
    elements?: React.ReactNode;
    fetchData: ({ limit, offset }: FetchDataPropsTypes) => Promise<{
      data: TData[];
    }>;
  }
}
