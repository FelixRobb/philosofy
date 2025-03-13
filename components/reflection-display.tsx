"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Link } from "lucide-react"
import type { Dilemma, ChoiceHistoryItem } from "@/lib/game-types"

interface ReflectionDisplayProps {
  currentDilemma: Dilemma | undefined
  choiceHistory: ChoiceHistoryItem[]
}

export function ReflectionDisplay({ currentDilemma, choiceHistory }: ReflectionDisplayProps) {
  if (!currentDilemma) return null

  const lastChoice = choiceHistory[choiceHistory.length - 1]
  const choiceMade = currentDilemma.choices.find((c) => c.id === lastChoice?.choiceId)

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
        <p className="text-lg font-medium mb-2 text-indigo-300">Your choice:</p>
        <p className="italic text-white/90">{lastChoice?.choiceText}</p>
      </div>
      <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
        <p className="italic text-white/90">{currentDilemma.reflection}</p>
        <p className="mt-3 text-white/80 text-sm">{currentDilemma.philosophicalContext}</p>
      </div>

      <div className="pt-2">
        <h3 className="text-sm font-medium text-indigo-300 mb-2">Changes in your traits:</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(choiceMade?.traitEffects || {}).map(([trait, effect]) => (
            <div key={trait} className="flex items-center">
              <span className="capitalize mr-2 text-white/80">{trait}:</span>
              <span
                className={
                  effect > 0
                    ? "text-sm font-medium text-emerald-400"
                    : effect < 0
                      ? "text-sm font-medium text-red-400"
                      : "text-sm font-medium text-indigo-300"
                }
              >
                {effect > 0 ? `+${effect}` : effect}
              </span>
            </div>
          ))}
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="text-xs flex items-center gap-1 border-indigo-500/50 text-indigo-300">
                <Link className="h-3 w-3 text-indigo-400" />
                Causal Chain
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-slate-800 border-indigo-500/30 text-white">
            <p className="text-xs">
              This choice was influenced by your traits, which were shaped by your previous choices, which were
              influenced by your initial traits—creating a closed causal loop that only appeared to involve free will.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  )
}

