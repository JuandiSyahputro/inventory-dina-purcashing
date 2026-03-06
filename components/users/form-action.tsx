"use client";
import { addUsers } from "@/actions/users-action";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { RegisterSchema } from "@/schema/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, EyeIcon, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const FormActionUsers = ({ stores }: StoreTypes) => {
  const { refresh } = useRouter();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      storeId: "",
      role: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof RegisterSchema>> = async (data: z.infer<typeof RegisterSchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("storeId", data.storeId ?? "");
    formData.append("role", data.role);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    startTransition(async () => {
      try {
        const result = await addUsers(formData);
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

        toast.success("Users added successfully", {
          style: {
            color: "var(--color-custom-success)",
          },
        });

        form.reset();
        refresh();
        setOpenDialog(false);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="default" className="h-8 bg-custom-primary hover:bg-custom-primary-dark cursor-pointer">
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Make a new user here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="pb-3">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Username</FieldLabel>
                  <Input aria-invalid={fieldState.invalid} {...field} id="name" placeholder="Jhon Doe...." className="aria-invalid:placeholder:text-destructive" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="storeId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="storename">Store Name</FieldLabel>
                  <Button
                    aria-invalid={fieldState.invalid}
                    variant="outline"
                    className="w-full justify-between text-muted-foreground aria-invalid:text-destructive"
                    role="combobox"
                    aria-expanded={open}
                    onClick={() => setOpen(true)}
                    type="button">
                    {field.value ? stores.find((item) => item.id === field.value)?.name : "Choose a store"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                  <CommandDialog open={open} onOpenChange={setOpen} className="max-w-xs!">
                    <CommandInput placeholder="Search store name..." />
                    <CommandList defaultValue={field.value} className="overflow-y-auto max-h-60">
                      <CommandEmpty>No data found.</CommandEmpty>
                      <CommandGroup>
                        {stores.map((item) => (
                          <>
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
                          </>
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
                    <SelectTrigger
                      id="form-rhf-select-language"
                      aria-invalid={fieldState.invalid}
                      className="min-w-[120px] aria-invalid:[&_span:not([class*='text-'])]:text-destructive aria-invalid:[&_svg:not([class*='text-'])]:text-destructive">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="SUPERADMIN">SUPERADMIN</SelectItem>
                      <SelectSeparator />
                      <SelectItem value="USER">USER</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="**********"
                      autoComplete="new-password"
                      className="focus-visible:ring-custom-primary-dark focus-visible:placeholder:text-custom-primary focus-visible:text-custom-primary-dark max-lg:focus-visible:text-white  max-lg:text-white aria-invalid:placeholder:text-destructive"
                    />
                    <Button
                      aria-invalid={fieldState.invalid}
                      tabIndex={-1}
                      className="absolute right-1 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent hover:cursor-pointer aria-invalid:[&_svg:not([class*='text-'])]:text-destructive text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button">
                      {!showPassword ? <EyeOff className="opacity-50" size={15} /> : <EyeIcon className="opacity-50" size={15} />}
                    </Button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="**********"
                      autoComplete="new-password"
                      className="focus-visible:ring-custom-primary-dark focus-visible:placeholder:text-custom-primary focus-visible:text-custom-primary-dark max-lg:focus-visible:text-white  max-lg:text-white aria-invalid:placeholder:text-destructive"
                    />
                    <Button
                      aria-invalid={fieldState.invalid}
                      tabIndex={-1}
                      className="absolute right-1 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent hover:cursor-pointer aria-invalid:[&_svg:not([class*='text-'])]:text-destructive text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button">
                      {!showPassword ? <EyeOff className="opacity-50" size={15} /> : <EyeIcon className="opacity-50" size={15} />}
                    </Button>
                  </div>
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

export default FormActionUsers;
