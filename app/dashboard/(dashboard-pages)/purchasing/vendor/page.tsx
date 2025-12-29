import { DataTableSkeleton } from "@/components/data-table/table-skeleton";
import FormActionVendor from "@/components/vendor/form-action";
import { Suspense } from "react";
import { columnVendor } from "./column-vendor";
import VendorTable from "./vendor-table";
import { connection } from "next/server";

const VendorPage = async ({ searchParams }: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
  await connection();
  const limitSize = (await searchParams)?.limit;
  // const { data: vendors } = await getVendors({ limit: limitSize ? Number(limitSize) : 10, offset: 0 });

  // const fetchVendors = async ({ limit, offset, search }: FetchDataPropsTypes) => {
  //   "use server";
  //   return await getVendors({ limit, offset, search });
  // };
  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-5 text-3xl font-bold">Vendor Page</h1>
      <Suspense fallback={<DataTableSkeleton columns={columnVendor} />}>
        {/* <DataTable columns={columnVendor} dataProps={vendors} fetchData={fetchVendors} elements={<FormActionVendor />} title="vendor name" /> */}
        <VendorTable limit={Number(limitSize)} columns={columnVendor} formAction={<FormActionVendor />} />
      </Suspense>
    </div>
  );
};

export default VendorPage;
