"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PackageCheck, Pencil, Trash } from "lucide-react";
import { Activity, useState } from "react";
import ProductApproved from "./product-approved";
import ProductDeletedAdmin from "./product-delete-admin";

const ProductActionAdmin = ({ product }: { product: ProductTypes }) => {
  const [openDialog, setOpenDialog] = useState({
    approvedProduct: false,
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
          {!product.status && (
            <DropdownMenuItem className="bg-foreground text-white cursor-pointer! hover:bg-foreground/90! hover:text-white!" onClick={() => setOpenDialog((prev) => ({ ...prev, approvedProduct: true }))}>
              <PackageCheck className="text-white" /> Approve
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="bg-custom-primary text-white! cursor-pointer! hover:bg-custom-primary-dark!" onClick={() => setOpenDialog((prev) => ({ ...prev, updatedProduct: true }))}>
            <Pencil className="text-white" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem className="bg-destructive text-white! cursor-pointer! hover:bg-red-700!" onClick={() => setOpenDialog((prev) => ({ ...prev, deletedProduct: true }))}>
            <Trash className="text-white" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <CategoryUpdate product={product} openDialog={openDialog.updatedProduct} setOpenDialog={setOpenDialog} /> */}
      <Activity mode={openDialog.approvedProduct ? "visible" : "hidden"}>
        <ProductApproved product={product} openDialog={openDialog.approvedProduct} setOpenDialog={setOpenDialog} />
      </Activity>
      <Activity mode={openDialog.deletedProduct ? "visible" : "hidden"}>
        <ProductDeletedAdmin product={product} openDialog={openDialog.deletedProduct} setOpenDialog={setOpenDialog} />
      </Activity>
    </div>
  );
};

export default ProductActionAdmin;
