import { getProductsItems } from "@/actions/product-actions";
import { DataTable } from "@/components/data-table";

const RejectedTable = async <TData,>({ storeName, limit, columns, formAction }: TableServerProps<TData>) => {
  const { data: products } = await getProductsItems({ store_name: storeName, status: [2, 5], queryParams: { limit: limit ? Number(limit) : 10, offset: 0 } });

  const fetchProductItems = async ({ limit, offset, search }: FetchDataPropsTypes): Promise<{ data: TData[] }> => {
    "use server";
    const { data } = await getProductsItems({ store_name: storeName, status: [2, 5], queryParams: { limit, offset, search } });
    return { data: data as TData[] };
  };

  return <DataTable columns={columns} dataProps={products as TData[]} fetchData={fetchProductItems} elements={formAction} title="product code or name" />;
};

export default RejectedTable;
