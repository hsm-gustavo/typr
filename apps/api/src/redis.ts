import Redis from "ioredis"
export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: 6379,
  password: process.env.REDIS_PASSWORD,
})

console.log("REDIS_PASS", process.env.REDIS_PASSWORD)

export async function getWordList(category: string): Promise<string[]> {
  return await redis.smembers(category)
}
