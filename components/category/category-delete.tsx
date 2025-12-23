"use client";
import { deleteCategory } from "@/actions/category-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { DeletedCategorySchema } from "@/schema/category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const CategoryDeleted = ({ category, openDialog, setOpenDialog }: CategoryUpdatedTypes) => {
  const { refresh } = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof DeletedCategorySchema>>({
    resolver: zodResolver(DeletedCategorySchema),
    defaultValues: {
      id: category.id,
    },
  });

  const onSubmit = async (data: z.infer<typeof DeletedCategorySchema>) => {
    startTransition(async () => {
      try {
        const result = await deleteCategory(data.id);
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

        toast.success("Category deleted successfully", {
          style: {
            color: "var(--color-custom-success)",
          },
        });

        form.reset();
        refresh();
        setOpenDialog((prev) => ({ ...prev, deletedCategory: false }));
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  useEffect(() => {
    if (!openDialog) return;
    form.reset({
      id: category.id,
    });
  }, [openDialog, category, form]);

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog((prev) => ({ ...prev, deletedCategory: !prev.deletedCategory }))}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex justify-center">
              <TriangleAlert size={80} className="text-yellow-500" />
            </DialogTitle>
            <DialogDescription>Are you sure you want to delete this category? This action cannot be undone, and all data associated with this category will be permanently deleted.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-3">
            <DialogClose asChild>
              <Button disabled={pending} variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={pending} type="submit" className="bg-destructive hover:bg-red-700 cursor-pointer">
              {pending ? <Spinner /> : "Delete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(CategoryDeleted);
