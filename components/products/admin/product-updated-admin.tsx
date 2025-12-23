"use client";
import { getCategories } from "@/actions/category-actions";
import { updateProductItemAdmin } from "@/actions/product-actions";
import { getUnits } from "@/actions/unit-actions";
import { getVendors } from "@/actions/vendor-actions";
import { Button } from "@/components/ui/button";
import { ComboboxField } from "@/components/ui/combobox-field";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useSearchFetch } from "@/hooks/use-search-fetch";

import { ProductAdminSchema } from "@/schema/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { memo, useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const ProductUpdatedAdmin = ({ product, type = "approved", openDialog, setOpenDialog }: ProductUpdatedAdminTypes) => {
  const { refresh } = useRouter();
  const [pending, startTransition] = useTransition();
  const [pendingCategories, startCategories] = useTransition();
  const [pendingVendors, startVendors] = useTransition();
  const [pendingUnits, startUnits] = useTransition();
  const [dataSearch, setDataSearch] = useState({
    categories: "",
    units: "",
    vendors: "",
  });
  const [dataList, setDataList] = useState<ListDataTypes>({
    categories: [],
    units: [],
    vendors: [],
  });

  const form = useForm<z.infer<typeof ProductAdminSchema>>({
    resolver: zodResolver(ProductAdminSchema),
    defaultValues: {
      prCode: product.prCode ?? "",
      productCode: product.productCode ?? "",
      productSubCode: product.productSubCode ?? "",
      price: String(product.price) ?? "0",
      remarks: product.remarks ?? "",
      name: product.name ?? "",
      stockIn: String(product.stockIn) ?? "0",
      unitId: product.unitId ?? "",
      vendorId: product.vendorId ?? "",
      categoryId: product.categoryId ?? "",
      storeId: product.storeId ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ProductAdminSchema>) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(async () => {
      try {
        const result = await updateProductItemAdmin(product.id, type, formData);
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

        toast.success(`Product ${type} successfully`, {
          style: {
            color: "var(--color-custom-success)",
          },
        });

        refresh();
        setTimeout(() => {
          setOpenDialog((prev) => ({ ...prev, ...(type === "approved" ? { approvedProduct: false } : { updatedProduct: false }) }));
        }, 500);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  useEffect(() => {
    if (!openDialog) return;

    form.reset({
      prCode: product.prCode ?? "",
      productCode: product.productCode ?? "",
      productSubCode: product.productSubCode ?? "",
      price: String(product.price ?? 0),
      remarks: product.remarks ?? "",
      name: product.name ?? "",
      stockIn: String(product.stockIn ?? 0),
      unitId: product.unitId ?? "",
      vendorId: product.vendorId ?? "",
      categoryId: product.categoryId ?? "",
      storeId: product.storeId ?? "",
    });
  }, [product, form, openDialog]);

  useSearchFetch({
    search: dataSearch.categories,
    startTransition: startCategories,
    fetchDefault: async () => {
      if (!openDialog) return [];
      const { data } = await getCategories({});
      return data;
    },
    fetchSearch: async (search) => {
      const { data } = await getCategories({ search });
      return data;
    },
    onSuccess: (data) => setDataList((p) => ({ ...p, categories: data })),
  });

  useSearchFetch({
    search: dataSearch.vendors,
    startTransition: startVendors,
    fetchDefault: async () => {
      if (!openDialog) return [];
      const { data } = await getVendors({});
      return data;
    },
    fetchSearch: async (search) => {
      const { data } = await getVendors({ search });
      return data;
    },
    onSuccess: (data) => setDataList((p) => ({ ...p, vendors: data })),
  });

  useSearchFetch({
    search: dataSearch.units,
    startTransition: startUnits,
    fetchDefault: async () => {
      if (!openDialog) return [];

      const { data } = await getUnits({});
      return data;
    },
    fetchSearch: async (search) => {
      const { data } = await getUnits({ search });
      return data;
    },
    onSuccess: (data) => setDataList((p) => ({ ...p, units: data })),
  });

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog((prev) => ({ ...prev, ...(type === "approved" ? { approvedProduct: false } : { updatedProduct: false }) }))}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{type === "approved" ? "Approve" : "Update"} Product</DialogTitle>
          <DialogDescription>{type === "approved" ? "Approve" : "Update"} the product here. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <form id="form-approve-admin" className="max-h-[500px] overflow-y-auto" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="py-3">
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
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category Name</FieldLabel>
                  <ComboboxField
                    listTypes={dataList?.categories ?? []}
                    valueProps={field.value}
                    setValueProps={field.onChange}
                    isLoading={pendingCategories}
                    onValueChange={(v) =>
                      setDataSearch((p) => ({
                        ...p,
                        categories: String(v),
                      }))
                    }
                  />
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
                  <ComboboxField
                    listTypes={dataList?.units ?? []}
                    valueProps={field.value}
                    setValueProps={field.onChange}
                    isLoading={pendingUnits}
                    onValueChange={(v) =>
                      setDataSearch((p) => ({
                        ...p,
                        units: String(v),
                      }))
                    }
                  />
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
                  <ComboboxField
                    listTypes={dataList?.vendors ?? []}
                    valueProps={field.value}
                    setValueProps={field.onChange}
                    isLoading={pendingVendors}
                    onValueChange={(v) =>
                      setDataSearch((p) => ({
                        ...p,
                        vendors: String(v),
                      }))
                    }
                  />
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
          <Button disabled={pending} type="submit" form="form-approve-admin" className="cursor-pointer bg-custom-primary hover:bg-custom-primary-dark">
            {pending ? <Spinner /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ProductUpdatedAdmin);
