import { getProductsItems } from "@/actions/product-actions";
import { auth } from "@/auth";
import FormActionCategory from "@/components/category/form-action";
import { DataTable } from "@/components/data-table";
import FormActionProductUser from "@/components/products/user/form-action-users";
import { redirect } from "next/navigation";
import { cache } from "react";
import { columnInbound } from "./column-inbound";
import { columnInboundUser } from "./column-inbound-user";

const getProductsCached = cache(getProductsItems);

const ProductPage = async ({ searchParams }: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
  const user = await auth();
  const params = (await searchParams)?.store_name;
  if (!user) redirect("/auth/login");

  const isAdmin = user?.user?.role === "SUPERADMIN";
  const isParams = isAdmin ? params : user?.user.store;

  const products = await getProductsCached({ store_name: isParams });
  const formAction = isAdmin ? <FormActionCategory /> : <FormActionProductUser storeId={user?.user.storeId} />;

  return (
    <div className="container p-10 mx-auto">
      <h1 className="mb-5 text-3xl font-bold">Inbound Product Page</h1>
      <DataTable columns={isAdmin ? columnInbound : columnInboundUser} data={[...products]} elements={formAction} title="product code" />
    </div>
  );
};

export default ProductPage;
