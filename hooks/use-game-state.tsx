"use client"

import { useState, useEffect } from "react"
import type { Traits, MindState, Choice, Dilemma, ChoiceHistoryItem } from "@/lib/game-types"

export function useGameState(allDilemmas: Dilemma[], initialTraits: Traits, initialMindState: MindState) {
  // Game state
  const [traits, setTraits] = useState<Traits>(initialTraits)
  const [mindState, setMindState] = useState<MindState>(initialMindState)
  const [completedDilemmas, setCompletedDilemmas] = useState<string[]>([])
  const [currentDilemmaId, setCurrentDilemmaId] = useState<string>("start")
  const [showReflection, setShowReflection] = useState(false)
  const [choiceHistory, setChoiceHistory] = useState<ChoiceHistoryItem[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [decisionTimes, setDecisionTimes] = useState<Record<string, number>>({})
  const [startTime, setStartTime] = useState<number | null>(null)
  const [mouseMovements, setMouseMovements] = useState<{ x: number; y: number; time: number }[]>([])
  const [hoveredChoices, setHoveredChoices] = useState<Record<string, number>>({})
  const [revealedInfluences, setRevealedInfluences] = useState(false)
  const [showDeterministicQuote, setShowDeterministicQuote] = useState(true)

  // Get the current dilemma
  const currentDilemma = allDilemmas.find((d) => d.id === currentDilemmaId)

  // Set up timer for time-limited dilemmas
  useEffect(() => {
    if (!currentDilemma || showReflection) return

    if (currentDilemma.timeLimit) {
      setTimeRemaining(currentDilemma.timeLimit)
      setStartTime(Date.now())

      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer)
            // Auto-select first available choice if time runs out
            const availableChoices = currentDilemma.choices.filter(
              (choice) => !choice.requiresTrait || traits[choice.requiresTrait.trait] >= choice.requiresTrait.min,
            )
            if (availableChoices.length > 0) {
              handleChoice(availableChoices[0])
            }
            return null
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    } else {
      setTimeRemaining(null)
      setStartTime(Date.now())
    }
  }, [currentDilemmaId, showReflection, currentDilemma])

  // Track choice hovering
  const handleChoiceHover = (choiceId: string) => {
    setHoveredChoices((prev) => ({
      ...prev,
      [choiceId]: (prev[choiceId] || 0) + 1,
    }))
  }

  // Handle making a choice
  const handleChoice = (choice: Choice) => {
    if (!currentDilemma) return

    // Record decision time
    if (startTime) {
      const decisionTime = (Date.now() - startTime) / 1000
      setDecisionTimes((prev) => ({ ...prev, [currentDilemma.id]: decisionTime }))
    }

    // Update traits based on choice
    setTraits((prev) => {
      const newTraits = { ...prev }
      Object.entries(choice.traitEffects).forEach(([trait, effect]) => {
        newTraits[trait as keyof Traits] += effect
        // Keep traits within 0-10 range
        newTraits[trait as keyof Traits] = Math.max(0, Math.min(10, newTraits[trait as keyof Traits]))
      })
      return newTraits
    })

    // Update mind state
    setMindState((prev) => {
      const newState = { ...prev }

      // Update stress
      if (currentDilemma.stressEffect) {
        newState.stress += currentDilemma.stressEffect
        newState.stress = Math.max(0, Math.min(10, newState.stress))
      }

      // Update priming
      if (currentDilemma.primingEffect) {
        newState.primed = currentDilemma.primingEffect
      }

      // Update recent choices
      newState.recentChoices = [...prev.recentChoices, choice.id].slice(-3)

      return newState
    })

    // Determine hidden influences
    const hiddenInfluences: string[] = []

    if (choice.hiddenInfluence) {
      hiddenInfluences.push(choice.hiddenInfluence)
    }

    if (choice.positionBias) {
      hiddenInfluences.push(`Position bias: ${choice.positionBias} option`)
    }

    if (currentDilemma.visualPriming) {
      hiddenInfluences.push(`Visual priming: ${currentDilemma.visualPriming} imagery`)
    }

    if (timeRemaining !== null && timeRemaining < 5) {
      hiddenInfluences.push("Time pressure influenced faster decision")
    }

    if (mindState.primed) {
      hiddenInfluences.push(`Primed concept: ${mindState.primed}`)
    }

    if (mindState.stress > 7) {
      hiddenInfluences.push("High stress level affected decision processing")
    }

    // Record choice
    setChoiceHistory((prev) => [
      ...prev,
      {
        dilemmaId: currentDilemma.id,
        choiceId: choice.id,
        choiceText: choice.text,
        hiddenInfluences,
        positionBias: choice.positionBias,
      },
    ])

    // Show reflection
    setShowReflection(true)
  }

  const handleNext = () => {
    if (!currentDilemma) return

    // First, add current dilemma to completed list
    const newCompletedDilemmas = [...completedDilemmas, currentDilemma.id]
    setCompletedDilemmas(newCompletedDilemmas)

    // If we haven't completed 8 dilemmas, proceed with next dilemma selection
    const lastChoice = choiceHistory[choiceHistory.length - 1]
    const choiceMade = currentDilemma.choices.find((c) => c.id === lastChoice.choiceId)

    if (choiceMade?.followUp) {
      // Check if the follow-up dilemma has stress requirements
      const nextDilemma = allDilemmas.find((d) => d.id === choiceMade.followUp)

      if (nextDilemma?.requiresStress) {
        const { min, max } = nextDilemma.requiresStress
        if (mindState.stress < min || mindState.stress > max) {
          // Stress requirements not met, find an alternative
          const alternatives = allDilemmas.filter(
            (d) =>
              !newCompletedDilemmas.includes(d.id) &&
              d.id !== "start" &&
              (!d.requiresStress ||
                (mindState.stress >= d.requiresStress.min && mindState.stress <= d.requiresStress.max)),
          )

          if (alternatives.length > 0) {
            setCurrentDilemmaId(alternatives[0].id)
          }
        } else {
          setCurrentDilemmaId(choiceMade.followUp)
        }
      } else {
        setCurrentDilemmaId(choiceMade.followUp)
      }
    } else {
      // Find a suitable next dilemma
      const possibleNext = allDilemmas.filter(
        (d) =>
          !newCompletedDilemmas.includes(d.id) &&
          d.id !== "start" &&
          (!d.requiresStress || (mindState.stress >= d.requiresStress.min && mindState.stress <= d.requiresStress.max)),
      )

      if (possibleNext.length > 0) {
        setCurrentDilemmaId(possibleNext[0].id)
      }
    }

    setShowReflection(false)
    setShowDeterministicQuote(true)
  }

  // Reset the game
  const resetGame = () => {
    setTraits(initialTraits)
    setMindState(initialMindState)
    setCompletedDilemmas([])
    setCurrentDilemmaId("start")
    setShowReflection(false)
    setChoiceHistory([])
    setDecisionTimes({})
    setMouseMovements([])
    setHoveredChoices({})
    setRevealedInfluences(false)
    setShowDeterministicQuote(true)
  }

  return {
    traits,
    mindState,
    completedDilemmas,
    currentDilemmaId,
    showReflection,
    choiceHistory,
    timeRemaining,
    decisionTimes,
    startTime,
    mouseMovements,
    hoveredChoices,
    revealedInfluences,
    showDeterministicQuote,
    handleChoice,
    handleChoiceHover,
    handleNext,
    resetGame,
    setShowReflection,
    setRevealedInfluences,
    setShowDeterministicQuote,
  }
}

