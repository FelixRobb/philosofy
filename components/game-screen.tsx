"use client"

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Brain, ArrowRight } from "lucide-react"
import { DilemmaDisplay } from "@/components/dilemma-display"
import { ReflectionDisplay } from "@/components/reflection-display"
import { allDilemmas } from "@/lib/dilemmas"
import { dilemmaImages } from "@/lib/dilemma-images"
import type { Traits, MindState, Choice, ChoiceHistoryItem } from "@/lib/game-types"

interface GameScreenProps {
  traits: Traits
  mindState: MindState
  completedDilemmas: string[]
  currentDilemmaId: string
  showReflection: boolean
  choiceHistory: ChoiceHistoryItem[]
  timeRemaining: number | null
  showDeterministicQuote: boolean
  setShowDeterministicQuote: (show: boolean) => void
  handleChoice: (choice: Choice) => void
  handleNext: () => void
  handleChoiceHover: (choiceId: string) => void
  completeGame: () => void
}

export function GameScreen({
  traits,
  mindState,
  completedDilemmas,
  currentDilemmaId,
  showReflection,
  choiceHistory,
  timeRemaining,
  showDeterministicQuote,
  setShowDeterministicQuote,
  handleChoice,
  handleNext,
  handleChoiceHover,
  completeGame,
}: GameScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Get the current dilemma
  const currentDilemma = allDilemmas.find((d) => d.id === currentDilemmaId)

  // Calculate progress
  const progress = Math.min((completedDilemmas.length / 8) * 100, 100)

  // Track mouse movements
  useEffect(() => {
    if (!containerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        // Mouse movement tracking is now handled in the useGameState hook
      }
    }

    containerRef.current.addEventListener("mousemove", handleMouseMove)

    return () => {
      containerRef.current?.removeEventListener("mousemove", handleMouseMove)
    }
  }, [currentDilemmaId])

  // Filter choices based on user traits and priming
  const availableChoices = currentDilemma
    ? currentDilemma.choices.filter((choice) => {
        // Check if this choice requires a certain trait level
        if (choice.requiresTrait && traits[choice.requiresTrait.trait] < choice.requiresTrait.min) {
          return false
        }

        // Check if this choice requires certain priming
        if (choice.requiresPriming && mindState.primed !== choice.requiresPriming) {
          return false
        }

        return true
      })
    : []

  // Handle next button with completion check
  const handleNextWithCompletion = () => {
    if (completedDilemmas.length >= 7) {
      // This will be the 8th dilemma completed, so we should go to the analysis screen
      completeGame()
    } else {
      handleNext()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDilemmaId + (showReflection ? "-reflection" : "")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          ref={containerRef}
          className="w-full max-w-3xl"
        >
          <Card className="border-indigo-500/30 bg-slate-800/90 text-white shadow-xl shadow-indigo-900/20">
            <CardHeader className="border-b border-indigo-500/20">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CardTitle className="text-2xl text-indigo-200">{currentDilemma?.title}</CardTitle>
                  {timeRemaining !== null && (
                    <div className="ml-4 px-3 py-1 bg-indigo-900/50 border border-indigo-500/30 rounded-md text-sm font-medium flex items-center text-indigo-300">
                      <Clock className="h-4 w-4 mr-1 text-indigo-400" /> {timeRemaining}s
                    </div>
                  )}
                </div>
                <Badge variant="outline" className="border-indigo-500/50 text-indigo-300">
                  {completedDilemmas.length + 1} of 8
                </Badge>
              </div>
              <Progress value={progress} className="h-2 bg-slate-700 mt-2">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                  style={{ width: `${progress}%` }}
                />
              </Progress>
              <div className="flex items-center mt-2">
                <Brain className="h-4 w-4 mr-2 text-indigo-400" />
                <span className="text-xs text-indigo-300">Stress Level: {mindState.stress}/10</span>
              </div>

              {showDeterministicQuote && currentDilemma?.deterministicQuote && (
                <motion.div
                  className="mt-3 text-xs italic text-indigo-300/80 p-2 border-l-2 border-indigo-500/30 pl-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {currentDilemma.deterministicQuote}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-2 opacity-50 hover:opacity-100 text-indigo-300"
                    onClick={() => setShowDeterministicQuote(false)}
                  >
                    <span className="sr-only">Dismiss</span>×
                  </Button>
                </motion.div>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center mr-4">
                  {currentDilemma && dilemmaImages[currentDilemma.image]}
                </div>
                <p className="text-lg text-white/90">{currentDilemma?.scenario}</p>
              </div>

              {!showReflection ? (
                <DilemmaDisplay
                  availableChoices={availableChoices}
                  handleChoice={handleChoice}
                  handleChoiceHover={handleChoiceHover}
                />
              ) : (
                <ReflectionDisplay currentDilemma={currentDilemma} choiceHistory={choiceHistory} />
              )}
            </CardContent>
            {showReflection && (
              <CardFooter className="border-t border-indigo-500/20 pt-6">
                <Button
                  onClick={handleNextWithCompletion}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

