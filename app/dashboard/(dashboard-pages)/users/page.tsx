import { getStores } from "@/actions/store-action";
import { getUsers } from "@/actions/users-action";
import { DataTable } from "@/components/data-table";
import FormActionUsers from "@/components/users/form-action";
import { columnUser } from "./column-user";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/table-skeleton";

const UsersPage = async () => {
  const { data: dataStores } = (await getStores({})) || [];
  const { data: users } = await getUsers({ limit: 10, offset: 0 });
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

  const fetchUsers = async ({ limit, offset, search }: FetchDataPropsTypes) => {
    "use server";
    const { data: dataUsers } = await getUsers({ limit, offset, search });
    const fetchUsers = dataUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email || "",
      role: user.role,
      store_id: user.storeId || "",
      store_name: user.store?.name || null,
      data_stores: { stores: dataStores },
    }));

    return { data: fetchUsers };
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-5 text-3xl font-bold">Users Management Page</h1>
      <Suspense fallback={<DataTableSkeleton columns={columnUser} />}>
        <DataTable columns={columnUser} dataProps={formatUsers} fetchData={fetchUsers} elements={<FormActionUsers key={key} stores={dataStores} />} title="username or email" />
      </Suspense>
    </div>
  );
};

export default UsersPage;
