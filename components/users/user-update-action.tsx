"use client";
import { updateUsers } from "@/actions/users-action";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { EditUserSchema } from "@/schema/users-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const UserUpdateAction = ({ user, openDialog, setOpenDialog }: UserUpdatedTypes) => {
  const { refresh } = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof EditUserSchema>>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      name: user.name ?? "",
      storeId: user.store_id,
      role: user.role ?? "",
      email: user.email ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof EditUserSchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email ?? "");
    formData.append("storeId", data.storeId);
    formData.append("role", data.role);

    startTransition(async () => {
      try {
        const result = await updateUsers(user.id, formData);
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

        toast.success("User updated successfully", {
          style: {
            color: "var(--color-custom-success)",
          },
        });

        form.reset();
        refresh();
        setOpenDialog((prev) => ({ ...prev, updatedUser: false }));
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog((prev) => ({ ...prev, updatedUser: !prev.updatedUser }))}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
            <DialogDescription>Update the user here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="pb-3">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input aria-invalid={fieldState.invalid} {...field} id="email" placeholder="Jhon Doe...." />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Username</FieldLabel>
                  <Input aria-invalid={fieldState.invalid} {...field} id="name" placeholder="Jhon Doe...." />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="storeId"
              control={form.control}
              defaultValue={user.store_id}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="storename">Store Name</FieldLabel>
                  <Button variant="outline" className="w-full justify-between" role="combobox" aria-expanded={open} onClick={() => setOpen(true)} aria-invalid={fieldState.invalid} type="button">
                    {field.value ? user?.data_stores?.stores.find((item) => item.id === field.value)?.name : "Choose a store"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                  <CommandDialog open={open} onOpenChange={setOpen} className="max-w-xs!">
                    <CommandInput placeholder="Search store name..." />
                    <CommandList defaultValue={field.value} className="overflow-y-auto max-h-60">
                      <CommandEmpty>No data found.</CommandEmpty>
                      <CommandGroup>
                        {user.data_stores?.stores.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={(currentValue) => {
                              setOpen(!open);
                              field.onChange(field.value == currentValue ? "" : currentValue);
                              form.setValue("storeId", item.id);
                            }}>
                            <Check className={cn("mr-2 h-4 w-4", field.value === item.id ? "opacity-100" : "opacity-0")} />
                            {item.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </CommandDialog>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="storename">Role</FieldLabel>
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="form-rhf-select-language" aria-invalid={fieldState.invalid} className="min-w-[120px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectSeparator />
                      <SelectItem value="SUPERADMIN">SUPERADMIN</SelectItem>
                      <SelectItem value="USER">USER</SelectItem>
                    </SelectContent>
                  </Select>
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

export default memo(UserUpdateAction);
