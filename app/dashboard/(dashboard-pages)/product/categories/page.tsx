import FormActionCategory from "@/components/category/form-action";
import { DataTable } from "@/components/data-table";
import { columnCategory } from "./column-category";
import { getCategories } from "@/actions/category-actions";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/table-skeleton";

const CategoriesPage = async ({ searchParams }: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
  const limitSize = (await searchParams)?.limit;
  const { data: dataCategories } = await getCategories({ limit: limitSize ? Number(limitSize) : 10, offset: 0 });

  const fetchCategories = async ({ limit, offset, search }: FetchDataPropsTypes): Promise<{ data: CategoryTypes[] }> => {
    "use server";
    return await getCategories({ limit, offset, search });
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-5 text-3xl font-bold">Categories Page</h1>
      <Suspense fallback={<DataTableSkeleton columns={columnCategory} />}>
        <DataTable columns={columnCategory} dataProps={dataCategories} fetchData={fetchCategories} elements={<FormActionCategory />} title="category name" />
      </Suspense>
    </div>
  );
};

export default CategoriesPage;
