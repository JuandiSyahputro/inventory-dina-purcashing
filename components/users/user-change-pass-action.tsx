"use client";
import { changePassword, updateUsers } from "@/actions/users-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ChangePassSchema } from "@/schema/users-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const UserChangePassAction = ({ user, openDialog, setOpenDialog }: UserUpdatedTypes) => {
  const { refresh } = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ChangePassSchema>>({
    resolver: zodResolver(ChangePassSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ChangePassSchema>) => {
    const formData = new FormData();
    formData.append("oldPassword", data.oldPassword);
    formData.append("newPassword", data.newPassword);
    formData.append("confirmNewPassword", data.confirmNewPassword);

    startTransition(async () => {
      try {
        const result = await changePassword(user.id, formData);
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
        setOpenDialog((prev) => ({ ...prev, changePassword: false }));
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog((prev) => ({ ...prev, changePassword: !prev.changePassword }))}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Strengthen your security — set a new password below.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="pb-3 pt-3">
            <Controller
              name="oldPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="currPassword" className="max-lg:text-white">
                    Current Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="currPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="**********"
                      autoComplete="new-password"
                      className="focus-visible:ring-custom-primary-dark focus-visible:placeholder:text-custom-primary focus-visible:text-custom-primary-dark max-lg:focus-visible:text-white  max-lg:text-white"
                    />
                    <Button tabIndex={-1} className="absolute right-1 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent hover:cursor-pointer" onClick={() => setShowPassword(!showPassword)} type="button">
                      {!showPassword ? <EyeOff className="text-foreground" size={15} /> : <EyeIcon className="text-foreground" size={15} />}
                    </Button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="newPassword" className="max-lg:text-white">
                    New Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="**********"
                      autoComplete="new-password"
                      className="focus-visible:ring-custom-primary-dark focus-visible:placeholder:text-custom-primary focus-visible:text-custom-primary-dark max-lg:focus-visible:text-white  max-lg:text-white"
                    />
                    <Button tabIndex={-1} className="absolute right-1 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent hover:cursor-pointer" onClick={() => setShowPassword(!showPassword)} type="button">
                      {!showPassword ? <EyeOff className="text-foreground" size={15} /> : <EyeIcon className="text-foreground" size={15} />}
                    </Button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="confirmNewPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="cNewPassword" className="max-lg:text-white">
                    Confirm New Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="cNewPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="**********"
                      autoComplete="new-password"
                      className="focus-visible:ring-custom-primary-dark focus-visible:placeholder:text-custom-primary focus-visible:text-custom-primary-dark max-lg:focus-visible:text-white  max-lg:text-white"
                    />
                    <Button tabIndex={-1} className="absolute right-1 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent hover:cursor-pointer" onClick={() => setShowPassword(!showPassword)} type="button">
                      {!showPassword ? <EyeOff className="text-foreground" size={15} /> : <EyeIcon className="text-foreground" size={15} />}
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

export default memo(UserChangePassAction);
