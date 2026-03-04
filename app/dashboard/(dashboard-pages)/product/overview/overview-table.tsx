import { getProductsItems } from "@/actions/product-actions";
import { auth } from "@/auth";
import { DataTable } from "@/components/data-table";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { columnProduct } from "./column-product";
import { columnProductUser } from "./column-product-user";

const OverviewTable = async <TData,>({ storeName, limit }: TableServerProps<TData>) => {
  await connection();

  const user = await auth();
  if (!user) redirect("/auth/login");

  const isAdmin = user?.user?.role === "SUPERADMIN";
  const isParams = isAdmin ? storeName : user?.user.store;

  const { data: products } = await getProductsItems({ store_name: isParams, queryParams: { limit: limit ? Number(limit) : 10, offset: 0 } });

  const fetchProductItems = async ({ limit, offset, search }: FetchDataPropsTypes): Promise<{ data: ProductTypes[] }> => {
    "use server";
    const { data } = await getProductsItems({ store_name: isParams, queryParams: { limit, offset, search } });
    return { data: data as ProductTypes[] };
  };

  return <DataTable columns={isAdmin ? columnProduct : columnProductUser} dataProps={products as ProductTypes[]} fetchData={fetchProductItems} elements={null} title="product code or name" />;
};

export default OverviewTable;
