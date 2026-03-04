"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PRODUCTS_CACHE_TTL, redis } from "@/lib/redis";
import { generateCacheKey, formatMappingProducts } from "@/lib/utils";
import { DeletedProductSchema, ProductAdminSchema, ProductOutSchema, ProductRejectedSchema, ProductUserSchema } from "@/schema/product-schema";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export const getProductsItems = async (props: GetProductItemTypes) => {
  const cacheKey = generateCacheKey(props);

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const dataCached = typeof cached === "string" ? JSON.parse(cached) : cached;
      return dataCached;
    }

    const {
      store_name,
      status,
      isByOrderStatus = false,
      queryParams: { limit = 10, offset = 0, search },
    } = props;
    const pageSize = Number(limit);
    const page = Number(offset);
    const stores = store_name && store_name.toLowerCase() !== "all" ? store_name.split(",").map((s) => s.trim()) : undefined;

    const whereBase: Prisma.ProductItemsWhereInput = {
      ...(status ? (Array.isArray(status) && status.length > 1 ? { status: { in: status } } : { status: Number(status) }) : {}),
      ...(stores ? { store: { name: { in: stores } } } : {}),
      ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { productCode: { contains: search, mode: "insensitive" } }] } : {}),
    };

    const where = { ...whereBase };

    const items = await prisma.productItems.findMany({
      where,
      include: { unit: { select: { name: true } }, store: { select: { name: true } }, categories: { select: { name: true } }, vendor: { select: { name: true } } },
      orderBy: isByOrderStatus ? [{ status: "asc" }, { createdAt: "desc" }] : [{ createdAt: "desc" }],
      take: pageSize,
      skip: page,
    });

    const result = {
      data: formatMappingProducts(items as ProductTypes[]),
    };

    await redis.set(cacheKey, result, { ex: PRODUCTS_CACHE_TTL });

    return result;
  } catch (error) {
    console.error("Error fetching product items:", error);
    throw error;
  }
};

export const getProductItemsExport = async ({ status, dateRange }: { status: number | string | number[]; dateRange: { from: Date; to: Date } }) => {
  console.log(status);
  console.log(dateRange);
  try {
    const items = await prisma.productItems.findMany({
      where: {
        ...(Array.isArray(status) && status.length > 1 ? { status: { in: status } } : { status: Number(status) }),
        createdAt: {
          gte: new Date(dateRange.from),
          lte: new Date(dateRange.to),
        },
      },
      include: { unit: { select: { name: true } }, store: { select: { name: true } }, categories: { select: { name: true } }, vendor: { select: { name: true } } },
      orderBy: [{ createdAt: "desc" }],
    });
    console.log(items);
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

  const { name, stockIn, storeId, remarks } = validatedFields.data;

  try {
    const response = await prisma.productItems.create({
      data: {
        name,
        stockIn: Number(stockIn),
        storeId,
        remarks,
      },
    });

    if (response.id) {
      await prisma.historyProductItem.create({
        data: {
          productId: response.id,
          remarks: `${name} has been added by ${session.user.store} - ${dayjs(new Date()).format("D MMMM YYYY")}`,
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

export const addProductItemsAdmin = async (formData: FormData) => {
  const rawData = Object.fromEntries(formData);
  const validatedFields = ProductAdminSchema.safeParse(rawData);

  if (!validatedFields.success)
    return {
      message: validatedFields.error!.issues,
      success: false,
    };

  const { name, stockIn, storeId, remarks, categoryId, vendorId, unitId, prCode, productCode, productSubCode, price } = validatedFields.data;

  try {
    const response = await prisma.productItems.create({
      data: {
        name,
        prCode,
        productCode,
        productSubCode,
        stockIn: Number(stockIn),
        price: Number(price),
        categoryId,
        vendorId,
        unitId,
        storeId,
        remarks,
      },
    });

    if (response.id) {
      await prisma.historyProductItem.create({
        data: {
          productId: response.id,
          remarks: `${name} has been added by Admin - ${dayjs(new Date()).format("D MMMM YYYY")}`,
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

  const { name, stockIn, remarks } = validatedFields.data;

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
        remarks,
        updatedAt: new Date(),
      },
    });

    if (response.id) {
      await prisma.historyProductItem.create({
        data: {
          productId: response.id,
          remarks: `Product ${name} has been updated by ${session.user.store} - ${dayjs(new Date()).format("D MMMM YYYY")}`,
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

export const updateProductItemAdmin = async (id: string, typeAction: string, formData: FormData) => {
  const rawData = Object.fromEntries(formData);
  const validatedFields = ProductAdminSchema.safeParse(rawData);

  if (!validatedFields.success)
    return {
      message: validatedFields.error!.issues,
      success: false,
    };

  const { name, stockIn, unitId, categoryId, vendorId, prCode, productCode, productSubCode, price, remarks } = validatedFields.data;

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
        status: 1,
        unitId,
        categoryId,
        vendorId,
        prCode,
        productCode,
        productSubCode,
        price: Number(price),
        remarks,
        updatedAt: new Date(),
      },
    });

    if (response.id) {
      await prisma.historyProductItem.create({
        data: {
          productId: response.id,
          remarks: `Product ${name} has been ${typeAction} by Admin - ${dayjs(new Date()).format("D MMMM YYYY")}`,
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

export const rejectedProductItemAdmin = async (id: string, formData: FormData) => {
  const rawData = Object.fromEntries(formData);
  const validatedFields = ProductRejectedSchema.safeParse(rawData);

  if (!validatedFields.success)
    return {
      message: validatedFields.error!.issues,
      success: false,
    };

  const { remarks, name } = validatedFields.data;

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
        status: 2,
        remarks,
        updatedAt: new Date(),
      },
    });

    if (response.id) {
      await prisma.historyProductItem.create({
        data: {
          productId: response.id,
          remarks: `Product ${name} has been rejected by Admin - ${dayjs(new Date()).format("D MMMM YYYY")}`,
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

export const addUpdateOutboundItemUser = async (formData: FormData) => {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  const rawData = Object.fromEntries(formData);
  const validatedFields = ProductOutSchema.safeParse(rawData);

  if (!validatedFields.success)
    return {
      message: validatedFields.error!.issues,
      success: false,
    };

  const { id, stockOut, remarks } = validatedFields.data;

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
        stockOut: Number(stockOut),
        status: 3,
        remarks,
        updatedAt: new Date(),
      },
    });

    if (response.id) {
      await prisma.historyProductItem.create({
        data: {
          productId: response.id,
          remarks: `Product ${findProduct.name} was moved to outbound by ${session.user.store} - ${dayjs(new Date()).format("D MMMM YYYY")}`,
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

export const approveRejectedOutboundProductItemAdmin = async (id: string, type: string, formData: FormData) => {
  const rawData = Object.fromEntries(formData);
  const validatedFields = ProductRejectedSchema.safeParse(rawData);

  if (!validatedFields.success)
    return {
      message: validatedFields.error!.issues,
      success: false,
    };

  const { remarks, name } = validatedFields.data;

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
        status: type == "approvedOut" ? 4 : 5,
        remarks,
        updatedAt: new Date(),
      },
    });

    if (response.id) {
      await prisma.historyProductItem.create({
        data: {
          productId: response.id,
          remarks: `Outbound Product ${name} has been ${type == "approvedOut" ? "approved" : "rejected"} by Admin - ${dayjs(new Date()).format("D MMMM YYYY")}`,
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
