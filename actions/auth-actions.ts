"use server";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export const loginCredentials = async (FormData: FormData) => {
  const { email, password } = Object.fromEntries(FormData.entries());
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // important
    });

    if (result?.error) {
      return { success: false, message: "Invalid email or password" };
    }

    // manually redirect on success (in client component)
    return { success: true };
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      // console.log(error.message);
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid email or password",
            success: false,
          };
        case "CallbackRouteError":
          return {
            message: "Invalid email or password",
            success: false,
          };

        default:
          return {
            message: "Something went wrong",
            success: false,
          };
      }
    }
    throw error;
  }
};

export const logoutCredentials = async () => {
  try {
    await signOut({ redirectTo: "/auth/login" });
  } catch (error) {
    throw error;
  }
};
