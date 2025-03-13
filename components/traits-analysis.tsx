"use client"

import { Fingerprint } from "lucide-react"
import type { Traits } from "@/lib/game-types"
import { traitDescriptions, traitColors } from "@/lib/traits-data"

interface TraitsAnalysisProps {
  traits: Traits
}

export function TraitsAnalysis({ traits }: TraitsAnalysisProps) {
  const generateTraitAnalysis = () => {
    return Object.entries(traits).map(([trait, value]) => {
      const traitKey = trait as keyof Traits
      const description = value > 6 ? traitDescriptions[traitKey].high : traitDescriptions[traitKey].low

      return {
        trait: traitKey,
        value,
        description,
      }
    })
  }

  const traitAnalysis = generateTraitAnalysis()

  return (
    <div className="space-y-8">
      {traitAnalysis.map((analysis, index) => {
        const traitColor = traitColors[analysis.trait] || "bg-gray-500"
        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium capitalize text-lg text-indigo-200">{analysis.trait}</h3>
              <span className="text-indigo-300">{analysis.value.toFixed(1)}/10</span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full ${traitColor}`} style={{ width: `${analysis.value * 10}%` }}></div>
            </div>
            <p className="text-white/80 mt-1">{analysis.description}</p>
          </div>
        )
      })}

      <div className="p-6 bg-indigo-900/30 rounded-lg border border-indigo-500/20 mt-6">
        <h4 className="font-medium mb-2 flex items-center text-indigo-300">
          <Fingerprint className="h-5 w-5 mr-2 text-indigo-400" />
          Trait Development Was Predetermined
        </h4>
        <p className="text-white/80">
          The changes in your traits throughout this experience were not random. Each trait shift was the inevitable
          result of how your existing traits interacted with the scenarios presented. Your brain's neuroplasticity—its
          ability to change—follows deterministic laws of cause and effect.
        </p>
      </div>
    </div>
  )
}

