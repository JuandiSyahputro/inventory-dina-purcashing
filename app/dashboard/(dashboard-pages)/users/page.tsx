import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columnUser } from "./column-user";
import { getStores } from "@/actions/store-action";
import FormActionUsers from "@/components/users/form-action";

const UsersPage = async () => {
  const dataStores = (await getStores()) || [];

  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-5 text-3xl font-bold">Users Management Page</h1>
      <DataTable columns={columnUser} data={[]} elements={<FormActionUsers stores={dataStores} />} title="nama" />
    </div>
  );
};

export default UsersPage;
