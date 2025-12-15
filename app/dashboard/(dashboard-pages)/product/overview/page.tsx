import { getProductsItems } from "@/actions/product-actions";
import { auth } from "@/auth";
import FormActionCategory from "@/components/category/form-action";
import { DataTable } from "@/components/data-table";
import FormActionProductUser from "@/components/products/user/form-action-users";
import { redirect } from "next/navigation";
import { columnProduct } from "./column-product";
import { columnProductUser } from "./column-product-user";

const ProductPage = async ({ searchParams }: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
  const user = await auth();
  const params = (await searchParams)?.store_name;
  if (!user) redirect("/auth/login");

  const isAdmin = user?.user?.role === "SUPERADMIN";
  const isParams = isAdmin ? params : user?.user.store;

  const products = await getProductsItems({ store_name: isParams, limit: 10, offset: 0, status: 1 });
  const formAction = isAdmin ? <FormActionCategory /> : <FormActionProductUser storeId={user?.user.storeId} />;

  const fetchProductItems = async ({ limit, offset }: FetchDataPropsTypes) => {
    "use server";
    return await getProductsItems({ store_name: isParams, limit, offset });
  };

  return (
    <div className="container p-10 mx-auto">
      <h1 className="mb-5 text-3xl font-bold">Product Page</h1>
      <DataTable columns={isAdmin ? columnProduct : columnProductUser} dataProps={products.data} fetchData={fetchProductItems} elements={formAction} title="product code" />
    </div>
  );
};

export default ProductPage;
