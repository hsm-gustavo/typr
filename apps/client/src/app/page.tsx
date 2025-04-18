import TypingTest from "@/components/typing-test"
import { fetchSentence } from "@/lib/api"
import { Sentence } from "@/lib/types/sentence"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

export default async function Home() {
  const queryClient = new QueryClient()

  queryClient.prefetchQuery({
    queryKey: ["sentence"],
    queryFn: () => fetchSentence(),
  })

  const sentence: Sentence = await fetchSentence()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-background">
          <div className="w-full max-w-3xl flex flex-col gap-8">
            <header className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tighter">
                <span className="text-primary">Typr</span>
              </h1>
            </header>

            <TypingTest initialSentence={sentence} />

            <footer className="text-center text-sm text-muted-foreground mt-8">
              <p>Typr - Test your typing speed and accuracy</p>
            </footer>
          </div>
        </main>
      </Suspense>
    </HydrationBoundary>
  )
}
