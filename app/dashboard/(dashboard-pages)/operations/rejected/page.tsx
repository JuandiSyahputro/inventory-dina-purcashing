import { auth } from "@/auth";
import { DataTableSkeleton } from "@/components/data-table/table-skeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { columnRejected } from "./column-reject";
import { columnRejectedUser } from "./column-reject-user";
import RejectedTable from "./rejected-table";
import { connection } from "next/server";

const ProductPageRejected = async ({ searchParams }: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
  await connection();
  const user = await auth();
  const params = (await searchParams)?.store_name;
  const limitSize = (await searchParams)?.limit;
  if (!user) redirect("/auth/login");

  const isAdmin = user?.user?.role === "SUPERADMIN";
  const isParams = isAdmin ? params : user?.user.store;

  // const products = await getProductsItems({ store_name: isParams, status: [2, 5], queryParams: { limit: limitSize ? Number(limitSize) : 10, offset: 0 } });

  // const fetchProductItems = async ({ limit, offset, search }: FetchDataPropsTypes) => {
  //   "use server";
  //   return await getProductsItems({ store_name: isParams, status: [2, 5], queryParams: { limit, offset, search } });
  // };

  return (
    <div className="container p-10 mx-auto">
      <h1 className="mb-5 text-3xl font-bold">Product Rejected Page</h1>
      <Suspense fallback={<DataTableSkeleton columns={isAdmin ? columnRejected : columnRejectedUser} />}>
        {/* <DataTable columns={isAdmin ? columnRejected : columnRejectedUser} dataProps={products.data} fetchData={fetchProductItems} title="product code or name" /> */}
        <RejectedTable storeName={isParams ?? ""} limit={Number(limitSize)} columns={isAdmin ? columnRejected : columnRejectedUser} />
      </Suspense>
    </div>
  );
};

export default ProductPageRejected;
