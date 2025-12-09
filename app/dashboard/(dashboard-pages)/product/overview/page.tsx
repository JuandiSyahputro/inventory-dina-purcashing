import { getProductsItems } from "@/actions/product-actions";
import { auth } from "@/auth";
import FormActionCategory from "@/components/category/form-action";
import { DataTable } from "@/components/data-table";
import FormActionProductUser from "@/components/products/user/form-action-users";
import { formatMappingProducts } from "@/lib/utils";
import { redirect } from "next/navigation";
import { columnProduct } from "./column-product";
import { columnProductUser } from "./column-product-user";

const ProductPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) => {
  const user = await auth();
  if (!user) redirect("/auth/login");

  const params = (await searchParams)?.store_name;
  const products = await getProductsItems({ store_name: params });

  const isAdmin = user?.user?.role === "SUPERADMIN";
  const dataProducts = formatMappingProducts(products as ProductTypes[]);
  const formAction = isAdmin ? <FormActionCategory /> : <FormActionProductUser storeId={user?.user.storeId} />;

  return (
    <div className="container p-10 mx-auto">
      <h1 className="mb-5 text-3xl font-bold">Product Page</h1>
      <DataTable columns={isAdmin ? columnProduct : columnProductUser} data={dataProducts as ProductTypes[]} elements={formAction} title="product code" />
    </div>
  );
};

export default ProductPage;
