import { getStores } from "@/actions/store-action";
import { getUsers } from "@/actions/users-action";
import { auth } from "@/auth";
import { DataTable } from "@/components/data-table";
import FormActionUsers from "@/components/users/form-action";
import { redirect } from "next/navigation";
import { connection } from "next/server";

const UsersTable = async <TData,>({ limit, columns }: TableServerProps<TData>) => {
  await connection();
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const { data: dataStores } = (await getStores({})) || [];
  const { data: users } = await getUsers({ limit: limit ? Number(limit) : 10, offset: 0 });

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

    return { data: fetchUsers as TData[] };
  };

  return <DataTable columns={columns!} dataProps={formatUsers as TData[]} fetchData={fetchUsers} elements={<FormActionUsers key={key} stores={dataStores} />} title="username or email" />;
};

export default UsersTable;
