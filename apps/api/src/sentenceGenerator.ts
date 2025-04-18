import { redis } from "./redis"
import { Grammar, WordBank } from "./types/grammar"

export async function generateSentence(grammar: Grammar): Promise<string> {
  async function expand(symbol: string): Promise<string> {
    if (symbol.startsWith("{") && symbol.endsWith("}")) {
      const category = symbol.slice(1, -1) as keyof WordBank
      const word = await redis.srandmember(category)
      return word ?? `[${category}]`
    }

    const rules = grammar[symbol]
    if (!rules) return symbol

    const chosen = rules[Math.floor(Math.random() * rules.length)]
    const expandedParts = await Promise.all(chosen.split(" ").map(expand))
    return expandedParts.join(" ")
  }

  const sentence = await expand("S")
  return capitalize(sentence) + "."
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
