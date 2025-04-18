"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Keyboard, RefreshCw, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchSentence } from "@/lib/api"
import { Sentence } from "@/lib/types/sentence"

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.",
  "Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using many programming languages.",
  "A typing test is a method to measure how fast and accurately you can type. The result is usually measured in words per minute or WPM.",
  "The best way to predict the future is to invent it. The future belongs to those who believe in the beauty of their dreams.",
]

type TestStatus = "idle" | "typing" | "finished"
type TestState = {
  text: string
  input: string
  timing: {
    start: number | null
    end: number | null
  }
  status: TestStatus
  stats: {
    wpm: number
    accuracy: number
  }
  currentIndex: number
  isFocused: boolean
  showFocusMessage: boolean
}

export default function TypingTest({
  initialSentence,
}: {
  initialSentence: Sentence
}) {
  const [state, setState] = useState<TestState>({
    text: "",
    input: "",
    timing: {
      start: null,
      end: null,
    },
    status: "idle",
    stats: {
      wpm: 0,
      accuracy: 0,
    },
    currentIndex: 0,
    isFocused: false,
    showFocusMessage: false,
  })
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery<Sentence>({
    queryKey: ["sentence"],
    queryFn: fetchSentence,
    refetchOnWindowFocus: false,
    initialData: initialSentence,
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const focusMessageTimerRef = useRef<NodeJS.Timeout | null>(null)

  const resetTest = useCallback(() => {
    const randomText = data.sentences.join(" ")
    setState({
      text: randomText,
      input: "",
      timing: {
        start: null,
        end: null,
      },
      status: "idle",
      stats: {
        wpm: 0,
        accuracy: 0,
      },
      currentIndex: 0,
      isFocused: true,
      showFocusMessage: false,
    })

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }, [data.sentences])

  const invalidateAndReset = () => {
    queryClient.invalidateQueries({ queryKey: ["sentence"] })
    resetTest()
  }

  useEffect(() => {
    resetTest()
  }, [resetTest])

  const calculateStats = useCallback(
    (input: string, text: string, startTime: number | null) => {
      if (!startTime) return { wpm: 0, accuracy: 0 }

      const currentTime = Date.now()
      const timeElapsedInMinutes = (currentTime - startTime) / 60000

      if (timeElapsedInMinutes <= 0) return { wpm: 0, accuracy: 0 }

      const charactersTyped = input.length
      const wpm = Math.round(charactersTyped / 5 / timeElapsedInMinutes)

      let correctChars = 0
      for (let i = 0; i < input.length; i++) {
        if (input[i] === text[i]) {
          correctChars++
        }
      }
      const accuracy =
        input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100

      return { wpm, accuracy }
    },
    []
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      setState((prev) => {
        if (prev.status === "finished" || value.length > prev.text.length)
          return prev

        const newTiming = { ...prev.timing }
        let newStatus: TestStatus = prev.status

        if (value.length === 1 && prev.status === "idle") {
          newTiming.start = Date.now()
          newStatus = "typing"
        }

        if (value.length === prev.text.length && prev.status === "typing") {
          newTiming.end = Date.now()
          newStatus = "finished"
        }

        const newStats = calculateStats(
          value,
          prev.text,
          newTiming.start || prev.timing.start
        )

        return {
          ...prev,
          input: value,
          timing: newTiming,
          status: newStatus,
          stats: newStats,
          currentIndex: value.length,
        }
      })
    },
    [calculateStats]
  )

  const handleFocus = useCallback(() => {
    if (focusMessageTimerRef.current) {
      clearTimeout(focusMessageTimerRef.current)
      focusMessageTimerRef.current = null
    }

    setState((prev) => ({ ...prev, isFocused: true, showFocusMessage: false }))
  }, [])

  const handleBlur = useCallback(() => {
    setState((prev) => ({ ...prev, isFocused: false }))

    focusMessageTimerRef.current = setTimeout(() => {
      setState((prev) => {
        if (!prev.isFocused) {
          return { ...prev, showFocusMessage: true }
        }
        return prev
      })
    }, 100)
  }, [])

  useEffect(() => {
    return () => {
      if (focusMessageTimerRef.current) {
        clearTimeout(focusMessageTimerRef.current)
      }
    }
  }, [])

  const handleContainerClick = useCallback(() => {
    if (inputRef.current && state.status !== "finished") {
      inputRef.current.focus()
    }
  }, [state.status])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
  }, [])

  const renderText = useCallback(() => {
    return (
      <div className="relative">
        {state.text.split("").map((char, index) => {
          let className = "transition-colors duration-150"

          if (index < state.input.length) {
            className +=
              state.input[index] === char
                ? " text-green-500 dark:text-green-400"
                : " text-red-500 dark:text-red-400"
          }

          return (
            <span key={index} className={className}>
              {char}
            </span>
          )
        })}
        {state.isFocused && state.status !== "finished" && (
          <span
            className="absolute inline-block w-[2px] h-[1.2em] bg-primary animate-blink"
            style={{
              left: `${state.currentIndex * 0.6}em`,
              top: "0.1em",
            }}
            aria-hidden="true"
          />
        )}
      </div>
    )
  }, [
    state.text,
    state.input,
    state.currentIndex,
    state.isFocused,
    state.status,
  ])

  return (
    <div
      className="flex flex-col gap-6"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Badge variant="outline" className="font-mono">
            {state.stats.wpm} WPM
          </Badge>
          <Badge variant="outline" className="font-mono">
            {state.stats.accuracy}% Accuracy
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={invalidateAndReset}
          aria-label="Reset test"
        >
          {state.status === "finished" ? (
            <RefreshCw className="h-4 w-4" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Card
        className={cn(
          "border border-muted relative overflow-hidden",
          !state.isFocused &&
            state.status !== "finished" &&
            "opacity-80 transition-opacity duration-300"
        )}
      >
        <CardContent className="p-6">
          <div
            className={cn(
              "font-mono text-lg leading-relaxed mb-8 relative",
              !!state.isFocused &&
                state.status !== "finished" &&
                "blur-[0.5px] transition-all duration-300"
            )}
          >
            {renderText()}
          </div>

          {/* invisible input field */}
          <input
            ref={inputRef}
            type="text"
            value={state.input}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onPaste={handlePaste}
            className="absolute opacity-0 top-0 left-0 h-full w-full cursor-default"
            disabled={state.status === "finished"}
            autoFocus
          />

          {/* focus message */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm",
              "transition-all duration-500 ease-in-out",
              state.showFocusMessage
                ? "opacity-100 transform-none"
                : "opacity-0 translate-y-4 pointer-events-none"
            )}
          >
            <div
              className={cn(
                "flex flex-col items-center gap-2 p-4",
                "transition-all duration-500 ease-in-out transform",
                state.showFocusMessage
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0"
              )}
            >
              <Keyboard
                className={cn(
                  "text-primary transition-all duration-700 ease-in-out",
                  state.showFocusMessage
                    ? "opacity-100 rotate-0"
                    : "opacity-0 -rotate-12"
                )}
                size={32}
              />
              <p
                className={cn(
                  "font-medium transition-all duration-500 ease-in-out",
                  state.showFocusMessage
                    ? "opacity-100 transform-none"
                    : "opacity-0 translate-y-2"
                )}
              >
                Click here to focus
              </p>
            </div>
          </div>

          {state.status === "finished" && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md transition-all duration-500 ease-in-out">
              <Button onClick={invalidateAndReset} className="font-mono">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {state.status === "finished" && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Results</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Speed</p>
                <p className="text-3xl font-mono font-bold">
                  {state.stats.wpm} <span className="text-sm">WPM</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-3xl font-mono font-bold">
                  {state.stats.accuracy}
                  <span className="text-sm">%</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
