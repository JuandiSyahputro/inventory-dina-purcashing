"use client";
import { deleteProduct } from "@/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useTransition } from "react";
import { toast } from "sonner";

const ProductDeletedAdmin = ({ product, openDialog, setOpenDialog }: ProductUpdatedAdminTypes) => {
  const { refresh } = useRouter();
  const [pending, startTransition] = useTransition();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await deleteProduct(product.id);
        if (!result?.success) {
          if (Array.isArray(result?.message)) {
            // If result.message is an array, you can map over it and create a ReactNode array
            const errorMessage = result.message.map((error, index) => <div key={index}>{error.message}</div>);
            toast.error(errorMessage, {
              style: {
                color: "var(--color-destructive)",
              },
            });
          } else {
            // If result.message is a string, you can directly pass it to toast.error
            toast.error(result!.message, {
              style: {
                color: "var(--color-destructive)",
              },
            });
          }
          return;
        }

        toast.success("Product deleted successfully", {
          style: {
            color: "var(--color-custom-success)",
          },
        });

        refresh();
        setTimeout(() => {
          setOpenDialog((prev) => ({ ...prev, deletedProduct: false }));
        }, 500);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog((prev) => ({ ...prev, deletedProduct: !prev.deletedProduct }))}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="flex justify-center">
              <TriangleAlert size={80} className="text-yellow-500" />
            </DialogTitle>
            <DialogDescription>Are you sure you want to delete this product? This action cannot be undone, and all data associated with this product will be permanently deleted.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-3">
            <DialogClose asChild>
              <Button disabled={pending} variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={pending} type="submit" className="cursor-pointer bg-destructive hover:bg-red-700">
              {pending ? <Spinner /> : "Delete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ProductDeletedAdmin);
