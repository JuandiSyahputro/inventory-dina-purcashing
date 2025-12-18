"use client";
import { getCategories } from "@/actions/category-actions";
import { addProductItemsUser } from "@/actions/product-actions";
import { getStores } from "@/actions/store-action";
import { getUnits } from "@/actions/unit-actions";
import { getVendors } from "@/actions/vendor-actions";
import { Button } from "@/components/ui/button";
import { ComboboxField } from "@/components/ui/combobox-field";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ProductAdminSchema, ProductUserSchema } from "@/schema/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const FormActionProductAdmin = () => {
  const prevOpen = useRef(false);
  const { refresh } = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [pending, startTransition] = useTransition();
  const [dataList, setDataList] = useState<ListDataTypes>({
    categories: [],
    units: [],
    vendors: [],
    stores: [],
  });

  const form = useForm<z.infer<typeof ProductAdminSchema>>({
    resolver: zodResolver(ProductAdminSchema),
    defaultValues: {
      name: "",
      stockIn: "",
      prCode: "",
      productCode: "",
      productSubCode: "",
      price: "",
      remarks: "",
      storeId: "",
      categoryId: "",
      unitId: "",
      vendorId: "",
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

  const getStoresFunc = async () => {
    try {
      const dataStores = await getStores();
      setDataList((prev) => ({ ...prev, stores: dataStores }));
    } catch (error) {
      console.error(error);
    }
  };

  const getCategoriesFunc = async () => {
    try {
      const dataCategories = await getCategories({});
      setDataList((prev) => ({ ...prev, categories: dataCategories.data }));
    } catch (error) {
      console.error(error);
    }
  };

  const getVendorsFunc = async () => {
    try {
      const dataVendors = await getVendors({});
      setDataList((prev) => ({ ...prev, vendors: dataVendors.data }));
    } catch (error) {
      console.error(error);
    }
  };

  const getUnitsFunc = async () => {
    try {
      const dataUnits = await getUnits({});
      setDataList((prev) => ({ ...prev, units: dataUnits.data }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!prevOpen.current && openDialog) {
      const loadData = async () => {
        await Promise.all([getCategoriesFunc(), getVendorsFunc(), getUnitsFunc(), getStoresFunc()]);
      };

      loadData();
    }

    prevOpen.current = openDialog;
  }, [openDialog]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="default" className="h-8 cursor-pointer bg-custom-primary hover:bg-custom-primary-dark">
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Make a new product here. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form id="form-action-admin" className="max-h-[500px] overflow-y-auto" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="prCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="prCode">PR Code</FieldLabel>
                  <Input aria-invalid={fieldState.invalid} {...field} id="prCode" placeholder="Enter your PR code here..." />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="productCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pCode">Product Code</FieldLabel>
                  <Input aria-invalid={fieldState.invalid} {...field} id="pCode" placeholder="Enter your product code here..." />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="productSubCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="subCode">Product Sub Code</FieldLabel>
                  <Input aria-invalid={fieldState.invalid} {...field} id="subCode" placeholder="Enter your product code here..." />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
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
              name="storeId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Store Name</FieldLabel>
                  <ComboboxField listTypes={dataList?.stores ?? []} value={field.value} setValue={field.onChange} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category Name</FieldLabel>
                  <ComboboxField listTypes={dataList?.categories ?? []} value={field.value} setValue={field.onChange} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="unitId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Unit Name</FieldLabel>
                  <ComboboxField listTypes={dataList?.units ?? []} value={field.value} setValue={field.onChange} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="vendorId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Vendor Name</FieldLabel>
                  <ComboboxField listTypes={dataList?.vendors ?? []} value={field.value} setValue={field.onChange} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="price">Price</FieldLabel>
                  <Input type="number" aria-invalid={fieldState.invalid} {...field} id="price" placeholder="Enter your product price here..." />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="stockIn"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="inStock">In Stock</FieldLabel>
                  <Input type="number" aria-invalid={fieldState.invalid} {...field} id="inStock" placeholder="1,2,3, or etc..." />
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
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={pending} variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={pending} type="submit" className="cursor-pointer bg-custom-primary hover:bg-custom-primary-dark" form="form-action-admin">
            {pending ? <Spinner /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormActionProductAdmin;
