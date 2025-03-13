"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCcw, ChevronRight } from "lucide-react"
import { TraitsAnalysis } from "@/components/traits-analysis"
import { PathVisualizer } from "@/components/path-visualizer"
import { HiddenInfluences } from "@/components/hidden-influences"
import type { Traits, ChoiceHistoryItem } from "@/lib/game-types"
import { findDecisionPatterns } from "@/lib/analysis-utils"

interface AnalysisScreenProps {
  traits: Traits
  choiceHistory: ChoiceHistoryItem[]
  decisionTimes: Record<string, number>
  completedDilemmas: string[]
  revealedInfluences: boolean
  setRevealedInfluences: (revealed: boolean) => void
  resetGame: () => void
}

export function AnalysisScreen({
  traits,
  choiceHistory,
  decisionTimes,
  completedDilemmas,
  revealedInfluences,
  setRevealedInfluences,
  resetGame,
}: AnalysisScreenProps) {
  const patterns = findDecisionPatterns(traits, choiceHistory, decisionTimes, completedDilemmas)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="border-indigo-500/30 bg-slate-800/90 text-white shadow-xl shadow-indigo-900/20">
          <CardHeader className="border-b border-indigo-500/20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 blur-xl opacity-20"></div>
              <CardTitle className="text-3xl text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                The Illusion of Choice
              </CardTitle>
              <CardDescription className="text-center text-indigo-300 mt-1">
                A revelation of your predetermined nature
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-700/50 p-1">
                <TabsTrigger
                  value="analysis"
                  className="data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-200 text-slate-300"
                >
                  Analysis
                </TabsTrigger>
                <TabsTrigger
                  value="traits"
                  className="data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-200 text-slate-300"
                >
                  Your Traits
                </TabsTrigger>
                <TabsTrigger
                  value="path"
                  className="data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-200 text-slate-300"
                >
                  Your Path
                </TabsTrigger>
                <TabsTrigger
                  value="influences"
                  className="data-[state=active]:bg-indigo-900/50 data-[state=active]:text-indigo-200 text-slate-300"
                >
                  Hidden Influences
                </TabsTrigger>
              </TabsList>

              <TabsContent value="analysis" className="mt-6 space-y-6">
                <div className="space-y-6">
                  <p className="text-lg text-white/90 leading-relaxed">
                    You&lsquo;ve navigated through a series of interconnected scenarios, making what felt like free choices
                    along the way. This experience was designed to illustrate a profound philosophical concept: the
                    illusion of free will.
                  </p>

                  <div className="p-6 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
                    <h3 className="font-semibold text-xl mb-4 text-indigo-300">Decision Patterns Revealed:</h3>
                    <ul className="space-y-4">
                      {patterns.map((pattern, i) => (
                        <li key={i} className="flex items-start">
                          <ChevronRight className="h-5 w-5 mr-2 text-indigo-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/90">{pattern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-white/90 leading-relaxed">
                    As Spinoza argued, each choice you made was influenced by your traits, which themselves were shaped
                    by genetics, upbringing, and past experiences—factors beyond your control. Your will itself was
                    determined by causes that you did not will.
                  </p>

                  <p className="text-white/90 leading-relaxed">
                    The timing of your decisions, the options that appealed to you, and even your emotional reactions
                    were all predetermined by neural pathways formed throughout your life and the causal chains that
                    preceded this moment.
                  </p>

                  <p className="font-semibold text-indigo-200 leading-relaxed">
                    The feeling of choice is powerful—you deliberated, weighed options, and selected what seemed best.
                    Yet each neural pathway that led to your decisions was shaped by prior causes stretching back before
                    your birth, creating what philosophers call &quot;causal necessity.&quot;
                  </p>

                  <p className="text-white/90 leading-relaxed">
                    As Schopenhauer put it: &quot;Man can do what he wills, but he cannot will what he wills.&quot; Your desires,
                    preferences, and even your sense of self are all products of causal processes beyond your control.
                  </p>

                  <div className="p-6 bg-purple-900/30 rounded-lg border border-purple-500/20">
                    <h4 className="font-medium mb-2 text-purple-300">The Deterministic Paradox</h4>
                    <p className="text-white/90">
                      Even your reaction to learning about determinism—whether you accept or reject it—is itself
                      determined by your brain&apos;s structure, past experiences with philosophical ideas, and emotional
                      responses to concepts that challenge your sense of agency. The very feeling of freedom is itself
                      determined.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="traits" className="mt-6">
                <TraitsAnalysis traits={traits} />
              </TabsContent>

              <TabsContent value="path" className="mt-6">
                <div>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    Below is the path you took through the scenarios. Each choice inevitably led to the next situation,
                    creating a chain of causality that appears as free choice but was actually predetermined by your
                    traits, past experiences, and the structure of your brain.
                  </p>
                  <PathVisualizer
                    choiceHistory={choiceHistory}
                    decisionTimes={decisionTimes}
                    revealedInfluences={revealedInfluences}
                    setRevealedInfluences={setRevealedInfluences}
                  />
                  <p className="mt-6 text-indigo-300/70 leading-relaxed">
                    Notice how your decision times varied. Faster decisions often indicate stronger predetermined
                    tendencies, while slower ones suggest competing neural pathways of similar strength—both determined
                    by your past.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="influences" className="mt-6">
                <HiddenInfluences />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t border-indigo-500/20 pt-6 flex flex-col sm:flex-row gap-4">
            <Button
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              <RefreshCcw className="mr-2 h-4 w-4" /> Experience Again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "https://plato.stanford.edu/entries/determinism-causal/")}
              className="w-full border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/50"
            >
              Learn More About Determinism
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

