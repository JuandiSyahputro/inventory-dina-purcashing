import { DataTableSkeleton } from "@/components/data-table/table-skeleton";
import FormActionVendor from "@/components/vendor/form-action";
import { Suspense } from "react";
import { columnVendor } from "./column-vendor";
import VendorTable from "./vendor-table";

const VendorPage = async ({ searchParams }: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
  const limitSize = (await searchParams)?.limit;
  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-5 text-3xl font-bold">Vendor Page</h1>
      <Suspense fallback={<DataTableSkeleton columns={columnVendor} />}>
        <VendorTable limit={Number(limitSize)} columns={columnVendor} formAction={<FormActionVendor />} />
      </Suspense>
    </div>
  );
};

export default VendorPage;
