"use client";
import { addUpdateOutboundItemUser, getProductsItems } from "@/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ComboboxField } from "@/components/ui/combobox-field";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useSearchFetch } from "@/hooks/use-search-fetch";
import { camelCaseToLabel, cn, filterExcludedKeys, renderValueKey } from "@/lib/utils";
import { ProductOutSchema } from "@/schema/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Activity, memo, useCallback, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const FormOutboundUpdateUser = ({ product, openDialog, setOpenDialog }: ProductUpdatedTypes) => {
  const { refresh } = useRouter();
  const [pending, startTransition] = useTransition();
  const [pendingUsers, startUsers] = useTransition();
  const [dataList, setDataList] = useState<ProductTypes[]>([]);
  const [searchData, setSearchData] = useState("");

  const form = useForm<z.infer<typeof ProductOutSchema>>({
    resolver: zodResolver(ProductOutSchema),
    defaultValues: {
      id: product.id ?? "",
      stockOut: String(product.stockOut) ?? "1",
      remarks: product.remarks ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ProductOutSchema>) => {
    if (data.stockOut == "0" || Number(data.stockOut) < 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(async () => {
      try {
        const result = await addUpdateOutboundItemUser(formData);
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
          setOpenDialog((prev) => ({ ...prev, updatedOutProduct: false }));
        }, 500);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  const fetchDefault = useCallback(async () => {
    return [product];
  }, [product]);

  const fetchSearch = useCallback(
    async (search: string) => {
      const { data } = await getProductsItems({
        store_name: product.storeName,
        status: 1,
        queryParams: { search },
      });

      return data;
    },
    [product]
  );

  const onSuccess = useCallback((data: ProductTypes[]) => {
    setDataList(data);
  }, []);

  useSearchFetch({
    search: searchData,
    startTransition: startUsers,
    trigger: openDialog,
    fetchDefault,
    fetchSearch,
    onSuccess,
  });

  return (
    <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog((prev) => ({ ...prev, updatedOutProduct: open }))}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-h-[400px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Out Product</DialogTitle>
            <DialogDescription>Make a out product here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-3">
            <Controller
              name="id"
              defaultValue={product.id}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Product Name</FieldLabel>
                  <ComboboxField listTypes={dataList ?? []} valueProps={field.value} setValueProps={field.onChange} isLoading={pendingUsers} onValueChange={(v) => setSearchData(String(v))} isDisabled />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  <MemoizedShowMoreCollapsible valueField={field.value} data={dataList} />
                </Field>
              )}
            />
            <Controller
              name="stockOut"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="stockout">Out Stock</FieldLabel>
                  <Input type="number" aria-invalid={fieldState.invalid} {...field} id="stockout" placeholder="1,2,3, or etc..." min={1} />
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

function ShowMoreCollapsible({ valueField, data }: { valueField: string; data: ProductTypes[] }) {
  const [isOpen, setIsOpen] = useState(false);

  const detailData = data.find((item) => item.id === valueField) as ProductTypes & { [key: string]: string | number };
  const slicedData = Object.keys(detailData ?? {})
    .slice(0, 2)
    .reduce((acc: { [key: string]: string | number }, key) => {
      acc[key] = detailData[key];
      return acc;
    }, {});
  const slicedDataDetail = Object.keys(detailData ?? {})
    .slice(2)
    .reduce((acc: { [key: string]: string | number }, key) => {
      acc[key] = detailData[key];
      return acc;
    }, {});

  const excludedKeys = ["id", "name", "storeId", "stockOut", "unitId", "vendorId", "categoryId", "store", "unit", "vendor", "categories"];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full space-y-2">
      <Activity mode={!valueField ? "hidden" : "visible"}>
        <Table>
          <TableBody className="[&_tr:last-child]:border-b">
            <TableRow>
              <TableCell className="w-[150px]">Product Name</TableCell>
              <TableCell>{detailData?.name}</TableCell>
            </TableRow>
            {Object.keys(slicedData ?? {})
              .filter((key) => key !== "id")
              .map((key) => (
                <TableRow key={key}>
                  <TableCell className="w-[150px]">{camelCaseToLabel(key)}</TableCell>
                  <TableCell>{detailData ? detailData[key] : "-"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Activity>
      <CollapsibleContent className="space-y-2">
        <Activity mode={!valueField ? "hidden" : "visible"}>
          <Table>
            <TableBody>
              {filterExcludedKeys(slicedDataDetail, excludedKeys).map((key) => (
                <TableRow key={key}>
                  <TableCell className="w-[150px]">{camelCaseToLabel(key)}</TableCell>
                  <TableCell>{detailData ? renderValueKey(detailData?.[key]) : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Activity>
      </CollapsibleContent>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className={cn("mt-4! w-full data-[state=open]:hidden", !valueField && "hidden")}>
          Show more <ChevronDown />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className={cn("mt-4! w-full data-[state=open]:inline-flex hidden", !valueField && "hidden")}>
          Show less <ChevronUp />
        </Button>
      </CollapsibleTrigger>
    </Collapsible>
  );
}

const MemoizedShowMoreCollapsible = memo(ShowMoreCollapsible);

export default memo(FormOutboundUpdateUser);
