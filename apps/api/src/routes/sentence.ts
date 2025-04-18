import express, { Router } from "express"
import { grammar } from "../grammarRules"
import { generateSentence } from "../sentenceGenerator"

export const router: Router = express.Router()

router.get("/", async (req, res) => {
  const count = Math.min(parseInt(req.query.count as string) || 1, 20)

  try {
    const sentences = await Promise.all(
      Array.from({ length: count }, () => generateSentence(grammar))
    )
    res.json({ count, sentences })
  } catch {
    res.status(500).json({ error: "Failed to generate sentence" })
  }
})
