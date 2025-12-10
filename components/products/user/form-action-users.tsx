"use client";
import { addProductItemsUser } from "@/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ProductUserSchema } from "@/schema/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { memo, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const FormActionProductUser = ({ storeId }: { storeId: string }) => {
  const { refresh } = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [pending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ProductUserSchema>>({
    resolver: zodResolver(ProductUserSchema),
    defaultValues: {
      name: "",
      stockIn: "",
      storeId,
    },
  });

  const onSubmit = async (data: z.infer<typeof ProductUserSchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("stockIn", data.stockIn!);
    formData.append("storeId", data.storeId ?? "");

    startTransition(async () => {
      try {
        const result = await addProductItemsUser(formData);
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

        toast.success("Product added successfully", {
          style: {
            color: "var(--color-custom-success)",
          },
        });

        form.reset();
        refresh();
        setTimeout(() => {
          setOpenDialog(false);
        }, 500);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="default" className="h-8 cursor-pointer bg-custom-primary hover:bg-custom-primary-dark">
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Make a new product here. Click save when you&apos;re done.</DialogDescription>
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

export default memo(FormActionProductUser);
