import { getProductsItems } from "@/actions/product-actions";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface InboundTableProps<TData> {
  storeName?: string;
  limit?: number;
  columns: ColumnDef<TData>[];
  formAction: React.ReactNode;
}

const InboundTable = async <TData,>({ storeName, limit, columns, formAction }: InboundTableProps<TData>) => {
  const { data: products } = await getProductsItems({ store_name: storeName, isByOrderStatus: true, status: [0, 1], queryParams: { limit: limit ? Number(limit) : 10, offset: 0 } });

  const fetchProductItems = async ({ limit, offset, search }: FetchDataPropsTypes): Promise<{ data: TData[] }> => {
    "use server";
    const { data } = await getProductsItems({ store_name: storeName, isByOrderStatus: true, status: [0, 1], queryParams: { limit, offset, search } });
    return { data: data as TData[] };
  };

  return <DataTable columns={columns} dataProps={products as TData[]} fetchData={fetchProductItems} elements={formAction} title="product code or name" />;
};

export default InboundTable;
