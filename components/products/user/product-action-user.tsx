"use client";
import { Activity, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import ProductDeletedUser from "./product-delete-user";
import ProductUpdateUser from "./product-update-user";
import FormOutboundUpdateUser from "./form-outbound-update-user";

const ProductActionUser = ({ product }: { product: ProductTypes }) => {
  const [openDialog, setOpenDialog] = useState({
    updatedProduct: false,
    updatedOutProduct: false,
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
          <Activity mode={!product.status ? "visible" : "hidden"}>
            <DropdownMenuItem className="bg-custom-primary text-white! cursor-pointer! hover:bg-custom-primary-dark!" onClick={() => setOpenDialog((prev) => ({ ...prev, updatedProduct: true }))}>
              <Pencil className="text-white" /> Update
            </DropdownMenuItem>
          </Activity>
          <Activity mode={product.status === 3 ? "visible" : "hidden"}>
            <DropdownMenuItem className="bg-custom-primary text-white! cursor-pointer! hover:bg-custom-primary-dark!" onClick={() => setOpenDialog((prev) => ({ ...prev, updatedOutProduct: true }))}>
              <Pencil className="text-white" /> Update
            </DropdownMenuItem>
          </Activity>
          <Activity mode={!product.status || product.status === 3 ? "visible" : "hidden"}>
            <DropdownMenuItem className="bg-destructive text-white! cursor-pointer! hover:bg-red-700!" onClick={() => setOpenDialog((prev) => ({ ...prev, deletedProduct: true }))}>
              <Trash className="text-white" /> Delete
            </DropdownMenuItem>
          </Activity>
        </DropdownMenuContent>
      </DropdownMenu>
      <Activity mode={openDialog.updatedProduct ? "visible" : "hidden"}>
        <ProductUpdateUser product={product} openDialog={openDialog.updatedProduct} setOpenDialog={setOpenDialog} />
      </Activity>
      <Activity mode={openDialog.updatedOutProduct ? "visible" : "hidden"}>
        <FormOutboundUpdateUser product={product} openDialog={openDialog.updatedOutProduct} setOpenDialog={setOpenDialog} />
      </Activity>
      <Activity mode={openDialog.deletedProduct ? "visible" : "hidden"}>
        <ProductDeletedUser product={product} openDialog={openDialog.deletedProduct} setOpenDialog={setOpenDialog} />
      </Activity>
    </div>
  );
};

export default ProductActionUser;
