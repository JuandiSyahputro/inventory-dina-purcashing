import { getCategories } from "@/actions/category-actions";
import { auth } from "@/auth";
import { DataTable } from "@/components/data-table";
import { redirect } from "next/navigation";
import { connection } from "next/server";

const CategoriesTable = async <TData,>({ limit, columns, formAction }: TableServerProps<TData>) => {
  await connection();

  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const { data: dataCategories } = await getCategories({ limit: limit ? Number(limit) : 10, offset: 0 });

  const fetchCategories = async ({ limit, offset, search }: FetchDataPropsTypes): Promise<{ data: TData[] }> => {
    "use server";
    const { data } = await getCategories({ limit, offset, search });
    return { data: data as TData[] };
  };

  return <DataTable columns={columns!} dataProps={dataCategories as TData[]} fetchData={fetchCategories} elements={formAction} title="category name" />;
};

export default CategoriesTable;
