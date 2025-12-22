"use client";
import { approveRejectedOutboundProductItemAdmin } from "@/actions/product-actions";
import { Button } from "@/components/ui/button";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import { ProductRejectedSchema } from "@/schema/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { memo, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const ProductApproveRejectOutAdmin = ({ product, type = "approvedOut", openDialog, setOpenDialog }: ProductUpdatedAdminTypes) => {
  const { refresh } = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ProductRejectedSchema>>({
    resolver: zodResolver(ProductRejectedSchema),
    defaultValues: {
      remarks: product.remarks ?? "",
      name: product.name ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ProductRejectedSchema>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(async () => {
      try {
        const result = await approveRejectedOutboundProductItemAdmin(product.id, type, formData);
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

        toast.success(`Product ${type === "approvedOut" ? "approved" : "rejected"} successfully`, {
          style: {
            color: "var(--color-custom-success)",
          },
        });

        refresh();
        setTimeout(() => {
          setOpenDialog((prev) => ({ ...prev, ...(type === "approvedOut" ? { approvedOutProduct: !prev.approvedOutProduct } : { rejectedOutProduct: !prev.rejectedOutProduct }) }));
        }, 500);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog((prev) => ({ ...prev, ...(type === "approvedOut" ? { approvedOutProduct: !prev.approvedOutProduct } : { rejectedOutProduct: !prev.rejectedOutProduct }) }))}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{type === "approvedOut" ? "Approve" : "Reject"} Product</DialogTitle>
          <DialogDescription>{type === "approvedOut" ? "Approve" : "Reject"} the product here. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form id="form-approve-admin" className="max-h-[500px] overflow-y-auto" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="py-3">
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
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={pending} variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={pending} type="submit" form="form-approve-admin" className="cursor-pointer bg-custom-primary hover:bg-custom-primary-dark">
            {pending ? <Spinner /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ProductApproveRejectOutAdmin);
