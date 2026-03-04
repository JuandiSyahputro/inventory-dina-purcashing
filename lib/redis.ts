import { Redis } from "@upstash/redis";

export const PRODUCTS_CACHE_TTL = 7 * 24 * 60 * 60;
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
