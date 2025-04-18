export type GrammarRule = string[]

export type Grammar = {
  [key: string]: GrammarRule // key: variable like 'S', value: rule options
}

export type Category =
  | "nouns"
  | "verbs"
  | "adjectives"
  | "adverbs"
  | "determiners"
  | "prepositions"
  | "conjunctions"

export type WordBank = {
  [category in Category]: string[]
}