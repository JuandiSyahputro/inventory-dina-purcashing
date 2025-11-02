import { getStores } from "@/actions/store-action";
import { getUsers } from "@/actions/users-action";
import { DataTable } from "@/components/data-table";
import FormActionUsers from "@/components/users/form-action";
import { columnUser } from "./column-user";

const UsersPage = async () => {
  const dataStores = (await getStores()) || [];
  const users = await getUsers();
  const key = dataStores.filter((store) => store.id === dataStores[0].id)[0].id;
  const formatUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email || "",
    role: user.role,
    store_id: user.storeId || "",
    store_name: user.store?.name || null,
    data_stores: { stores: dataStores },
  }));

  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-5 text-3xl font-bold">Users Management Page</h1>
      <DataTable columns={columnUser} data={formatUsers} elements={<FormActionUsers key={key} stores={dataStores} />} title="username" />
    </div>
  );
};

export default UsersPage;
