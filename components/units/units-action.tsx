"use client";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
// import CategoryUpdate from "./category-update";
import UnitDeleted from "./unit-delete";
import UnitUpdate from "./unit-update";

const UnitAction = ({ unit }: { unit: UnitTypes }) => {
  const [openDialog, setOpenDialog] = useState({
    updatedUnit: false,
    deletedUnit: false,
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
          <DropdownMenuItem className="bg-custom-primary text-white! cursor-pointer! hover:bg-custom-primary-dark!" onClick={() => setOpenDialog((prev) => ({ ...prev, updatedUnit: true }))}>
            <Pencil className="text-white" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem className="bg-destructive text-white! cursor-pointer! hover:bg-red-700!" onClick={() => setOpenDialog((prev) => ({ ...prev, deletedUnit: true }))}>
            <Trash className="text-white" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UnitUpdate unit={unit} openDialog={openDialog.updatedUnit} setOpenDialog={setOpenDialog} />
      <UnitDeleted unit={unit} openDialog={openDialog.deletedUnit} setOpenDialog={setOpenDialog} />
    </div>
  );
};

export default UnitAction;
