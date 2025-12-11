import { DataTable } from "@/components/data-table";
import FormActionVendor from "@/components/vendor/form-action";
import { columnPo } from "./column-po";

const PurcahseOrdersPage = async () => {
  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-5 text-3xl font-bold">Purcahse Orders Page</h1>
      <DataTable columns={columnPo} data={[]} elements={<FormActionVendor />} title="product name" />
    </div>
  );
};

export default PurcahseOrdersPage;
