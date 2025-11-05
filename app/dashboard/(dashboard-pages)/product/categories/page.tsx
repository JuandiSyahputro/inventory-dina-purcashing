import FormActionCategory from "@/components/category/form-action";
import { DataTable } from "@/components/data-table";
import { columnCategory } from "./column-category";
import { getCategories } from "@/actions/category-actions";

const CategoriesPage = async () => {
  const dataCategories = await getCategories();
  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-5 text-3xl font-bold">Categories Page</h1>
      <DataTable columns={columnCategory} data={dataCategories} elements={<FormActionCategory />} title="category name" />
    </div>
  );
};

export default CategoriesPage;
