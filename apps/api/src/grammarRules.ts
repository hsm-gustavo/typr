import { Grammar } from "./types/grammar";

export const grammar: Grammar = {
  S: ["SimpleSentence", "SimpleSentence Conjunction SimpleSentence"],
  SimpleSentence: ["NP VP", "NP VP PP"],
  NP: ["Det Adj Noun", "Det Noun"],
  VP: ["Verb NP", "Verb Adv", "Verb"],
  PP: ["Prep NP"],
  Det: ["{determiners}"],
  Noun: ["{nouns}"],
  Verb: ["{verbs}"],
  Adj: ["{adjectives}"],
  Adv: ["{adverbs}"],
  Prep: ["{prepositions}"],
  Conjunction: ["{conjunctions}"],
}
