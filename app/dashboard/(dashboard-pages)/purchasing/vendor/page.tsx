import { getVendors } from "@/actions/vendor-actions";
import { DataTable } from "@/components/data-table";
import FormActionVendor from "@/components/vendor/form-action";
import { columnVendor } from "./column-vendor";

const VendorPage = async () => {
  const vendors = await getVendors();

  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-5 text-3xl font-bold">Vendor Page</h1>
      <DataTable columns={columnVendor} data={vendors} elements={<FormActionVendor />} title="vendor name" />
    </div>
  );
};

export default VendorPage;
