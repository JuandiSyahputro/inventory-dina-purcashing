"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CircleX, MoreHorizontal, PackageCheck, Pencil, Trash } from "lucide-react";
import { Activity, useState } from "react";
import ProductDeletedAdmin from "./product-delete-admin";
import ProductRejectedAdmin from "./product-reject-admin";
import ProductUpdatedAdmin from "./product-updated-admin";
import ProductApproveRejectOutAdmin from "./product-approve-reject-admin";

const ProductActionAdmin = ({ product }: { product: ProductTypes }) => {
  const [openDialog, setOpenDialog] = useState({
    approvedProduct: false,
    rejectedProduct: false,
    updatedProduct: false,
    approvedOutProduct: false,
    rejectedOutProduct: false,
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
            <DropdownMenuItem className="bg-custom-success text-white cursor-pointer! hover:bg-custom-success/90! hover:text-white!" onClick={() => setOpenDialog((prev) => ({ ...prev, approvedProduct: true }))}>
              <PackageCheck className="text-white" /> Approve
            </DropdownMenuItem>
          </Activity>
          <Activity mode={product.status === 3 ? "visible" : "hidden"}>
            <DropdownMenuItem className="bg-custom-success text-white cursor-pointer! hover:bg-custom-success/90! hover:text-white!" onClick={() => setOpenDialog((prev) => ({ ...prev, approvedOutProduct: true }))}>
              <PackageCheck className="text-white" /> Approve
            </DropdownMenuItem>
          </Activity>
          <Activity mode={product.status === 3 ? "visible" : "hidden"}>
            <DropdownMenuItem className="bg-foreground text-white cursor-pointer! hover:bg-foreground/80! hover:text-white!" onClick={() => setOpenDialog((prev) => ({ ...prev, rejectedOutProduct: true }))}>
              <CircleX className="text-white" /> Rejected
            </DropdownMenuItem>
          </Activity>
          <Activity mode={!product.status ? "visible" : "hidden"}>
            <DropdownMenuItem className="bg-foreground text-white cursor-pointer! hover:bg-foreground/80! hover:text-white!" onClick={() => setOpenDialog((prev) => ({ ...prev, rejectedProduct: true }))}>
              <CircleX className="text-white" /> Rejected
            </DropdownMenuItem>
          </Activity>
          <Activity mode={product.status === 1 ? "visible" : "hidden"}>
            <DropdownMenuItem className="bg-custom-primary text-white! cursor-pointer! hover:bg-custom-primary-dark!" onClick={() => setOpenDialog((prev) => ({ ...prev, updatedProduct: true }))}>
              <Pencil className="text-white" /> Update
            </DropdownMenuItem>
          </Activity>
          <DropdownMenuItem className="bg-destructive text-white! cursor-pointer! hover:bg-red-700!" onClick={() => setOpenDialog((prev) => ({ ...prev, deletedProduct: true }))}>
            <Trash className="text-white" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Activity mode={openDialog.approvedProduct ? "visible" : "hidden"}>
        <ProductUpdatedAdmin product={product} openDialog={openDialog.approvedProduct} setOpenDialog={setOpenDialog} />
      </Activity>
      <Activity mode={openDialog.rejectedProduct ? "visible" : "hidden"}>
        <ProductRejectedAdmin product={product} openDialog={openDialog.rejectedProduct} setOpenDialog={setOpenDialog} />
      </Activity>
      <Activity mode={openDialog.approvedOutProduct ? "visible" : "hidden"}>
        <ProductApproveRejectOutAdmin product={product} openDialog={openDialog.approvedOutProduct} setOpenDialog={setOpenDialog} />
      </Activity>
      <Activity mode={openDialog.rejectedOutProduct ? "visible" : "hidden"}>
        <ProductApproveRejectOutAdmin product={product} type="rejectedOut" openDialog={openDialog.rejectedOutProduct} setOpenDialog={setOpenDialog} />
      </Activity>
      <Activity mode={openDialog.updatedProduct ? "visible" : "hidden"}>
        <ProductUpdatedAdmin product={product} type="updated" openDialog={openDialog.updatedProduct} setOpenDialog={setOpenDialog} />
      </Activity>
      <Activity mode={openDialog.deletedProduct ? "visible" : "hidden"}>
        <ProductDeletedAdmin product={product} openDialog={openDialog.deletedProduct} setOpenDialog={setOpenDialog} />
      </Activity>
    </div>
  );
};

export default ProductActionAdmin;
