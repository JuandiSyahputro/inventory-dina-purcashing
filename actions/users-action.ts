"use server";

import { auth } from "@/auth";
import { generateCacheKey, getCache, invalidateCache, setCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/schema/auth-schema";
import { ChangePassSchema, DeletedSchema, EditUserSchema } from "@/schema/users-schema";
import { Prisma, Role } from "@prisma/client";
import { compareSync, hashSync } from "bcrypt-ts";
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
        storeId: storeId || null,
        password: hashPassword,
        role: role as Role,
      },
    });

    if (response) {
      await invalidateCache("users");
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
          message: "User already exists",
          success: false,
        };
      }
    }
    throw error;
  }
};

export const getUsers = async (props: FetchDataPropsTypes) => {
  const cacheKey = await generateCacheKey({ typeCache: "users", queryParams: props });
  try {
    const cached = await getCache(cacheKey);

    if (cached) {
      const dataCached = typeof cached === "string" ? JSON.parse(cached) : cached;
      return dataCached;
    }

    const { limit, offset, search } = props;

    const where: Prisma.UsersWhereInput = {
      ...(search && {
        OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }],
      }),
    };

    const users = await prisma.users.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        storeId: true,
        createdAt: true,
        updatedAt: true,
        store: { select: { name: true } },
      },
      ...(limit && { take: Number(limit) }),
      ...(offset && { skip: Number(offset) }),
      orderBy: { createdAt: "desc" },
    });

    const result = {
      data: users,
    };

    await setCache(cacheKey, JSON.stringify(result));

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateUsers = async (id: string, formData: FormData) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const rawData = Object.fromEntries(formData);
  const validateFields = EditUserSchema.safeParse(rawData);

  if (!validateFields.success) {
    return {
      message: validateFields.error.issues,
      success: false,
    };
  }

  const { name, storeId, role, email } = validateFields.data;

  try {
    const response = await prisma.users.update({
      where: {
        id,
      },
      data: {
        name,
        storeId: storeId || null,
        email: email !== "" ? email : null,
        role: role as Role,
      },
    });

    if (response) {
      await invalidateCache("users");
      return {
        message: "User updated successfully",
        success: true,
      };
    }
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

export const deleteUsers = async (id: string) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const validatedFields = DeletedSchema.safeParse({ id });
  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues,
      success: false,
    };
  }

  try {
    const response = await prisma.users.delete({
      where: {
        id,
      },
    });

    if (response) {
      await invalidateCache("users");
      return {
        message: "User deleted successfully",
        success: true,
      };
    }
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (id: string, formData: FormData) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const rawData = Object.fromEntries(formData);
  const validateFields = ChangePassSchema.safeParse(rawData);

  if (!validateFields.success) {
    return {
      message: validateFields.error.issues,
      success: false,
    };
  }

  const { oldPassword, confirmNewPassword } = validateFields.data;

  const hashPassword = hashSync(confirmNewPassword, 10);
  try {
    const user = await prisma.users.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      return {
        message: "User not found",
        success: false,
      };
    }
    const isValid = compareSync(oldPassword, user!.password);

    if (!isValid) {
      return {
        message: "Current password is incorrect",
        success: false,
      };
    }
    const response = await prisma.users.update({
      where: {
        id,
      },
      data: {
        password: hashPassword,
      },
    });

    if (response) {
      return {
        message: "Password changed successfully",
        success: true,
      };
    }
  } catch (error) {
    throw error;
  }
};
