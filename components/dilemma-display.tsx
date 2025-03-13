"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { Choice } from "@/lib/game-types"

interface DilemmaDisplayProps {
  availableChoices: Choice[]
  handleChoice: (choice: Choice) => void
  handleChoiceHover: (choiceId: string) => void
}

export function DilemmaDisplay({ availableChoices, handleChoice, handleChoiceHover }: DilemmaDisplayProps) {
  return (
    <div className="space-y-3">
      {availableChoices.map((choice, index) => (
        <motion.div
          key={choice.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            className="w-full justify-start text-left h-auto py-4 px-4 border-indigo-500/30 text-white hover:bg-indigo-900/30 hover:border-indigo-400/50 transition-all"
            onClick={() => handleChoice(choice)}
            onMouseEnter={() => handleChoiceHover(choice.id)}
          >
            {choice.text}
          </Button>
        </motion.div>
      ))}
    </div>
  )
}

