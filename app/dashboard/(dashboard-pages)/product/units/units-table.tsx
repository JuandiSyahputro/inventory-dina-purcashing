import { getUnits } from "@/actions/unit-actions";
import { auth } from "@/auth";
import { DataTable } from "@/components/data-table";
import { redirect } from "next/navigation";
import { connection } from "next/server";

const UnitsTable = async <TData,>({ limit, columns, formAction }: TableServerProps<TData>) => {
  await connection();

  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const { data: dataUnits } = await getUnits({ limit: limit ? Number(limit) : 10, offset: 0 });

  const fetchUnits = async ({ limit, offset, search }: FetchDataPropsTypes): Promise<{ data: TData[] }> => {
    "use server";
    const { data } = await getUnits({ limit, offset, search });
    return { data: data as TData[] };
  };

  return <DataTable columns={columns!} dataProps={dataUnits as TData[]} fetchData={fetchUnits} elements={formAction} title="vendor name" />;
};

export default UnitsTable;
