import { config } from "@repo/eslint-config/next"
import pluginQuery from "@tanstack/eslint-plugin-query"

/** @type {import("eslint").Linter.Config} */
export default [...config, ...pluginQuery.configs["flat/recommended"]]
