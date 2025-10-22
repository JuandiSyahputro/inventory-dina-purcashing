import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columnUser } from "./column-user";

const UsersPage = () => {
  const componentLink = () => {
    return (
      <Link href="/dashboard/user-management/add-new" className="flex items-center px-3">
        <Button variant="default" className="h-8">
          Add New
        </Button>
      </Link>
    );
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="mb-5 text-3xl font-bold">Users Management Page</h1>
      <DataTable columns={columnUser} data={[]} elements={componentLink()} title="nama" />
    </div>
  );
};

export default UsersPage;
