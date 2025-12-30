import { DataTableSkeleton } from "@/components/data-table/table-skeleton";
import { Suspense } from "react";
import { columnUser } from "./column-user";
import UsersTable from "./users-table";

const UsersPage = async () => {
  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-5 text-3xl font-bold">Users Management Page</h1>
      <Suspense fallback={<DataTableSkeleton columns={columnUser} />}>
        <UsersTable limit={10} columns={columnUser} />
      </Suspense>
    </div>
  );
};

export default UsersPage;
