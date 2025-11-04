"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, RotateCcwKey, Trash } from "lucide-react";
import { useState } from "react";
import UserUpdateAction from "./user-update-action";
import UserDeletedAction from "./user-delete-action";
import UserChangePassAction from "./user-change-pass-action";

const UsersAction = ({ user }: { user: UsersTypes }) => {
  const [openDialog, setOpenDialog] = useState({
    updatedUser: false,
    deletedUser: false,
    changePassword: false,
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
        <DropdownMenuContent align="end" className="space-y-2">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer! bg-accent-foreground text-white! hover:bg-accent-foreground/80!" onClick={() => setOpenDialog((prev) => ({ ...prev, changePassword: true }))}>
            <RotateCcwKey className="text-white" /> Change Password
          </DropdownMenuItem>
          <DropdownMenuItem className="bg-custom-primary text-white! cursor-pointer! hover:bg-custom-primary-dark!" onClick={() => setOpenDialog((prev) => ({ ...prev, updatedUser: true }))}>
            <Pencil className="text-white" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem className="bg-destructive text-white! cursor-pointer! hover:bg-red-700!" onClick={() => setOpenDialog((prev) => ({ ...prev, deletedUser: true }))}>
            <Trash className="text-white" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserUpdateAction user={user} openDialog={openDialog.updatedUser} setOpenDialog={setOpenDialog} />
      <UserDeletedAction user={user} openDialog={openDialog.deletedUser} setOpenDialog={setOpenDialog} />
      <UserChangePassAction user={user} openDialog={openDialog.changePassword} setOpenDialog={setOpenDialog} />
    </div>
  );
};

export default UsersAction;
