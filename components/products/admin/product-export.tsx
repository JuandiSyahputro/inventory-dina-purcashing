"use client";

import DateRangePicker from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useState } from "react";
import { Controller } from "react-hook-form";
// import { toast } from "sonner";

const ProductExport = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const onSubmit = async () => {
    // const formData = new FormData();
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
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Make a new product here. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form id="form-action-admin" className="max-h-[500px] overflow-y-auto" onSubmit={onSubmit}>
          <FieldGroup>
            <Controller
              name="prCode"
              // control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Select Date Range Filter</FieldLabel>
                  <DateRangePicker {...field} ariaInvalid={fieldState.invalid} value={field.value} setValue={field.onChange} />
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
