"use client";
import { updateProductItemUser } from "@/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ProductUserSchema } from "@/schema/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { memo, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const ProductUpdate = ({ product, openDialog, setOpenDialog }: ProductUpdatedTypes) => {
  const { refresh } = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ProductUserSchema>>({
    resolver: zodResolver(ProductUserSchema),
    defaultValues: {
      name: product.name ?? "",
      stockIn: String(product.stockIn) ?? "0",
      remarks: product.remarks ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ProductUserSchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("stockIn", data.stockIn!);
    formData.append("remarks", data.remarks ?? "");

    startTransition(async () => {
      try {
        const result = await updateProductItemUser(product.id, formData);
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

        toast.success("Product updated successfully", {
          style: {
            color: "var(--color-custom-success)",
          },
        });

        refresh();
        setTimeout(() => {
          setOpenDialog((prev) => ({ ...prev, updatedProduct: false }));
        }, 500);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog((prev) => ({ ...prev, updatedProduct: !prev.updatedProduct }))}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Update Product</DialogTitle>
            <DialogDescription>Update the product here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-3">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Product Name</FieldLabel>
                  <Input aria-invalid={fieldState.invalid} {...field} id="name" placeholder="Enter your product name here..." />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="stockIn"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">In Stock</FieldLabel>
                  <Input type="number" aria-invalid={fieldState.invalid} {...field} id="name" placeholder="1,2,3, or etc..." />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="remarks"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
                  <Textarea aria-invalid={fieldState.invalid} {...field} placeholder="Type your remarks here." id="remarks" className="min-h-20" />
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
            <Button disabled={pending} type="submit" className="cursor-pointer bg-custom-primary hover:bg-custom-primary-dark">
              {pending ? <Spinner /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ProductUpdate);
