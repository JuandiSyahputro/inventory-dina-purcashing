import FormActionCategory from "@/components/category/form-action";
import { DataTable } from "@/components/data-table";
import { columnCategory } from "./column-category";
import { getCategories } from "@/actions/category-actions";

const CategoriesPage = async () => {
  const { data: dataCategories } = await getCategories({ limit: 10, offset: 0 });

  const fetchCategories = async ({ limit, offset, search }: FetchDataPropsTypes) => {
    "use server";
    return await getCategories({ limit, offset, search });
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-5 text-3xl font-bold">Categories Page</h1>
      <DataTable columns={columnCategory} dataProps={dataCategories} fetchData={fetchCategories} elements={<FormActionCategory />} title="category name" />
    </div>
  );
};

export default CategoriesPage;
