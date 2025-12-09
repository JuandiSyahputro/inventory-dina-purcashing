"use client";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import CategoryUpdate from "./product-update";
import ProductDeleted from "./product-delete";

const ProductAction = ({ product }: { product: ProductTypes }) => {
  const [openDialog, setOpenDialog] = useState({
    updatedProduct: false,
    deletedProduct: false,
  });

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="space-y-2">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="bg-custom-primary text-white! cursor-pointer! hover:bg-custom-primary-dark!" onClick={() => setOpenDialog((prev) => ({ ...prev, updatedProduct: true }))}>
            <Pencil className="text-white" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem className="bg-destructive text-white! cursor-pointer! hover:bg-red-700!" onClick={() => setOpenDialog((prev) => ({ ...prev, deletedProduct: true }))}>
            <Trash className="text-white" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CategoryUpdate product={product} openDialog={openDialog.updatedProduct} setOpenDialog={setOpenDialog} />
      <ProductDeleted product={product} openDialog={openDialog.deletedProduct} setOpenDialog={setOpenDialog} />
    </div>
  );
};

export default ProductAction;
