import { getProductsItems } from "@/actions/product-actions";
import { auth } from "@/auth";
import FormActionCategory from "@/components/category/form-action";
import { DataTable } from "@/components/data-table";
import FormActionProductUser from "@/components/products/user/form-action-users";
import { ColumnDef } from "@tanstack/react-table";
import { redirect } from "next/navigation";
import { columnInbound } from "./column-inbound";
import { columnInboundUser } from "./column-inbound-user";

const ProductPage = async ({ searchParams }: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
  const user = await auth();
  const params = (await searchParams)?.store_name;
  if (!user) redirect("/auth/login");

  const isAdmin = user?.user?.role === "SUPERADMIN";
  const isParams = isAdmin ? params : user?.user.store;
  const { data: products } = await getProductsItems({ store_name: isParams, limit: 10, offset: 0 });

  const fetchProductItems = async ({ limit, offset }: FetchDataPropsTypes) => {
    "use server";
    return await getProductsItems({ store_name: isParams, limit, offset });
  };

  const formAction = isAdmin ? <FormActionCategory /> : <FormActionProductUser storeId={user?.user.storeId} />;
  const columns: ColumnDef<ProductTypes>[] = isAdmin ? columnInbound : columnInboundUser;

  return (
    <div className="container p-10 mx-auto">
      <h1 className="mb-5 text-3xl font-bold">Inbound Product Page</h1>
      <DataTable columns={columns} dataProps={products} fetchData={fetchProductItems} elements={formAction} title="product code" />
    </div>
  );
};

export default ProductPage;
