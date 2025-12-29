import { getProductsItems } from "@/actions/product-actions";
import { auth } from "@/auth";
import { DataTable } from "@/components/data-table";
import { redirect } from "next/navigation";
import { columnProduct } from "./column-product";
import { columnProductUser } from "./column-product-user";
// import ProductExport from "@/components/products/admin/product-export";

const ProductPageOverview = async ({ searchParams }: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
  const user = await auth();
  const params = (await searchParams)?.store_name;
  if (!user) redirect("/auth/login");

  const isAdmin = user?.user?.role === "SUPERADMIN";
  const isParams = isAdmin ? params : user?.user.store;

  const products = await getProductsItems({ store_name: isParams, queryParams: { limit: 10, offset: 0 } });

  const fetchProductItems = async ({ limit, offset, search }: FetchDataPropsTypes) => {
    "use server";
    return await getProductsItems({ store_name: isParams, queryParams: { limit, offset, search } });
  };

  return (
    <div className="container p-10 mx-auto">
      <h1 className="mb-5 text-3xl font-bold">Product Page</h1>
      <DataTable
        columns={isAdmin ? columnProduct : columnProductUser}
        dataProps={products.data}
        fetchData={fetchProductItems}
        // elements={<ProductExport />}
        title="product code or name"
      />
    </div>
  );
};

export default ProductPageOverview;
