import Redis from "ioredis";
export const redis = new Redis()

export async function getWordList(category: string): Promise<string[]> {
  return await redis.smembers(category)
}
