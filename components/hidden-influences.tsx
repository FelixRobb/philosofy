"use client"

import { Link } from "lucide-react"
import { hiddenInfluences } from "@/lib/hidden-influences"

export function HiddenInfluences() {
  return (
    <div className="space-y-6">
      <p className="text-white/90 leading-relaxed">
        Throughout your journey, several hidden factors influenced your decisions without your awareness. These
        influences represent the deterministic forces that shaped your choices:
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {hiddenInfluences.map((influence, index) => (
          <div key={index} className="p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 rounded-full bg-indigo-900/80 border border-indigo-500/30 flex items-center justify-center mr-2 text-indigo-400">
                {influence.icon}
              </div>
              <h4 className="font-medium text-indigo-300">{influence.name}</h4>
            </div>
            <p className="text-white/80">{influence.description}</p>
          </div>
        ))}
      </div>

      <div className="p-6 bg-slate-700/50 rounded-lg mt-6">
        <h4 className="font-medium mb-4 flex items-center text-indigo-300">
          <Link className="h-5 w-5 mr-2 text-indigo-400" />
          Causal Chain
        </h4>
        <p className="text-white/90 mb-4">
          Each choice was influenced by your traits, which were shaped by your previous choices, which were influenced
          by your initial traits—creating a closed causal loop that only appeared to involve free will.
        </p>

        <div className="relative py-4">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-500/30"></div>

          <div className="ml-10 mb-6 relative">
            <div className="absolute left-[-1.75rem] top-1 w-3.5 h-3.5 rounded-full bg-indigo-600"></div>
            <div className="font-medium text-indigo-300">Initial Traits</div>
            <div className="text-white/80 mt-1">Shaped by genetics and past experiences</div>
          </div>

          <div className="ml-10 mb-6 relative">
            <div className="absolute left-[-1.75rem] top-1 w-3.5 h-3.5 rounded-full bg-indigo-600"></div>
            <div className="font-medium text-indigo-300">Early Choices</div>
            <div className="text-white/80 mt-1">Influenced by initial traits and priming</div>
          </div>

          <div className="ml-10 mb-6 relative">
            <div className="absolute left-[-1.75rem] top-1 w-3.5 h-3.5 rounded-full bg-indigo-600"></div>
            <div className="font-medium text-indigo-300">Trait Development</div>
            <div className="text-white/80 mt-1">Modified by your choices</div>
          </div>

          <div className="ml-10 relative">
            <div className="absolute left-[-1.75rem] top-1 w-3.5 h-3.5 rounded-full bg-indigo-600"></div>
            <div className="font-medium text-indigo-300">Later Choices</div>
            <div className="text-white/80 mt-1">Constrained by developed traits and accumulated influences</div>
          </div>
        </div>
      </div>
    </div>
  )
}

