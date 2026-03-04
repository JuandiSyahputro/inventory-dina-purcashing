"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PRODUCTS_CACHE_TTL, redis } from "@/lib/redis";
import { generateCacheKey } from "@/lib/utils";
import { DeletedVendorSchema, VendorSchema } from "@/schema/vendor-schema";
import { Prisma } from "@prisma/client";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export const getVendors = async (props: FetchDataPropsTypes) => {
  const cacheKey = generateCacheKey({ typeCache: "vendors", queryParams: props });
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const dataCached = typeof cached === "string" ? JSON.parse(cached) : cached;
      return dataCached;
    }

    const { limit, offset, search } = props;

    const where: Prisma.VendorWhereInput = {
      ...(search && {
        OR: [{ name: { contains: search, mode: "insensitive" } }],
      }),
    };
    const vendors = await prisma.vendor.findMany({
      where,
      ...(limit && { take: Number(limit) }),
      ...(offset && { skip: Number(offset) }),
      orderBy: { createdAt: "desc" },
    });

    const result = {
      data: vendors,
    };

    await redis.set(cacheKey, result, { ex: PRODUCTS_CACHE_TTL });

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addVendor = async (formData: FormData) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const rawData = Object.fromEntries(formData);
  const validatedFields = VendorSchema.safeParse(rawData);

  if (!validatedFields.success)
    return {
      message: validatedFields.error!.issues,
      success: false,
    };

  const { name } = validatedFields.data;

  try {
    const findVendor = await prisma.vendor.findFirst({
      where: {
        name,
      },
    });

    if (findVendor) {
      return {
        message: `${name} already exists`,
        success: false,
      };
    }

    const response = await prisma.vendor.create({
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

export const updateVendor = async (id: string, formData: FormData) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const rawData = Object.fromEntries(formData);
  const validatedFields = VendorSchema.safeParse(rawData);

  if (!validatedFields.success)
    return {
      message: validatedFields.error!.issues,
      success: false,
    };

  const { name } = validatedFields.data;

  try {
    const findVendor = await prisma.vendor.findFirst({
      where: {
        id,
      },
    });

    if (!findVendor) {
      return {
        message: "Data not found",
        success: false,
      };
    }

    const findVendorName = await prisma.vendor.findFirst({
      where: {
        name,
      },
    });

    if (findVendorName) {
      return {
        message: `${name} already exists`,
        success: false,
      };
    }

    const response = await prisma.vendor.update({
      where: {
        id,
      },
      data: {
        name,
        updatedAt: new Date(),
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

export const deleteVendor = async (id: string) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const validatedFields = DeletedVendorSchema.safeParse({ id });
  if (!validatedFields.success) {
    return {
      message: validatedFields.error.issues,
      success: false,
    };
  }

  try {
    const response = await prisma.vendor.delete({
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
