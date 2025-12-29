import { getProductsItems } from "@/actions/product-actions";
import { auth } from "@/auth";
import { DataTable } from "@/components/data-table";
import FormOutboundUser from "@/components/products/user/form-outbound-user";
import { ColumnDef } from "@tanstack/react-table";
import { redirect } from "next/navigation";
import { columnOutbound } from "./column-outbound";
import { columnOutboundUser } from "./column-outbound-user";

const OutboundPage = async ({ searchParams }: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
  const user = await auth();
  const params = (await searchParams)?.store_name;
  const limitSize = (await searchParams)?.limit;
  if (!user) redirect("/auth/login");

  const isAdmin = user?.user?.role === "SUPERADMIN";
  const isParams = isAdmin ? params : user?.user?.store;
  const { data: products } = await getProductsItems({ store_name: isParams, status: [3, 4], queryParams: { limit: limitSize ? Number(limitSize) : 10, offset: 0 } });

  const fetchProductItems = async ({ limit, offset, search, status = [3, 4] }: FetchDataPropsTypes) => {
    "use server";
    return await getProductsItems({ store_name: isParams, status, queryParams: { limit, offset, search } });
  };

  const columns: ColumnDef<ProductTypes>[] = isAdmin ? columnOutbound : columnOutboundUser;
  const formAction = <FormOutboundUser storeName={isParams ?? ""} />;

  return (
    <div className="container p-10 mx-auto">
      <div className="mb-5 text-3xl font-bold">Outbound Product Page</div>
      <DataTable columns={columns} dataProps={products} fetchData={fetchProductItems} elements={formAction} title="product code or name" />
    </div>
  );
};

export default OutboundPage;
