"use server";
import { auth } from "@/auth";
import { generateCacheKey, getCache, invalidateCache, setCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { DeletedUnitSchema, UnitSchema } from "@/schema/units-schema";
import { Prisma } from "@prisma/client";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export const getUnits = async (props: FetchDataPropsTypes) => {
  const cacheKey = await generateCacheKey({ typeCache: "units", queryParams: props });
  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      const dataCached = typeof cached === "string" ? JSON.parse(cached) : cached;
      return dataCached;
    }

    const { limit, offset, search } = props;

    const where: Prisma.ProductUnitsWhereInput = {
      ...(search && {
        OR: [{ name: { contains: search, mode: "insensitive" } }],
      }),
    };
    const units = await prisma.productUnits.findMany({
      where,
      ...(limit && { take: Number(limit) }),
      ...(offset && { skip: Number(offset) }),
      orderBy: { createdAt: "desc" },
    });

    const result = {
      data: units,
    };

    await setCache(cacheKey, JSON.stringify(result));

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addUnit = async (formData: FormData) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const rawData = Object.fromEntries(formData);
  const validatedFields = UnitSchema.safeParse(rawData);

  if (!validatedFields.success)
    return {
      message: validatedFields.error!.issues,
      success: false,
    };

  const { name } = validatedFields.data;

  try {
    const findUnit = await prisma.productUnits.findFirst({
      where: {
        name,
      },
    });

    if (findUnit) {
      return {
        message: `${name} already exists`,
        success: false,
      };
    }

    const response = await prisma.productUnits.create({
      data: {
        name,
      },
    });

    if (response) {
      await invalidateCache("units");
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

export const updateUnit = async (id: string, formData: FormData) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const rawData = Object.fromEntries(formData);
  const validatedFields = UnitSchema.safeParse(rawData);

  if (!validatedFields.success)
    return {
      message: validatedFields.error!.issues,
      success: false,
    };

  const { name } = validatedFields.data;

  try {
    const findUnit = await prisma.productUnits.findFirst({
      where: {
        OR: [{ id }, { name }],
      },
    });

    if (!findUnit) {
      return {
        message: "Data not found",
        success: false,
      };
    }

    if (findUnit.name === name) {
      return {
        message: `${name} already exists`,
        success: false,
      };
    }

    const response = await prisma.productUnits.update({
      where: {
        id,
      },
      data: {
        name,
        updatedAt: new Date(),
      },
    });

    if (response) {
      await invalidateCache("units");
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

export const deleteUnit = async (id: string) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const validatedFields = DeletedUnitSchema.safeParse({ id });
  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues,
      success: false,
    };
  }

  try {
    const response = await prisma.productUnits.delete({
      where: {
        id,
      },
    });

    if (response) {
      await invalidateCache("units");
      return {
        success: true,
      };
    }
  } catch (error) {
    throw error;
  }
};
