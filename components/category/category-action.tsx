"use client";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import CategoryUpdate from "./category-update";
import CategoryDeleted from "./category-delete";

const CategoryAction = ({ category }: { category: CategoryTypes }) => {
  const [openDialog, setOpenDialog] = useState({
    updatedCategory: false,
    deletedCategory: false,
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
          <DropdownMenuItem className="bg-custom-primary text-white! cursor-pointer! hover:bg-custom-primary-dark!" onClick={() => setOpenDialog((prev) => ({ ...prev, updatedCategory: true }))}>
            <Pencil className="text-white" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem className="bg-destructive text-white! cursor-pointer! hover:bg-red-700!" onClick={() => setOpenDialog((prev) => ({ ...prev, deletedCategory: true }))}>
            <Trash className="text-white" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CategoryUpdate category={category} openDialog={openDialog.updatedCategory} setOpenDialog={setOpenDialog} />
      <CategoryDeleted category={category} openDialog={openDialog.deletedCategory} setOpenDialog={setOpenDialog} />
    </div>
  );
};

export default CategoryAction;
