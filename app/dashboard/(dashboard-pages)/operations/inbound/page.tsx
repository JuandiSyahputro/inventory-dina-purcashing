import { getProductsItems } from "@/actions/product-actions";
import { auth } from "@/auth";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { redirect } from "next/navigation";
import { columnInbound } from "./column-inbound";
import { columnInboundUser } from "./column-inbound-user";
import FormActionProductAdmin from "@/components/products/admin/form-action-admin";
import FormActionProductUser from "@/components/products/user/form-action-user";

const InboundPage = async ({ searchParams }: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
  const user = await auth();
  const params = (await searchParams)?.store_name;
  if (!user) redirect("/auth/login");

  const isAdmin = user?.user?.role === "SUPERADMIN";
  const isParams = isAdmin ? params : user?.user.store;
  const { data: products } = await getProductsItems({ store_name: isParams, status: [0, 1], queryParams: { limit: 10, offset: 0 } });

  const fetchProductItems = async ({ limit, offset, search }: FetchDataPropsTypes) => {
    "use server";
    return await getProductsItems({ store_name: isParams, status: [0, 1], queryParams: { limit, offset, search } });
  };

  const columns: ColumnDef<ProductTypes>[] = isAdmin ? columnInbound : columnInboundUser;
  const formAction = isAdmin ? <FormActionProductAdmin /> : <FormActionProductUser storeId={user?.user.storeId} />;

  return (
    <div className="container p-10 mx-auto">
      <h1 className="mb-5 text-3xl font-bold">Inbound Product Page</h1>
      <DataTable columns={columns} dataProps={products} fetchData={fetchProductItems} elements={formAction} title="product code or name" />
    </div>
  );
};

export default InboundPage;
