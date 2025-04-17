import TypingTest from "@/components/typing-test"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-background">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tighter">
            <span className="text-primary">Typr</span>
          </h1>
        </header>

        <TypingTest />

        <footer className="text-center text-sm text-muted-foreground mt-8">
          <p>Typr - Test your typing speed and accuracy</p>
        </footer>
      </div>
    </main>
  )
}
