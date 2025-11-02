"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil } from "lucide-react";
import { useState } from "react";
import UserUpdateAction from "./user-update-action";

const UsersAction = ({ user }: { user: UsersTypes }) => {
  const [openDialog, setOpenDialog] = useState({
    updatedUser: false,
  });

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="bg-custom-primary text-white! cursor-pointer hover:bg-custom-primary-dark! " onClick={() => setOpenDialog({ updatedUser: true })}>
            <Pencil className="text-white" /> Update
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserUpdateAction user={user} openDialog={openDialog.updatedUser} setOpenDialog={setOpenDialog} />
    </div>
  );
};

export default UsersAction;
