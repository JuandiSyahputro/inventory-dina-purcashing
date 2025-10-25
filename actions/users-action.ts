"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/schema/auth-schema";
import { Prisma, Role } from "@prisma/client";
import { hashSync } from "bcrypt-ts";
import { redirect } from "next/navigation";

export const addUsers = async (FormData: FormData) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const rawData = Object.fromEntries(FormData);
  const validateFields = RegisterSchema.safeParse(rawData);

  if (!validateFields.success) {
    return {
      message: validateFields.error.issues,
      success: false,
    };
  }

  const { name, storeId, role, confirmPassword } = validateFields.data;
  const hashPassword = hashSync(confirmPassword, 10);
  try {
    const response = await prisma.users.create({
      data: {
        name,
        storeId,
        password: hashPassword,
        role: role as Role,
      },
    });

    if (response) {
      return {
        message: "User created successfully",
        success: true,
      };
    }

    return {
      message: "Something went wrong",
      success: false,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists",
          success: false,
        };
      }
    }
    throw error;
  }
};
