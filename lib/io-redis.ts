import Redis from "ioredis";

export const ioRedis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});
