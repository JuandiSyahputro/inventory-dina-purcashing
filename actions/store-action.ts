"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AddStoreSchema } from "@/schema/store-schema";
import { Prisma } from "@prisma/client";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export const addStore = async (nameStore: string) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const validatedFields = AddStoreSchema.safeParse({ name: nameStore });
  if (!validatedFields.success)
    return {
      message: validatedFields.error!.issues,
      success: false,
    };

  const { name } = validatedFields.data;

  try {
    const findStore = await prisma.store.findFirst({
      where: {
        name,
      },
    });

    if (findStore) {
      return {
        message: `${name} already exists`,
        success: false,
      };
    }

    const response = await prisma.store.create({
      data: {
        name,
      },
    });

    if (response) {
      return {
        success: true,
      };
    }
  } catch (error) {
    console.log(error);
    if (isRedirectError(error)) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return {
            message: `${name} already exists`,
            success: false,
          };
        case "P2025":
          return {
            message: "Data not found",
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

export const updateStore = async (idStore: string, nameStore: string) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const validatedFields = AddStoreSchema.safeParse({ id: idStore, name: nameStore });
  if (!validatedFields.success)
    return {
      message: validatedFields.error!.issues,
      success: false,
    };

  const { name, id } = validatedFields.data;

  try {
    const findStore = await prisma.store.findFirst({
      where: {
        name,
      },
    });

    if (findStore) {
      return {
        message: `${name} already exists`,
        success: false,
      };
    }

    const store = await prisma.store.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    if (!store) {
      return {
        message: "Data not found",
        success: false,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    if (isRedirectError(error)) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return {
            message: `${name} already exists`,
            success: false,
          };
        case "P2025":
          return {
            message: "Data not found",
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

export const getStores = async () => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  try {
    const stores = await prisma.store.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return stores;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
