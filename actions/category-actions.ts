"use server";
import { auth } from "@/auth";
import { generateCacheKey, getCache, invalidateCache, setCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { CategorySchema, DeletedCategorySchema } from "@/schema/category-schema";
import { Prisma } from "@prisma/client";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export const getCategories = async (props: FetchDataPropsTypes) => {
  const cacheKey = await generateCacheKey({ typeCache: "categories", queryParams: props });
  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      const dataCached = typeof cached === "string" ? JSON.parse(cached) : cached;
      return dataCached;
    }

    const { limit, offset, search } = props;

    const where: Prisma.ProductCategoriesWhereInput = {
      ...(search && {
        OR: [{ name: { contains: search, mode: "insensitive" } }],
      }),
    };

    const categories = await prisma.productCategories.findMany({
      where,
      ...(limit && { take: Number(limit) }),
      ...(offset && { skip: Number(offset) }),
      orderBy: { createdAt: "desc" },
    });

    const result = {
      data: categories,
    };

    await setCache(cacheKey, JSON.stringify(result));

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addCategory = async (formData: FormData) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const rawData = Object.fromEntries(formData);
  const validatedFields = CategorySchema.safeParse(rawData);

  if (!validatedFields.success)
    return {
      message: validatedFields.error!.issues,
      success: false,
    };

  const { name } = validatedFields.data;

  try {
    const findCategory = await prisma.productCategories.findFirst({
      where: {
        name,
      },
    });

    if (findCategory) {
      return {
        message: `${name} already exists`,
        success: false,
      };
    }

    const response = await prisma.productCategories.create({
      data: {
        name,
      },
    });

    if (response) {
      await invalidateCache("categories");
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

export const updateCategory = async (id: string, formData: FormData) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const rawData = Object.fromEntries(formData);
  const validatedFields = CategorySchema.safeParse(rawData);

  if (!validatedFields.success)
    return {
      message: validatedFields.error!.issues,
      success: false,
    };

  const { name } = validatedFields.data;

  try {
    const findCategory = await prisma.productCategories.findFirst({
      where: {
        OR: [{ id }, { name }],
      },
    });

    if (!findCategory) {
      return {
        message: "Data not found",
        success: false,
      };
    }

    if (findCategory.name === name) {
      return {
        message: `${name} already exists`,
        success: false,
      };
    }

    const response = await prisma.productCategories.update({
      where: {
        id,
      },
      data: {
        name,
        updatedAt: new Date(),
      },
    });

    if (response) {
      await invalidateCache("categories");
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

export const deleteCategory = async (id: string) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const validatedFields = DeletedCategorySchema.safeParse({ id });
  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues,
      success: false,
    };
  }

  try {
    const response = await prisma.productCategories.delete({
      where: {
        id,
      },
    });

    if (response) {
      await invalidateCache("categories");
      return {
        success: true,
      };
    }
  } catch (error) {
    throw error;
  }
};
