"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatMappingProducts } from "@/lib/utils";
import { DeletedProductSchema, ProductUserSchema } from "@/schema/product-schema";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export const getProductsItems = async (props: GetProductItemTypes) => {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const { store_name, status, limit = 10, offset = 0 } = props;
  const pageSize = Number(limit);
  const page = Number(offset);

  try {
    const stores = store_name && store_name.toLowerCase() !== "all" ? store_name.split(",").map((s) => s.trim()) : undefined;

    const whereBase = {
      ...(status ? { status: Number(status) } : {}),
      ...(stores ? { store: { name: { in: stores } } } : {}),
    };

    const where = { ...whereBase };

    const items = await prisma.productItems.findMany({
      where,
      include: {
        unit: true,
        store: true,
        categories: true,
        vendor: true,
      },
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: page,
    });

    return {
      data: formatMappingProducts(items as ProductTypes[]),
    };
  } catch (error) {
    console.error("Error fetching product items:", error);
    throw error;
  }
};

export const addProductItemsUser = async (formData: FormData) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const rawData = Object.fromEntries(formData);
  const validatedFields = ProductUserSchema.safeParse(rawData);

  if (!validatedFields.success)
    return {
      message: validatedFields.error!.issues,
      success: false,
    };

  const { name, stockIn, storeId } = validatedFields.data;

  try {
    const response = await prisma.productItems.create({
      data: {
        name,
        stockIn: Number(stockIn),
        storeId,
      },
    });

    if (response.id) {
      await prisma.historyProductItem.create({
        data: {
          productId: response.id,
          remarks: `${name} has been added from ${session.user.store} - ${dayjs(new Date()).format("D MMMM YYYY")}`,
        },
      });
    }

    if (response) {
      return {
        success: true,
      };
    }
  } catch (error) {
    console.log(error);
    if (isRedirectError(error)) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error);
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

export const updateProductItemUser = async (id: string, formData: FormData) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const rawData = Object.fromEntries(formData);
  const validatedFields = ProductUserSchema.safeParse(rawData);

  if (!validatedFields.success)
    return {
      message: validatedFields.error!.issues,
      success: false,
    };

  const { name, stockIn } = validatedFields.data;

  try {
    const findProduct = await prisma.productItems.findFirst({
      where: {
        id,
      },
    });

    if (!findProduct) {
      return {
        message: "Data not found",
        success: false,
      };
    }

    const response = await prisma.productItems.update({
      where: {
        id,
      },
      data: {
        name,
        stockIn: Number(stockIn),
        status: 0,
        updatedAt: new Date(),
      },
    });

    if (response.id) {
      await prisma.historyProductItem.create({
        data: {
          productId: response.id,
          remarks: `${name} has been updated from ${session.user.store} - ${dayjs(new Date()).format("D MMMM YYYY")}`,
        },
      });
    }

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

export const deleteProduct = async (id: string) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const validatedFields = DeletedProductSchema.safeParse({ id });
  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues,
      success: false,
    };
  }

  try {
    const response = await prisma.productItems.delete({
      where: {
        id,
      },
    });

    if (response) {
      return {
        success: true,
      };
    }
  } catch (error) {
    throw error;
  }
};
