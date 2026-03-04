"use client";

import { getProductItemsExport, getProductsItems } from "@/actions/product-actions";
import DateRangePicker from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductExportSchema } from "@/schema/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
// import { toast } from "sonner";

const ProductExport = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ProductExportSchema>>({
    resolver: zodResolver(ProductExportSchema),
    defaultValues: {
      dateRange: undefined,
      status: "ALL",
      transactionType: "ALL",
    },
  });

  const onSubmit = async (data: z.infer<typeof ProductExportSchema>) => {
    // const formData = new FormData();
    const { status } = renderFilterExport({ status: data.status, type: data.transactionType });
    console.log(status);
    // formData.append("status", JSON.stringify(status));
    // formData.append("dateRange", JSON.stringify(data.dateRange));

    startTransition(async () => {
      try {
        const result = await getProductItemsExport({ status, dateRange: data.dateRange });
        console.log(result);
        // toast.success(`Product ${type === "approvedOut" ? "approved" : "rejected"} successfully`, {
        //   style: {
        //     color: "var(--color-custom-success)",
        //   },
        // });

        // refresh();
        // setTimeout(() => {
        //   setOpenDialog((prev) => ({ ...prev, ...(type === "approvedOut" ? { approvedOutProduct: !prev.approvedOutProduct } : { rejectedOutProduct: !prev.rejectedOutProduct }) }));
        // }, 500);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  const renderFilterExport = ({ status, type }: { status: string; type: string }) => {
    switch (status) {
      case "PENDING":
        return { status: type === "ALL" ? [0, 3] : type === "IN" ? 0 : 3 };
      case "APPROVED":
        return { status: type === "ALL" ? [1, 4] : type === "IN" ? 1 : 4 };
      case "REJECTED":
        return { status: type === "ALL" ? [2, 5] : type === "IN" ? 2 : 5 };

      default:
        return { status: [] };
    }
  };
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="default" className="h-8 cursor-pointer bg-custom-primary hover:bg-custom-primary-dark">
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Product</DialogTitle>
          <DialogDescription>Export product to excel file.</DialogDescription>
        </DialogHeader>
        <form id="form-action-admin" className="max-h-[500px] overflow-y-auto" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Status</FieldLabel>
                  <Select {...field} aria-invalid={fieldState.invalid} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="ALL">ALL</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="dateRange"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Select Date Range Filter</FieldLabel>
                  <DateRangePicker {...field} ariaInvalid={fieldState.invalid} value={field.value} setValue={field.onChange} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="transactionType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Transaction Type</FieldLabel>
                  <Select {...field} aria-invalid={fieldState.invalid} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ALL">ALL</SelectItem>
                        <SelectItem value="IN">IN</SelectItem>
                        <SelectItem value="OUT">OUT</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            {/* <Button disabled={pending} variant="outline" type="button">
              Cancel
            </Button> */}
          </DialogClose>
          <Button
            // disabled={pending}
            type="submit"
            className="cursor-pointer bg-custom-primary hover:bg-custom-primary-dark"
            form="form-action-admin">
            {/* {pending ? <Spinner /> : "Save"} */}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductExport;
