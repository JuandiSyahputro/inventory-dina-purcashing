import { getUnits } from "@/actions/unit-actions";
import { DataTable } from "@/components/data-table";
import FormActionUnits from "@/components/units/form-action";
import { columnUnits } from "./column-units";

const UnitsPage = async () => {
  const dataUnits = await getUnits();
  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-5 text-3xl font-bold">Units Page</h1>
      <DataTable columns={columnUnits} data={dataUnits} elements={<FormActionUnits />} title="unit name" />
    </div>
  );
};

export default UnitsPage;
