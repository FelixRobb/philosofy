"use client"

import { Button } from "@/components/ui/button"
import { Clock, Fingerprint, Link, Eye } from "lucide-react"
import type { ChoiceHistoryItem } from "@/lib/game-types"
import { allDilemmas } from "@/lib/dilemmas"

interface PathVisualizerProps {
  choiceHistory: ChoiceHistoryItem[]
  decisionTimes: Record<string, number>
  revealedInfluences: boolean
  setRevealedInfluences: (revealed: boolean) => void
}

export function PathVisualizer({
  choiceHistory,
  decisionTimes,
  revealedInfluences,
  setRevealedInfluences,
}: PathVisualizerProps) {
  return (
    <div className="w-full mt-6 p-6 bg-slate-800/50 rounded-lg border border-indigo-500/30">
      <h3 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center">
        <Link className="h-5 w-5 mr-2 text-indigo-400" />
        Your Deterministic Path
      </h3>
      <div className="relative">
        {choiceHistory.map((choice, index) => (
          <div key={index} className="flex items-start mb-8 relative">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {index + 1}
            </div>
            {index < choiceHistory.length - 1 && (
              <div className="absolute left-5 top-10 w-0.5 h-14 bg-indigo-500/30"></div>
            )}
            <div className="ml-4 w-full">
              <div className="font-medium text-indigo-200 text-lg">
                {allDilemmas.find((d) => d.id === choice.dilemmaId)?.title}
              </div>
              <div className="text-white/80 mt-1">{choice.choiceText}</div>
              <div className="mt-2 text-sm text-indigo-300/70 flex items-center">
                <Clock className="h-3 w-3 mr-1 text-indigo-400" />
                Decision time: {decisionTimes[choice.dilemmaId]?.toFixed(1) || "?"} seconds
              </div>

              {revealedInfluences && choice.hiddenInfluences.length > 0 && (
                <div className="mt-3 p-3 bg-indigo-900/30 rounded border border-indigo-500/20 text-sm">
                  <div className="font-medium mb-2 flex items-center text-indigo-300">
                    <Fingerprint className="h-4 w-4 mr-1 text-indigo-400" />
                    Hidden Influences:
                  </div>
                  <ul className="space-y-1 pl-4 list-disc text-white/70">
                    {choice.hiddenInfluences.map((influence, i) => (
                      <li key={i}>{influence}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!revealedInfluences && (
        <Button
          variant="outline"
          size="lg"
          onClick={() => setRevealedInfluences(true)}
          className="mt-4 border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/50"
        >
          <Eye className="h-4 w-4 mr-2 text-indigo-400" />
          Reveal Hidden Influences
        </Button>
      )}
    </div>
  )
}

