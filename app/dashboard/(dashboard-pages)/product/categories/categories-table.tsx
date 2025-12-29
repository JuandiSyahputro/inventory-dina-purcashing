import { getCategories } from "@/actions/category-actions";
import { DataTable } from "@/components/data-table";

const CategoriesTable = async <TData,>({ limit, columns, formAction }: TableServerProps<TData>) => {
  const { data: dataCategories } = await getCategories({ limit: limit ? Number(limit) : 10, offset: 0 });

  const fetchProductItems = async ({ limit, offset, search }: FetchDataPropsTypes): Promise<{ data: TData[] }> => {
    "use server";
    const { data } = await getCategories({ limit, offset, search });
    return { data: data as TData[] };
  };

  return <DataTable columns={columns} dataProps={dataCategories as TData[]} fetchData={fetchProductItems} elements={formAction} title="category name" />;
};

export default CategoriesTable;
