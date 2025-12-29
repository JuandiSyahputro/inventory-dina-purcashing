import { getVendors } from "@/actions/vendor-actions";
import { DataTable } from "@/components/data-table";

const VendorTable = async <TData,>({ limit, columns, formAction }: TableServerProps<TData>) => {
  const { data: dataCategories } = await getVendors({ limit: limit ? Number(limit) : 10, offset: 0 });

  const fetchProductItems = async ({ limit, offset, search }: FetchDataPropsTypes): Promise<{ data: TData[] }> => {
    "use server";
    const { data } = await getVendors({ limit, offset, search });
    return { data: data as TData[] };
  };

  return <DataTable columns={columns} dataProps={dataCategories as TData[]} fetchData={fetchProductItems} elements={formAction} title="vendor name" />;
};

export default VendorTable;
