import { DataTableSkeleton } from "@/components/data-table/table-skeleton";
import FormActionUnits from "@/components/units/form-action";
import { Suspense } from "react";
import { columnUnits } from "./column-units";
import UnitsTable from "./units-table";

const UnitsPage = async ({ searchParams }: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
  const limitSize = (await searchParams)?.limit;

  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-5 text-3xl font-bold">Units Page</h1>
      <Suspense fallback={<DataTableSkeleton columns={columnUnits} />}>
        {/* <DataTable columns={columnUnits} dataProps={dataUnits} fetchData={fetchUnirs} elements={<FormActionUnits />} title="unit name" /> */}
        <UnitsTable limit={Number(limitSize)} columns={columnUnits} formAction={<FormActionUnits />} />
      </Suspense>
    </div>
  );
};

export default UnitsPage;
