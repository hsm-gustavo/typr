import { json, urlencoded } from "body-parser"
import express, { type Express } from "express"
import morgan from "morgan"
import cors from "cors"
import { router } from "./routes/sentence"

export const createServer = (): Express => {
  const app = express()
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use("/api/sentence", router)

  return app
}
