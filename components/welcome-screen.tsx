"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Cog, Sparkles, Info, Hourglass, BarChart3, Play } from "lucide-react"
import { deterministicQuotes } from "@/lib/philosophical-content"

interface WelcomeScreenProps {
  welcomeStep: number
  setWelcomeStep: (step: number) => void
  startGame: () => void
}

export function WelcomeScreen({ welcomeStep, setWelcomeStep, startGame }: WelcomeScreenProps) {
  const welcomeContent = [
    // Step 0: Main welcome
    <motion.div
      key="welcome-main"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center space-y-6"
    >
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 blur-3xl opacity-20"></div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          The Determinism Labyrinth
        </h1>
        <p className="text-xl mt-4 text-indigo-200">A philosophical journey through the illusion of free will</p>
      </div>

      <div className="max-w-2xl mx-auto p-6 bg-slate-800/50 rounded-lg border border-indigo-500/30 text-left">
        <p className="text-lg text-white/90 leading-relaxed">
          Welcome to an experience that will challenge your deepest intuitions about choice and free will. As you
          navigate through a series of interconnected scenarios, your decisions will reveal something profound about the
          nature of human consciousness and the philosophical concept of determinism.
        </p>
        <p className="text-lg text-white/90 mt-4 leading-relaxed">
          But are these truly <span className="text-indigo-300 font-semibold">your</span> decisions? Or are they the
          inevitable result of causal chains stretching back to the beginning of time—your genetics, past experiences,
          and the neural pathways formed throughout your life?
        </p>
      </div>

      <Button
        size="lg"
        onClick={() => setWelcomeStep(1)}
        className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
      >
        Begin the Journey
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>,

    // Step 1: Explanation
    <motion.div
      key="welcome-explanation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center space-y-6"
    >
      <h2 className="text-3xl font-bold text-indigo-300">The Philosophy of Determinism</h2>

      <div className="max-w-2xl mx-auto p-6 bg-slate-800/50 rounded-lg border border-indigo-500/30 text-left">
        <p className="text-lg text-white/90 leading-relaxed">
          Determinism is the philosophical position that every event, including human cognition and action, is causally
          determined by prior events and the laws of nature. In this view, free will is an illusion—a feeling we have
          when we don&apos;t perceive the causes of our thoughts and actions.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
            <div className="flex items-center mb-2">
              <Brain className="h-5 w-5 mr-2 text-indigo-400" />
              <h3 className="font-semibold text-indigo-300">Neuroscientific View</h3>
            </div>
            <p className="text-white/80">
              Neuroscience suggests that our decisions are made by brain processes before we&apos;re consciously aware of
              them. Your neural pathways, formed by genetics and experience, determine your decisions before you&apos;re even
              aware of making a choice.
            </p>
          </div>

          <div className="p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
            <div className="flex items-center mb-2">
              <Cog className="h-5 w-5 mr-2 text-indigo-400" />
              <h3 className="font-semibold text-indigo-300">Causal Necessity</h3>
            </div>
            <p className="text-white/80">
              As Spinoza argued, every choice you make is the result of a causal chain stretching back before your
              birth. Your will itself is determined by causes that you did not will.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-purple-900/30 rounded-lg border border-purple-500/20">
          <div className="flex items-center mb-2">
            <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
            <h3 className="font-semibold text-purple-300">The Experiment</h3>
          </div>
          <p className="text-white/80">
            In this experience, you&apos;ll navigate through interconnected scenarios, making choices that feel free. Your
            decisions will shape your path, creating the illusion of autonomy. At the end, we&apos;ll reveal the hidden
            causal web that actually determined your every choice.
          </p>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <Button
          variant="outline"
          onClick={() => setWelcomeStep(0)}
          className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/50"
        >
          Back
        </Button>
        <Button
          size="lg"
          onClick={() => setWelcomeStep(2)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>,

    // Step 2: Start the game
    <motion.div
      key="welcome-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center space-y-6"
    >
      <h2 className="text-3xl font-bold text-indigo-300">Ready to Begin</h2>

      <div className="max-w-2xl mx-auto p-6 bg-slate-800/50 rounded-lg border border-indigo-500/30 text-left">
        <div className="flex items-center mb-4">
          <Info className="h-5 w-5 mr-2 text-indigo-400 flex-shrink-0" />
          <p className="text-white/90">
            You&apos;ll navigate through a series of interconnected scenarios. Your choices will shape your path, but
            remember: the path itself is predetermined by factors beyond your control.
          </p>
        </div>

        <div className="flex items-center mb-4">
          <Hourglass className="h-5 w-5 mr-2 text-indigo-400 flex-shrink-0" />
          <p className="text-white/90">
            Some scenarios have time limits, reflecting how real-world time pressure affects decision-making processes.
            After each choice, you&apos;ll see a philosophical reflection on determinism.
          </p>
        </div>

        <div className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-indigo-400 flex-shrink-0" />
          <p className="text-white/90">
            At the end, you&apos;ll receive an analysis of your traits, decision patterns, and the causal web that shaped
            your journey, revealing the hidden deterministic forces behind your apparent choices.
          </p>
        </div>

        <div className="mt-6 p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
          <p className="text-indigo-200 italic text-center">
            &quot;{deterministicQuotes[Math.floor(Math.random() * deterministicQuotes.length)]}&quot;
          </p>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <Button
          variant="outline"
          onClick={() => setWelcomeStep(1)}
          className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/50"
        >
          Back
        </Button>
        <Button
          size="lg"
          onClick={startGame}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
        >
          <Play className="mr-2 h-5 w-5" />
          Start the Experience
        </Button>
      </div>
    </motion.div>,
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatePresence mode="wait">{welcomeContent[welcomeStep]}</AnimatePresence>
    </div>
  )
}

