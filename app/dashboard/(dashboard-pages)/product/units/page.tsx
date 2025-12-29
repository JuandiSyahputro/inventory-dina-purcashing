import { getUnits } from "@/actions/unit-actions";
import { DataTable } from "@/components/data-table";
import FormActionUnits from "@/components/units/form-action";
import { columnUnits } from "./column-units";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/table-skeleton";
import { connection } from "next/server";

const UnitsPage = async ({ searchParams }: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
  await connection();
  const limitSize = (await searchParams)?.limit;
  const { data: dataUnits } = await getUnits({ limit: limitSize ? Number(limitSize) : 10, offset: 0 });

  const fetchUnirs = async ({ limit, offset, search }: FetchDataPropsTypes) => {
    "use server";
    return await getUnits({ limit, offset, search });
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-5 text-3xl font-bold">Units Page</h1>
      <Suspense fallback={<DataTableSkeleton columns={columnUnits} />}>
        <DataTable columns={columnUnits} dataProps={dataUnits} fetchData={fetchUnirs} elements={<FormActionUnits />} title="unit name" />
      </Suspense>
    </div>
  );
};

export default UnitsPage;
