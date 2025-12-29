import { auth } from "@/auth";
import { DataTableSkeleton } from "@/components/data-table/table-skeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { columnProduct } from "./column-product";
import { columnProductUser } from "./column-product-user";
import OverviewTable from "./overview-table";
import { connection } from "next/server";
// import ProductExport from "@/components/products/admin/product-export";

const ProductPageOverview = async ({ searchParams }: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
  await connection();
  const user = await auth();
  const params = (await searchParams)?.store_name;
  const limitSize = (await searchParams)?.limit;
  if (!user) redirect("/auth/login");

  const isAdmin = user?.user?.role === "SUPERADMIN";
  const isParams = isAdmin ? params : user?.user.store;

  // const products = await getProductsItems({ store_name: isParams, queryParams: { limit: limitSize ? Number(limitSize) : 10, offset: 0 } });

  // const fetchProductItems = async ({ limit, offset, search }: FetchDataPropsTypes) => {
  //   "use server";
  //   return await getProductsItems({ store_name: isParams, queryParams: { limit, offset, search } });
  // };

  return (
    <div className="container p-10 mx-auto">
      <h1 className="mb-5 text-3xl font-bold">Product Page</h1>
      <Suspense fallback={<DataTableSkeleton columns={isAdmin ? columnProduct : columnProductUser} />}>
        {/* <DataTable
          columns={isAdmin ? columnProduct : columnProductUser}
          dataProps={products.data}
          fetchData={fetchProductItems}
          // elements={<ProductExport />}
          title="product code or name"
        /> */}
        <OverviewTable storeName={isParams ?? ""} limit={Number(limitSize)} columns={isAdmin ? columnProduct : columnProductUser} />
      </Suspense>
    </div>
  );
};

export default ProductPageOverview;
