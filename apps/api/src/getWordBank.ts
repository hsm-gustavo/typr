
import { Category, WordBank } from "./types/grammar"
import { getWordList } from "./redis"

const categories: Category[] = [
  "nouns",
  "verbs",
  "adjectives",
  "adverbs",
  "determiners",
  "prepositions",
  "conjunctions",
]

export async function getWordBank(): Promise<WordBank> {
  const entries = await Promise.all(
    categories.map(async (cat) => [cat, await getWordList(cat)] as const)
  )
  return Object.fromEntries(entries) as WordBank
}
