"use client";

import { loginCredentials } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { LoginSchema } from "@/schema/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { replace } = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    startTransition(async () => {
      try {
        const result = await loginCredentials(formData);
        if (!result?.success) {
          if (Array.isArray(result?.message)) {
            const errorMessage = result.message.map((error, index) => <div key={index}>{error.message}</div>);
            toast.error(errorMessage, {
              style: {
                color: "var(--color-destructive)",
              },
            });
          } else {
            toast.error(result!.message, {
              style: {
                color: "var(--color-destructive)",
              },
            });
          }
          return;
        }

        replace("/dashboard/product/overview");
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold max-lg:text-white">Welcome Back!</h1>
          <p className="text-muted-foreground text-sm text-balance">Login to your account to manage your inventory.</p>
        </div>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email" className="max-lg:text-white">
                Email or Username
              </FieldLabel>
              <Input
                {...field}
                id="email"
                type="string"
                placeholder="m@example.com"
                aria-invalid={fieldState.invalid}
                className="focus-visible:ring-custom-primary-dark focus-visible:placeholder:text-custom-primary focus-visible:text-custom-primary-dark focus-visible:border-custom-primary max-lg:focus-visible:text-white  max-lg:text-white"
                autoComplete="email"
                autoFocus
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password" className="max-lg:text-white">
                  Password
                </FieldLabel>
                {/* <Link href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </Link> */}
              </div>
              <div className="relative">
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="**********"
                  autoComplete="new-password"
                  className="focus-visible:ring-custom-primary-dark focus-visible:placeholder:text-custom-primary focus-visible:text-custom-primary-dark max-lg:focus-visible:text-white  max-lg:text-white"
                />
                <Button tabIndex={-1} className="absolute right-1 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent hover:cursor-pointer [&>svg]:max-lg:text-white" onClick={() => setShowPassword(!showPassword)} type="button">
                  {!showPassword ? <EyeOff className="max-md:text-white text-foreground" size={15} /> : <EyeIcon className="max-md:text-white text-foreground" size={15} />}
                </Button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button disabled={isPending} className="bg-custom-primary hover:bg-custom-primary-dark/90 font-bold hover:cursor-pointer" type="submit">
            {isPending ? <Spinner /> : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
