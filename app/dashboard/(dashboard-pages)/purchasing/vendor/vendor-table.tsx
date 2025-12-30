import { getVendors } from "@/actions/vendor-actions";
import { auth } from "@/auth";
import { DataTable } from "@/components/data-table";
import { redirect } from "next/navigation";
import { connection } from "next/server";

const VendorTable = async <TData,>({ limit, columns, formAction }: TableServerProps<TData>) => {
  await connection();

  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const { data: dataCategories } = await getVendors({ limit: limit ? Number(limit) : 10, offset: 0 });

  const fetchVendor = async ({ limit, offset, search }: FetchDataPropsTypes): Promise<{ data: TData[] }> => {
    "use server";
    const { data } = await getVendors({ limit, offset, search });
    return { data: data as TData[] };
  };

  return <DataTable columns={columns!} dataProps={dataCategories as TData[]} fetchData={fetchVendor} elements={formAction} title="vendor name" />;
};

export default VendorTable;
