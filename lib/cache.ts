"use server";
import { ioRedis } from "./io-redis";
import { redis } from "./redis";

const isDev = process.env.NODE_ENV === "development";
const PRODUCTS_CACHE_TTL = 7 * 24 * 60 * 60;

export const generateCacheKey = async (props: GetProductItemTypes) => {
  const {
    typeCache = "products",
    store_name = "all",
    status = "all",
    isByOrderStatus = false,
    queryParams: { limit = 10, offset = 0, search = "" },
  } = props;

  const version = await getCacheVersion(typeCache);

  return `inventory:prod:${typeCache}:v${version}:${store_name}:${status}:${isByOrderStatus}:${limit}:${offset}:${search}`;
};

export const getCacheVersion = async (typeCache: string): Promise<number> => {
  let version: number;

  if (isDev) {
    version = (await ioRedis.get(`inventory:prod:${typeCache}:version`)) as unknown as number;
  } else {
    version = (await redis.get(`inventory:prod:${typeCache}:version`)) as number;
  }

  if (!version) {
    version = 1;

    if (isDev) await ioRedis.set(`inventory:prod:${typeCache}:version`, version);
    else await redis.set(`inventory:prod:${typeCache}:version`, version);
  }

  return version;
};

export const setCache = async (key: string, data: string) => {
  if (isDev) {
    await ioRedis.set(key, data, "EX", PRODUCTS_CACHE_TTL);
  } else {
    await redis.set(key, data, { ex: PRODUCTS_CACHE_TTL });
  }
};

export const getCache = async (key: string) => {
  if (isDev) {
    return await ioRedis.get(key);
  } else {
    return await redis.get(key);
  }
};

export const invalidateCache = async (key: string) => {
  if (isDev) await ioRedis.incr(`inventory:prod:${key}:version`);
  else await redis.incr(`inventory:prod:${key}:version`);
};
