import { getProductsItems } from "@/actions/product-actions";
import { auth } from "@/auth";
import { DataTable } from "@/components/data-table";
import { redirect } from "next/navigation";
import { columnRejected } from "./column-reject";
import { columnRejectedUser } from "./column-reject-user";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/table-skeleton";

const ProductPageRejected = async ({ searchParams }: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
  const user = await auth();
  const params = (await searchParams)?.store_name;
  const limitSize = (await searchParams)?.limit;
  if (!user) redirect("/auth/login");

  const isAdmin = user?.user?.role === "SUPERADMIN";
  const isParams = isAdmin ? params : user?.user.store;

  const products = await getProductsItems({ store_name: isParams, status: [2, 5], queryParams: { limit: limitSize ? Number(limitSize) : 10, offset: 0 } });

  const fetchProductItems = async ({ limit, offset, search }: FetchDataPropsTypes) => {
    "use server";
    return await getProductsItems({ store_name: isParams, status: [2, 5], queryParams: { limit, offset, search } });
  };

  return (
    <div className="container p-10 mx-auto">
      <h1 className="mb-5 text-3xl font-bold">Product Rejected Page</h1>
      <Suspense fallback={<DataTableSkeleton columns={isAdmin ? columnRejected : columnRejectedUser} />}>
        <DataTable columns={isAdmin ? columnRejected : columnRejectedUser} dataProps={products.data} fetchData={fetchProductItems} title="product code or name" />
      </Suspense>
    </div>
  );
};

export default ProductPageRejected;
