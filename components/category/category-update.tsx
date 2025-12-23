"use client";
import { updateCategory } from "@/actions/category-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { CategorySchema } from "@/schema/category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { memo, useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const CategoryUpdate = ({ category, openDialog, setOpenDialog }: CategoryUpdatedTypes) => {
  const { refresh } = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: category.name ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof CategorySchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);

    startTransition(async () => {
      try {
        const result = await updateCategory(category.id, formData);
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

        toast.success("Category updated successfully", {
          style: {
            color: "var(--color-custom-success)",
          },
        });

        form.reset();
        refresh();
        setOpenDialog((prev) => ({ ...prev, updatedCategory: false }));
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  useEffect(() => {
    if (!openDialog) return;

    form.reset({
      name: category.name ?? "",
    });
  }, [category, form, openDialog]);

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog((prev) => ({ ...prev, updatedCategory: !prev.updatedCategory }))}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Update Category</DialogTitle>
            <DialogDescription>Update the category here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="pb-3">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Category Name</FieldLabel>
                  <Input aria-invalid={fieldState.invalid} {...field} id="name" placeholder="Enter category name...." />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={pending} variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={pending} type="submit" className="bg-custom-primary hover:bg-custom-primary-dark cursor-pointer">
              {pending ? <Spinner /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(CategoryUpdate);
