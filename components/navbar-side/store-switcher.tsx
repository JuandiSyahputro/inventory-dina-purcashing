"use client";

import { addStore, updateStore } from "@/actions/store-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { AddStoreSchema } from "@/schema/store-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown, Plus, SquarePenIcon, Store } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { memo, useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const isProductView = ["/dashboard/product/overview", "/dashboard/operations/inbound", "/dashboard/operations/rejected"];

const StoreSwitcher = ({ stores, user }: StoreTypes) => {
  const { isMobile } = useSidebar();
  const { refresh, replace } = useRouter();

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selectedStore, setSelectedStore] = useState<string[] | undefined>(user.role === "SUPERADMIN" ? stores.map((store) => store.name) : undefined);
  const [editStore, setEditStore] = useState({ id: "" });
  const [pending, startTransition] = useTransition();
  const [openDrop, setOpenDrop] = useState(false);
  const [openDialog, setOpenDialog] = useState({
    isOpen: false,
    isEdit: false,
  });
  const storeNameParam = searchParams.get("store_name") ?? "";
  const joinedSelected = selectedStore?.join(",") ?? "";

  const form = useForm<z.infer<typeof AddStoreSchema>>({
    resolver: zodResolver(AddStoreSchema),
    defaultValues: {
      name: "",
    },
  });

  const toggleStore = (storeName: string, checked: boolean) => {
    setSelectedStore((prev) => {
      let updated: string[] = [];

      if (storeName === "all") {
        updated = checked ? stores.map((store) => store.name) : [];
      } else {
        updated = checked ? [...prev!, storeName] : prev!.filter((name) => name !== storeName);
      }

      return updated;
    });
  };

  const handleEditStore = ({ e, id, name }: { e: React.MouseEvent<HTMLButtonElement>; id: string; name: string }) => {
    e.preventDefault();
    setOpenDrop(false);
    setEditStore({ id });
    setOpenDialog({
      isOpen: true,
      isEdit: true,
    });
    form.setValue("name", name);
  };

  const onSubmitAdd = async (data: z.infer<typeof AddStoreSchema>) => {
    startTransition(async () => {
      try {
        const result = await addStore(data.name);
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

        toast.success("Store added successfully", {
          style: {
            color: "var(--color-custom-success)",
          },
        });
        setOpenDrop(false);
        form.reset();
        refresh();
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  const onSubmitEdit = async (data: z.infer<typeof AddStoreSchema>) => {
    startTransition(async () => {
      try {
        const result = await updateStore(editStore.id, data.name);

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

        form.reset();
        refresh();
        setTimeout(() => {
          setOpenDialog({
            isOpen: false,
            isEdit: false,
          });
        }, 500);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  const renderSwitcher = () => {
    if (user.role === "USER") {
      return (
        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="bg-custom-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Store className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Store</span>
            <span className="truncate text-xs">{user?.store ?? "Leny Skincare"}</span>
          </div>
        </SidebarMenuButton>
      );
    }

    return (
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="bg-custom-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Store className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Store</span>
            <span className="truncate text-xs">Leny Skincare</span>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
    );
  };

  useEffect(() => {
    if (!selectedStore) return;
    if (joinedSelected === storeNameParam) return;

    if (isProductView.some((path) => pathname.includes(path))) {
      const params = new URLSearchParams(searchParams.toString());

      if (selectedStore.length > 0) {
        params.set("store_name", joinedSelected);
      } else {
        params.delete("store_name");
      }

      replace(`${pathname}?${params.toString()}`);
    }
  }, [selectedStore, storeNameParam, joinedSelected, pathname, searchParams, replace]);

  const onSubmit = openDialog.isEdit ? form.handleSubmit(onSubmitEdit) : form.handleSubmit(onSubmitAdd);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={openDrop} onOpenChange={setOpenDrop}>
          {renderSwitcher()}
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-66 rounded-lg" align="start" side={isMobile ? "bottom" : "right"} sideOffset={4}>
            <DropdownMenuLabel className="text-muted-foreground text-xs">Store</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={selectedStore ? selectedStore.length === stores.length : false}
              classCheckbox={{ className: "bg-foreground text-white left-1 p-3 rounded-sm" }}
              onSelect={(e) => e.preventDefault()}
              onCheckedChange={(checked) => toggleStore("all", checked)}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-custom-primary text-sidebar-primary-foreground">
                <Store className="size-3.5 shrink-0" />
              </div>
              <p className="truncate max-w-[120px]">All</p>
            </DropdownMenuCheckboxItem>
            {stores.map((store, index) => (
              <DropdownMenuCheckboxItem key={index} checked={selectedStore?.includes(store.name) || false} onCheckedChange={(checked) => toggleStore(store.name, checked)} onSelect={(e) => e.preventDefault()}>
                <div className="flex size-6 items-center justify-center rounded-md border bg-custom-primary text-sidebar-primary-foreground">
                  <Store className="size-3.5 shrink-0" />
                </div>
                <p className="truncate max-w-[120px]">{store.name}</p>
                <span
                  className="absolute right-5 flex size-6.5 items-center justify-center rounded-md border bg-custom-primary text-sidebar-primary-foreground hover:cursor-pointer"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleEditStore({ e, id: store.id, name: store.name })}>
                  <SquarePenIcon />
                </span>
              </DropdownMenuCheckboxItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 p-2 hover:cursor-pointer" onSelect={() => setOpenDialog({ isOpen: true, isEdit: false })}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium">Add store</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={openDialog.isOpen} onOpenChange={() => setOpenDialog({ isOpen: false, isEdit: false })}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{openDialog.isEdit ? "Edit" : "Create New"} Store</DialogTitle>
              <DialogDescription>
                {openDialog.isEdit ? "Edit the name of your store" : "Provide a name for your new store"}. Click {openDialog.isEdit ? "save" : "create"} when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit}>
              <FieldGroup className="pb-3">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="storename">Store Name</FieldLabel>
                      <Input aria-invalid={fieldState.invalid} {...field} id="storename" placeholder="Leny HO or other...." />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button disabled={pending} variant="outline" className="hover:cursor-pointer">
                    Cancel
                  </Button>
                </DialogClose>
                <Button disabled={pending} type="submit" className="bg-custom-primary hover:bg-custom-primary-dark hover:cursor-pointer">
                  {pending ? <Spinner /> : openDialog.isEdit ? "Save" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const MemoizedStoreSwitcher = memo(StoreSwitcher);
export default MemoizedStoreSwitcher;
