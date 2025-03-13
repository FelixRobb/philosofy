"use client"

import type { JSX } from "react"
import { useState, useEffect, useRef } from "react"
import {
  Clock,
  Lightbulb,
  Eye,
  Braces,
  Cog,
  Waves,
  Zap,
  Fingerprint,
  ArrowRight,
  RefreshCcw,
  Brain,
  ChevronRight,
  Link,
  Play,
  Info,
  BarChart3,
  Sparkles,
  Hourglass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"

// Personality traits that will be tracked
type Traits = {
  altruism: number
  riskTaking: number
  conformity: number
  emotionality: number
  rationality: number
}

// User's state of mind that affects choices
type MindState = {
  stress: number
  primed: string | null // Concept that user has been primed with
  recentChoices: string[]
}

// A single choice in a dilemma
type Choice = {
  id: string
  text: string
  traitEffects: Partial<Traits>
  followUp?: string // ID of a follow-up dilemma this choice leads to
  requiresTrait?: { trait: keyof Traits; min: number } // Only show if user has this trait level
  requiresPriming?: string // Only show if user has been primed with this concept
  hiddenInfluence?: string // Hidden factor that influenced this choice
  positionBias?: "first" | "middle" | "last" // Position bias that makes this choice more likely
}

// A dilemma presented to the user
type Dilemma = {
  id: string
  title: string
  scenario: string
  image: string
  choices: Choice[]
  reflection: string
  primingEffect?: string // Concept this dilemma primes the user with
  stressEffect?: number // How this dilemma affects stress level
  requiresStress?: { min: number; max: number } // Only show if stress is in this range
  timeLimit?: number // Optional time limit in seconds
  deterministicQuote?: string // Quote about determinism
  visualPriming?: string // Visual element that subtly primes a choice
}

// The initial traits - everyone starts somewhere
const initialTraits: Traits = {
  altruism: 5,
  riskTaking: 5,
  conformity: 5,
  emotionality: 5,
  rationality: 5,
}

// The initial mind state
const initialMindState: MindState = {
  stress: 3,
  primed: null,
  recentChoices: [],
}

// Deterministic quotes to display throughout the game
const deterministicQuotes = [
  "The assumption of an absolute determinism is the essential foundation of every scientific enquiry. — Max Planck",
  "Everything, including that which happens in our brains, depends on these and only on these: A set of fixed, deterministic laws. — Stephen Hawking",
  "We are no more than biological machines and that free will is just an illusion. — Francis Crick",
  "Free will is an illusion. Our wills are simply not of our own making. — Sam Harris",
  "Man can do what he wills but he cannot will what he wills. — Arthur Schopenhauer",
  "The universe is governed by science. But science tells us that we can't solve the equations, directly in the abstract. — Stephen Hawking",
  "The path a man takes in life is predetermined by his character. — Heraclitus",
  "Every decision you believe you make is actually the result of prior causes that you did not create. — Sam Harris",
  "The will is determined by a motive which is not self-chosen. — Baruch Spinoza",
  "We're all just complicated arrangements of atoms and subatomic particles. — Richard Dawkins",
]

// All possible dilemmas in the game
const allDilemmas: Dilemma[] = [
  {
    id: "start",
    title: "Morning Routine",
    scenario:
      "Your alarm goes off. It's earlier than usual, but you remember setting it to have extra time this morning. Your body feels heavy with sleep.",
    image: "clock",
    choices: [
      {
        id: "snooze",
        text: "Hit snooze and get more sleep",
        traitEffects: { conformity: -1, rationality: -1 },
        followUp: "late",
        positionBias: "first",
        hiddenInfluence: "Your circadian rhythm and sleep debt from previous nights predetermined this choice.",
      },
      {
        id: "getup",
        text: "Get up immediately",
        traitEffects: { conformity: 1, rationality: 1 },
        followUp: "breakfast",
        hiddenInfluence: "Your cortisol levels and habitual morning routine made this choice inevitable.",
      },
      {
        id: "compromise",
        text: "Set a 5-minute timer on your phone",
        traitEffects: { rationality: 0.5 },
        followUp: "breakfast",
        positionBias: "last",
        hiddenInfluence:
          "Your brain's tendency to seek compromise solutions was established by past experiences with similar conflicts.",
      },
    ],
    reflection:
      "Did you really choose, or did your sleep patterns, habits formed over years, and yesterday's fatigue level make this decision inevitable?",
    stressEffect: 1,
    primingEffect: "time",
    deterministicQuote: "Man can do what he wills but he cannot will what he wills. — Arthur Schopenhauer",
    visualPriming: "clock",
  },
  {
    id: "breakfast",
    title: "Breakfast Decision",
    scenario:
      "You have time for breakfast. In your kitchen, you see a healthy option that takes preparation and a quick, sugary option.",
    image: "food",
    choices: [
      {
        id: "healthy",
        text: "Prepare the healthy breakfast",
        traitEffects: { rationality: 1, conformity: -0.5 },
        followUp: "commute",
        hiddenInfluence:
          "Your health consciousness was shaped by media exposure and social pressures about body image.",
      },
      {
        id: "sugary",
        text: "Grab the quick, sugary option",
        traitEffects: { rationality: -1, riskTaking: 0.5 },
        followUp: "commute",
        positionBias: "middle",
        hiddenInfluence:
          "Your brain's reward pathways, established through childhood eating patterns, made this choice predictable.",
      },
      {
        id: "skip",
        text: "Skip breakfast entirely",
        traitEffects: { conformity: -1, riskTaking: 1 },
        followUp: "commute",
        requiresTrait: { trait: "rationality", min: 4 },
        hiddenInfluence:
          "Your metabolic rate and morning hunger signals, which you didn't choose, influenced this decision.",
      },
    ],
    reflection:
      "Your metabolism, childhood eating habits, and current health concerns all converged in this moment. Was this truly a choice or the inevitable result of your biological and psychological history?",
    stressEffect: 0,
    deterministicQuote: "We're all just complicated arrangements of atoms and subatomic particles. — Richard Dawkins",
    visualPriming: "food",
  },
  {
    id: "late",
    title: "Running Late",
    scenario: "You've overslept and now you're running late. You need to leave immediately to make your appointment.",
    image: "rush",
    choices: [
      {
        id: "rush",
        text: "Rush out without breakfast",
        traitEffects: { riskTaking: 1, rationality: -0.5 },
        followUp: "commute",
        positionBias: "first",
        hiddenInfluence:
          "Your stress response system, shaped by genetics and past experiences with time pressure, dictated this reaction.",
      },
      {
        id: "call",
        text: "Call ahead to say you'll be late",
        traitEffects: { conformity: 1, rationality: 1 },
        followUp: "commute",
        hiddenInfluence: "Your social conditioning about politeness and responsibility made this choice predictable.",
      },
      {
        id: "reschedule",
        text: "Try to reschedule the appointment",
        traitEffects: { conformity: -1, emotionality: 1 },
        followUp: "free_time",
        requiresTrait: { trait: "riskTaking", min: 6 },
        hiddenInfluence:
          "Your conflict avoidance tendencies, developed through past social interactions, influenced this decision.",
      },
    ],
    reflection:
      "Your response to time pressure was shaped by past experiences with authority, punctuality values instilled in childhood, and your neurological stress response. These factors were set in motion long before today.",
    stressEffect: 2,
    primingEffect: "urgency",
    deterministicQuote:
      "Every decision you believe you make is actually the result of prior causes that you did not create. — Sam Harris",
    visualPriming: "rush",
  },
  {
    id: "commute",
    title: "The Commute",
    scenario: "On your commute, you see someone drop their wallet without noticing. No one else seems to have seen.",
    image: "wallet",
    choices: [
      {
        id: "return",
        text: "Call out and return the wallet",
        traitEffects: { altruism: 2, conformity: 1 },
        followUp: "work_arrival",
        hiddenInfluence:
          "Your moral framework was installed through childhood socialization and cultural narratives about honesty.",
      },
      {
        id: "ignore",
        text: "Ignore it and continue your commute",
        traitEffects: { altruism: -1, conformity: -1 },
        followUp: "work_arrival",
        positionBias: "middle",
        hiddenInfluence: "Your self-preservation instinct, a product of evolution, made this choice more likely.",
      },
      {
        id: "take",
        text: "Pick up the wallet and keep it",
        traitEffects: { altruism: -2, riskTaking: 2 },
        followUp: "wallet_guilt",
        requiresTrait: { trait: "altruism", min: 3 },
        hiddenInfluence:
          "Your economic background and experiences with scarcity influenced your perception of this opportunity.",
      },
    ],
    reflection:
      "Your moral framework, developed through years of social conditioning and personal experiences with honesty and theft, determined your response before you even saw the wallet fall.",
    stressEffect: 0,
    timeLimit: 15,
    deterministicQuote: "The path a man takes in life is predetermined by his character. — Heraclitus",
    visualPriming: "wallet",
  },
  {
    id: "wallet_guilt",
    title: "Unexpected Contents",
    scenario:
      "Inside the wallet, you find $300 cash, credit cards, and a photo of children. You also notice a business card indicating the owner works at the same place you're heading.",
    image: "guilt",
    choices: [
      {
        id: "return_now",
        text: "Find the owner and return it immediately",
        traitEffects: { altruism: 1, emotionality: 1, rationality: 1 },
        followUp: "work_arrival",
        hiddenInfluence:
          "Your empathy response, triggered by the photo of children, was a neurological reaction you didn't consciously control.",
      },
      {
        id: "anonymous",
        text: "Leave it anonymously at reception",
        traitEffects: { altruism: 0.5, conformity: 1 },
        followUp: "work_arrival",
        positionBias: "middle",
        hiddenInfluence: "Your desire to avoid confrontation while easing guilt was shaped by past social experiences.",
      },
      {
        id: "keep_anyway",
        text: "Keep it anyway",
        traitEffects: { altruism: -2, emotionality: -1, riskTaking: 1 },
        followUp: "work_arrival",
        requiresTrait: { trait: "emotionality", min: 3 },
        hiddenInfluence:
          "Your ability to rationalize actions was developed through past experiences with moral compromise.",
      },
    ],
    reflection:
      "The guilt you felt was a product of your neurochemistry and moral conditioning. Your response to that guilt was predetermined by your psychological makeup and past experiences with similar emotions.",
    stressEffect: 1,
    deterministicQuote: "The will is determined by a motive which is not self-chosen. — Baruch Spinoza",
    visualPriming: "guilt",
  },
  {
    id: "work_arrival",
    title: "Office Politics",
    scenario:
      "At work, you discover a colleague has taken credit for your idea in an email to management. The project meeting is about to start.",
    image: "office",
    choices: [
      {
        id: "confront",
        text: "Confront your colleague before the meeting",
        traitEffects: { conformity: -1, emotionality: 1 },
        followUp: "meeting",
        hiddenInfluence: "Your conflict management style was shaped by family dynamics and past workplace experiences.",
      },
      {
        id: "meeting_correction",
        text: "Politely correct the record during the meeting",
        traitEffects: { rationality: 1, conformity: -0.5 },
        followUp: "meeting",
        positionBias: "middle",
        hiddenInfluence:
          "Your approach to professional assertiveness was conditioned by observed social models and past outcomes.",
      },
      {
        id: "let_go",
        text: "Let it go this time",
        traitEffects: { conformity: 1, emotionality: -1 },
        followUp: "meeting",
        requiresPriming: "urgency",
        hiddenInfluence:
          "Your tendency to avoid workplace conflict was established through past experiences with authority figures.",
      },
    ],
    reflection:
      "Your response to perceived injustice was shaped by your past experiences with conflict, your position in social hierarchies, and your neurological response to threat. These patterns were established long before this situation arose.",
    stressEffect: 2,
    deterministicQuote: "Free will is an illusion. Our wills are simply not of our own making. — Sam Harris",
    visualPriming: "office",
  },
  {
    id: "meeting",
    title: "Ethical Dilemma",
    scenario:
      "During the meeting, your team discusses cutting corners on safety to meet a deadline. The shortcut could potentially cause harm to users but would save the company money.",
    image: "meeting",
    choices: [
      {
        id: "speak_up",
        text: "Speak up against the shortcut",
        traitEffects: { altruism: 1, conformity: -1, rationality: 1 },
        followUp: "lunch",
        hiddenInfluence:
          "Your ethical framework was installed through education, cultural narratives, and observed role models.",
      },
      {
        id: "stay_silent",
        text: "Stay silent and go along with the team",
        traitEffects: { conformity: 2, altruism: -1 },
        followUp: "lunch",
        positionBias: "middle",
        hiddenInfluence: "Your tendency toward group conformity was shaped by evolutionary survival mechanisms.",
      },
      {
        id: "compromise_safety",
        text: "Suggest a compromise that improves but doesn't fully fix safety",
        traitEffects: { rationality: 0.5, conformity: 0.5 },
        followUp: "lunch",
        requiresTrait: { trait: "rationality", min: 6 },
        hiddenInfluence:
          "Your problem-solving approach was developed through educational experiences and professional training.",
      },
    ],
    reflection:
      "Your ethical framework, risk assessment capabilities, and tendency to conform to group pressure all predetermined your response. These aspects of your personality were formed through genetics, upbringing, and past experiences with authority.",
    stressEffect: 1,
    requiresStress: { min: 2, max: 10 },
    deterministicQuote:
      "The universe is governed by science. But science tells us that we can't solve the equations, directly in the abstract. — Stephen Hawking",
    visualPriming: "meeting",
  },
  {
    id: "lunch",
    title: "Lunch Break",
    scenario: "At lunch, a homeless person approaches asking for money. You notice they appear intoxicated.",
    image: "homeless",
    choices: [
      {
        id: "give_money",
        text: "Give them some money",
        traitEffects: { altruism: 1, emotionality: 1, rationality: -0.5 },
        followUp: "afternoon",
        hiddenInfluence:
          "Your empathetic response was shaped by your upbringing and exposure to narratives about charity.",
      },
      {
        id: "buy_food",
        text: "Offer to buy them food instead",
        traitEffects: { altruism: 1, rationality: 1 },
        followUp: "afternoon",
        positionBias: "middle",
        hiddenInfluence:
          "Your pragmatic approach to helping was conditioned by social discourse about addiction and responsibility.",
      },
      {
        id: "ignore_request",
        text: "Politely decline and walk away",
        traitEffects: { emotionality: -1, conformity: 0.5 },
        followUp: "afternoon",
        requiresTrait: { trait: "altruism", min: 4 },
        hiddenInfluence: "Your comfort with saying no was developed through past boundary-setting experiences.",
      },
    ],
    reflection:
      "Your response was determined by your past experiences with homelessness, your beliefs about addiction, your economic background, and your capacity for empathy—all factors beyond your conscious control.",
    stressEffect: 0,
    deterministicQuote:
      "Everything, including that which happens in our brains, depends on these and only on these: A set of fixed, deterministic laws. — Stephen Hawking",
    visualPriming: "homeless",
  },
  {
    id: "afternoon",
    title: "Afternoon Crisis",
    scenario:
      "You discover a major error in a project that's about to be delivered. Fixing it will take hours of overtime, but not fixing it could have serious consequences later.",
    image: "crisis",
    choices: [
      {
        id: "fix_now",
        text: "Stay late and fix the error",
        traitEffects: { rationality: 1, conformity: -0.5 },
        followUp: "evening",
        hiddenInfluence:
          "Your work ethic was installed through parental modeling and early experiences with responsibility.",
      },
      {
        id: "temporary_fix",
        text: "Implement a quick temporary fix",
        traitEffects: { rationality: -0.5, riskTaking: 1 },
        followUp: "evening",
        positionBias: "middle",
        hiddenInfluence:
          "Your approach to problem-solving under pressure was shaped by past experiences with deadlines.",
      },
      {
        id: "report_only",
        text: "Report the error but say you can't stay late",
        traitEffects: { conformity: -1, emotionality: 0.5 },
        followUp: "free_time",
        requiresTrait: { trait: "conformity", min: 3 },
        hiddenInfluence:
          "Your boundary-setting in professional contexts was influenced by past experiences with work-life balance.",
      },
    ],
    reflection:
      "Your work ethic, risk assessment, and response to pressure were all predetermined by your personality traits, past experiences with similar situations, and the neural pathways formed throughout your life.",
    stressEffect: 2,
    timeLimit: 20,
    deterministicQuote:
      "The assumption of an absolute determinism is the essential foundation of every scientific enquiry. — Max Planck",
    visualPriming: "crisis",
  },
  {
    id: "evening",
    title: "Evening Plans",
    scenario:
      "You've been invited to two events tonight: a networking event that could help your career, and a close friend's birthday gathering.",
    image: "calendar",
    choices: [
      {
        id: "networking",
        text: "Attend the networking event",
        traitEffects: { rationality: 1, emotionality: -1 },
        followUp: "end",
        hiddenInfluence:
          "Your career prioritization was shaped by cultural values about success and observed social models.",
      },
      {
        id: "birthday",
        text: "Go to your friend's birthday",
        traitEffects: { emotionality: 1, conformity: 0.5 },
        followUp: "end",
        positionBias: "middle",
        hiddenInfluence:
          "Your social bonds and fear of disappointing others were established through attachment patterns in childhood.",
      },
      {
        id: "both",
        text: "Try to attend both briefly",
        traitEffects: { riskTaking: 1, rationality: -0.5 },
        followUp: "end",
        requiresTrait: { trait: "riskTaking", min: 6 },
        hiddenInfluence:
          "Your tendency to avoid making hard choices was developed through past experiences with FOMO (fear of missing out).",
      },
    ],
    reflection:
      "Your choice between professional advancement and personal relationships was determined by your values hierarchy, which was formed through your upbringing, cultural influences, and past experiences with both career and friendship.",
    stressEffect: -1,
    deterministicQuote:
      "We are no more than biological machines and that free will is just an illusion. — Francis Crick",
    visualPriming: "calendar",
  },
  {
    id: "free_time",
    title: "Unexpected Free Time",
    scenario:
      "You suddenly have free time in your day. Your phone shows several notifications from social media, and you also notice an unread book you've been meaning to start.",
    image: "freetime",
    choices: [
      {
        id: "social_media",
        text: "Check social media",
        traitEffects: { conformity: 1, rationality: -1 },
        followUp: "end",
        hiddenInfluence:
          "Your dopamine response to notifications was conditioned by tech design and past reward patterns.",
      },
      {
        id: "read",
        text: "Read the book",
        traitEffects: { conformity: -1, rationality: 1 },
        followUp: "end",
        positionBias: "middle",
        hiddenInfluence:
          "Your attention span and reading habits were shaped by educational experiences and media consumption patterns.",
      },
      {
        id: "productive",
        text: "Use the time to get ahead on work",
        traitEffects: { rationality: 0.5, emotionality: -0.5 },
        followUp: "end",
        requiresTrait: { trait: "rationality", min: 7 },
        hiddenInfluence:
          "Your productivity orientation was installed through observed work ethics and past reinforcement of achievement.",
      },
    ],
    reflection:
      "Your response to unstructured time was predetermined by your dopamine sensitivity, attention patterns, and habits formed through years of technology use and leisure time allocation.",
    stressEffect: -2,
    deterministicQuote:
      "The assumption of an absolute determinism is the essential foundation of every scientific enquiry. — Max Planck",
    visualPriming: "freetime",
  },
]

// Images for the dilemmas
type DilemmaImageKey =
  | "clock"
  | "food"
  | "rush"
  | "wallet"
  | "guilt"
  | "office"
  | "meeting"
  | "homeless"
  | "crisis"
  | "calendar"
  | "freetime"

const dilemmaImages: Record<DilemmaImageKey, JSX.Element> = {
  clock: <Clock className="h-16 w-16 text-indigo-400" />,
  food: <div className="h-16 w-16 flex items-center justify-center text-3xl">🍳</div>,
  rush: <div className="h-16 w-16 flex items-center justify-center text-3xl">⏱️</div>,
  wallet: <div className="h-16 w-16 flex items-center justify-center text-3xl">👛</div>,
  guilt: <div className="h-16 w-16 flex items-center justify-center text-3xl">😟</div>,
  office: <div className="h-16 w-16 flex items-center justify-center text-3xl">💼</div>,
  meeting: <div className="h-16 w-16 flex items-center justify-center text-3xl">👥</div>,
  homeless: <div className="h-16 w-16 flex items-center justify-center text-3xl">🏠</div>,
  crisis: <div className="h-16 w-16 flex items-center justify-center text-3xl">⚠️</div>,
  calendar: <div className="h-16 w-16 flex items-center justify-center text-3xl">📅</div>,
  freetime: <div className="h-16 w-16 flex items-center justify-center text-3xl">⏳</div>,
}

// Trait descriptions for the final analysis
const traitDescriptions = {
  altruism: {
    high: "Your tendency toward altruism was predetermined by empathy circuits in your brain, positive experiences with giving in your past, and social reinforcement of helping behaviors.",
    low: "Your self-protective tendencies were shaped by past experiences where generosity wasn't rewarded, pragmatic influences in your upbringing, and neurological reward pathways that prioritize self-preservation.",
  },
  riskTaking: {
    high: "Your comfort with risk was determined by your dopamine receptor sensitivity, past experiences where risk-taking was rewarded, and cultural influences that celebrate boldness.",
    low: "Your caution was shaped by your amygdala's sensitivity to threat, past experiences with negative consequences, and social conditioning that reinforced safety-seeking behaviors.",
  },
  conformity: {
    high: "Your tendency to conform was predetermined by your brain's sensitivity to social rejection, past experiences where fitting in was rewarded, and cultural influences that value harmony.",
    low: "Your independent streak was shaped by positive reinforcement of unique thinking in your past, neurological reward patterns that favor novelty, and cultural influences that celebrate individuality.",
  },
  emotionality: {
    high: "Your emotional responsiveness was determined by your limbic system's sensitivity, early attachment patterns, and experiences that reinforced emotional expression.",
    low: "Your emotional restraint was shaped by your prefrontal cortex development, experiences that rewarded stoicism, and social conditioning that valued rational over emotional responses.",
  },
  rationality: {
    high: "Your analytical approach was predetermined by your brain's executive function development, educational experiences that rewarded logical thinking, and social reinforcement of reasoned decision-making.",
    low: "Your intuitive approach was shaped by your brain's pattern-recognition systems, experiences where quick decisions were necessary, and environments that valued instinctual over analytical responses.",
  },
}

// Trait colors for visualization
const traitColors = {
  altruism: "bg-emerald-500",
  riskTaking: "bg-red-500",
  conformity: "bg-blue-500",
  emotionality: "bg-purple-500",
  rationality: "bg-amber-500",
}

// Hidden influences that affected the user's choices
const hiddenInfluences = [
  {
    name: "Position Bias",
    description:
      "Research shows people tend to select options in the middle of a list more often, or the first option when under time pressure.",
    icon: <Braces className="h-5 w-5" />,
  },
  {
    name: "Visual Priming",
    description: "The images and icons subtly influenced your choices by activating associated concepts in your brain.",
    icon: <Eye className="h-5 w-5" />,
  },
  {
    name: "Time Pressure",
    description:
      "When time was limited, your brain defaulted to faster, more instinctual decision pathways rather than deliberative ones.",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    name: "Conceptual Priming",
    description: "Earlier scenarios primed certain concepts, making related choices in later scenarios more likely.",
    icon: <Lightbulb className="h-5 w-5" />,
  },
  {
    name: "Trait Feedback Loop",
    description: "Each choice reinforced certain traits, making similar choices more likely in future scenarios.",
    icon: <Cog className="h-5 w-5" />,
  },
  {
    name: "Stress Influence",
    description: "Your stress level affected which brain regions dominated your decision-making process.",
    icon: <Waves className="h-5 w-5" />,
  },
  {
    name: "Philosophical Framing",
    description: "The deterministic quotes subtly reinforced the idea that your choices were predetermined.",
    icon: <Zap className="h-5 w-5" />,
  },
]

export function DeterminismGame() {
  // Game state
  const [gameState, setGameState] = useState<"welcome" | "playing" | "complete">("welcome")
  const [traits, setTraits] = useState<Traits>(initialTraits)
  const [mindState, setMindState] = useState<MindState>(initialMindState)
  const [completedDilemmas, setCompletedDilemmas] = useState<string[]>([])
  const [currentDilemmaId, setCurrentDilemmaId] = useState<string>("start")
  const [showReflection, setShowReflection] = useState(false)
  const [choiceHistory, setChoiceHistory] = useState<
    {
      dilemmaId: string
      choiceId: string
      choiceText: string
      hiddenInfluences: string[]
      positionBias?: string
    }[]
  >([])
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [decisionTimes, setDecisionTimes] = useState<Record<string, number>>({})
  const [startTime, setStartTime] = useState<number | null>(null)
  const [pathVisualizer, setPathVisualizer] = useState(false)
  const [mouseMovements, setMouseMovements] = useState<{ x: number; y: number; time: number }[]>([])
  const [hoveredChoices, setHoveredChoices] = useState<Record<string, number>>({})
  const [revealedInfluences, setRevealedInfluences] = useState(false)
  const [showDeterministicQuote, setShowDeterministicQuote] = useState(true)
  const [welcomeStep, setWelcomeStep] = useState(0)

  // Refs for tracking mouse movement
  const containerRef = useRef<HTMLDivElement>(null)

  // Get the current dilemma
  const currentDilemma = allDilemmas.find((d) => d.id === currentDilemmaId)

  // Calculate progress
  const progress = Math.min((completedDilemmas.length / 8) * 100, 100)

  // Track mouse movements
  useEffect(() => {
    if (gameState !== "playing" || !containerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMouseMovements((prev) => [...prev, { x, y, time: Date.now() }])
      }
    }

    containerRef.current.addEventListener("mousemove", handleMouseMove)

    return () => {
      containerRef.current?.removeEventListener("mousemove", handleMouseMove)
    }
  }, [currentDilemmaId, gameState])

  // Track choice hovering
  const handleChoiceHover = (choiceId: string) => {
    setHoveredChoices((prev) => ({
      ...prev,
      [choiceId]: (prev[choiceId] || 0) + 1,
    }))
  }

  // Set up timer for time-limited dilemmas
  useEffect(() => {
    if (gameState !== "playing" || !currentDilemma || showReflection) return

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
  }, [currentDilemmaId, showReflection, gameState])

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

    // Check if we've completed 8 dilemmas
    if (newCompletedDilemmas.length >= 8) {
      setGameState("complete")
      return
    }

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
    setPathVisualizer(false)
    setMouseMovements([])
    setHoveredChoices({})
    setRevealedInfluences(false)
    setShowDeterministicQuote(true)
    setGameState("welcome")
    setWelcomeStep(0)
  }

  // Generate analysis of user's traits
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

  // Find patterns in decision making
  const findDecisionPatterns = () => {
    const patterns = []

    // Check for fast decisions
    const fastDecisions = Object.entries(decisionTimes).filter(([_, time]) => time < 5).length
    if (fastDecisions > completedDilemmas.length / 2) {
      patterns.push(
        "You consistently made quick decisions, revealing a predetermined tendency to trust your initial impulses—a trait shaped by your neurological reward system and past experiences where quick thinking was beneficial.",
      )
    }

    // Check for slow, deliberate decisions
    const slowDecisions = Object.entries(decisionTimes).filter(([_, time]) => time > 10).length
    if (slowDecisions > completedDilemmas.length / 2) {
      patterns.push(
        "Your tendency to carefully deliberate before deciding reveals neural pathways shaped by past experiences where careful consideration was rewarded and impulsivity led to negative outcomes.",
      )
    }

    // Check for consistency in similar situations
    if (traits.conformity > 7) {
      patterns.push(
        "You consistently chose options that aligned with social norms, revealing how your brain has been conditioned to prioritize social acceptance—a pattern established through evolutionary pressures and reinforced by your personal history.",
      )
    }

    if (traits.riskTaking > 7) {
      patterns.push(
        "Your consistent preference for risky options reveals a dopamine sensitivity pattern in your brain that was established through genetics and reinforced by past experiences where risk-taking was rewarded.",
      )
    }

    // Check for middle position bias
    const middleChoices = choiceHistory.filter((choice) => choice.positionBias === "middle").length
    if (middleChoices > completedDilemmas.length / 3) {
      patterns.push(
        "You frequently selected options positioned in the middle, demonstrating the 'center-stage effect'—a cognitive bias where centrally positioned items receive more attention and are perceived as more important.",
      )
    }

    // Check for first position bias under time pressure
    const firstChoicesUnderPressure = choiceHistory.filter((choice, index) => {
      const dilemma = allDilemmas.find((d) => d.id === choice.dilemmaId)
      return choice.positionBias === "first" && dilemma?.timeLimit !== undefined
    }).length

    if (firstChoicesUnderPressure > 1) {
      patterns.push(
        "When under time pressure, you tended to select the first option presented—a well-documented cognitive bias where time constraints activate primitive decision-making pathways that favor initial options.",
      )
    }

    // Add a default pattern if none were found
    if (patterns.length === 0) {
      patterns.push(
        "Your decision patterns reveal a complex interplay of predetermined factors—genetic predispositions, past experiences, and neurological development all converged to create the illusion of choice while actually determining your responses.",
      )
    }

    return patterns
  }

  // Render the path visualizer
  const renderPathVisualizer = () => {
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

  // Render welcome screen
  const renderWelcomeScreen = () => {
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
          <p className="text-xl mt-4 text-indigo-200">A journey through the illusion of free will</p>
        </div>

        <div className="max-w-2xl mx-auto p-6 bg-slate-800/50 rounded-lg border border-indigo-500/30 text-left">
          <p className="text-lg text-white/90 leading-relaxed">
            Welcome to an experience that will challenge your perception of choice and free will. As you navigate
            through a series of everyday scenarios, your decisions will reveal something profound about the nature of
            human consciousness.
          </p>
          <p className="text-lg text-white/90 mt-4 leading-relaxed">
            But are these truly <span className="text-indigo-300 font-semibold">your</span> decisions? Or are they the
            inevitable result of your genetics, past experiences, and the neural pathways formed throughout your life?
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
        <h2 className="text-3xl font-bold text-indigo-300">Radical Determinism</h2>

        <div className="max-w-2xl mx-auto p-6 bg-slate-800/50 rounded-lg border border-indigo-500/30 text-left">
          <p className="text-lg text-white/90 leading-relaxed">
            Radical determinism is the philosophical position that all events, including human cognition and behavior,
            are ultimately determined by previously existing causes rather than by free will.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
              <div className="flex items-center mb-2">
                <Brain className="h-5 w-5 mr-2 text-indigo-400" />
                <h3 className="font-semibold text-indigo-300">Your Brain</h3>
              </div>
              <p className="text-white/80">
                Your neural pathways, formed by genetics and experience, determine your decisions before you're even
                aware of them.
              </p>
            </div>

            <div className="p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
              <div className="flex items-center mb-2">
                <Cog className="h-5 w-5 mr-2 text-indigo-400" />
                <h3 className="font-semibold text-indigo-300">Causal Chain</h3>
              </div>
              <p className="text-white/80">
                Every choice you make is the result of a causal chain stretching back before your birth.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-900/30 rounded-lg border border-purple-500/20">
            <div className="flex items-center mb-2">
              <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
              <h3 className="font-semibold text-purple-300">The Experiment</h3>
            </div>
            <p className="text-white/80">
              In this experience, you'll navigate through 8 scenarios, making choices that feel free. At the end, we'll
              reveal the hidden influences that actually determined your decisions.
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
              You'll navigate through a day of choices. Some scenarios may have time limits, and not all options will be
              available in every situation.
            </p>
          </div>

          <div className="flex items-center mb-4">
            <Hourglass className="h-5 w-5 mr-2 text-indigo-400 flex-shrink-0" />
            <p className="text-white/90">
              Take your time with each decision (unless there's a time limit!). After each choice, you'll see a
              reflection on determinism.
            </p>
          </div>

          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-indigo-400 flex-shrink-0" />
            <p className="text-white/90">
              At the end, you'll receive an analysis of your traits and decision patterns, revealing the hidden
              influences that shaped your choices.
            </p>
          </div>

          <div className="mt-6 p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
            <p className="text-indigo-200 italic text-center">
              "{deterministicQuotes[Math.floor(Math.random() * deterministicQuotes.length)]}"
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
            onClick={() => setGameState("playing")}
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

  // Render game screen
  const renderGameScreen = () => {
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
                    {currentDilemma && dilemmaImages[currentDilemma.image as DilemmaImageKey]}
                  </div>
                  <p className="text-lg text-white/90">{currentDilemma?.scenario}</p>
                </div>

                {!showReflection ? (
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
                ) : (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
                      <p className="text-lg font-medium mb-2 text-indigo-300">Your choice:</p>
                      <p className="italic text-white/90">{choiceHistory[choiceHistory.length - 1]?.choiceText}</p>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                      <p className="italic text-white/90">{currentDilemma?.reflection}</p>
                    </div>

                    <div className="pt-2">
                      <h3 className="text-sm font-medium text-indigo-300 mb-2">Changes in your traits:</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(
                          choiceHistory[choiceHistory.length - 1]
                            ? currentDilemma?.choices.find(
                                (c) => c.id === choiceHistory[choiceHistory.length - 1].choiceId,
                              )?.traitEffects || {}
                            : {},
                        ).map(([trait, effect]) => (
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
                            <Badge
                              variant="outline"
                              className="text-xs flex items-center gap-1 border-indigo-500/50 text-indigo-300"
                            >
                              <Link className="h-3 w-3 text-indigo-400" />
                              Causal Chain
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-slate-800 border-indigo-500/30 text-white">
                          <p className="text-xs">
                            This choice was influenced by your traits, which were shaped by your previous choices, which
                            were influenced by your initial traits—creating a closed causal loop that only appeared to
                            involve free will.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                )}
              </CardContent>
              {showReflection && (
                <CardFooter className="border-t border-indigo-500/20 pt-6">
                  <Button
                    onClick={handleNext}
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

  // Render analysis screen
  const renderAnalysisScreen = () => {
    const traitAnalysis = generateTraitAnalysis()
    const patterns = findDecisionPatterns()

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
                      You've navigated through a series of seemingly unrelated scenarios, making what felt like free
                      choices along the way.
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
                      Each choice you made was influenced by your traits, which themselves were shaped by genetics,
                      upbringing, and past experiences—factors beyond your control.
                    </p>

                    <p className="text-white/90 leading-relaxed">
                      The timing of your decisions, the options that appealed to you, and even your emotional reactions
                      were all predetermined by neural pathways formed throughout your life.
                    </p>

                    <p className="font-semibold text-indigo-200 leading-relaxed">
                      The feeling of choice is powerful—you deliberated, weighed options, and selected what seemed best.
                      Yet each neural pathway that led to your decisions was shaped by prior causes stretching back
                      before your birth.
                    </p>

                    <p className="text-white/90 leading-relaxed">
                      This experiment demonstrates radical determinism: the philosophical position that all events,
                      including human cognition and action, are ultimately determined by previously existing causes
                      rather than by free will.
                    </p>

                    <div className="p-6 bg-purple-900/30 rounded-lg border border-purple-500/20">
                      <h4 className="font-medium mb-2 text-purple-300">The Deterministic Paradox</h4>
                      <p className="text-white/90">
                        Even your reaction to learning about determinism—whether you accept or reject it—is itself
                        determined by your brain's structure, past experiences with philosophical ideas, and emotional
                        responses to concepts that challenge your sense of agency.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="traits" className="mt-6">
                  <div className="space-y-8">
                    {traitAnalysis.map((analysis, index) => {
                      const traitColor = traitColors[analysis.trait as keyof typeof traitColors] || "bg-gray-500"
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
                        The changes in your traits throughout this experience were not random. Each trait shift was the
                        inevitable result of how your existing traits interacted with the scenarios presented. Your
                        brain's neuroplasticity—its ability to change—follows deterministic laws of cause and effect.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="path" className="mt-6">
                  <div>
                    <p className="text-white/90 mb-6 leading-relaxed">
                      Below is the path you took through the scenarios. Each choice inevitably led to the next
                      situation, creating a chain of causality that appears as free choice but was actually
                      predetermined.
                    </p>
                    {renderPathVisualizer()}
                    <p className="mt-6 text-indigo-300/70 leading-relaxed">
                      Notice how your decision times varied. Faster decisions often indicate stronger predetermined
                      tendencies, while slower ones suggest competing neural pathways of similar strength.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="influences" className="mt-6">
                  <div className="space-y-6">
                    <p className="text-white/90 leading-relaxed">
                      Throughout your journey, several hidden factors influenced your decisions without your awareness.
                      These influences represent the deterministic forces that shaped your choices:
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
                        Each choice was influenced by your traits, which were shaped by your previous choices, which
                        were influenced by your initial traits—creating a closed causal loop that only appeared to
                        involve free will.
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
                          <div className="text-white/80 mt-1">
                            Constrained by developed traits and accumulated influences
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

  // Main render
  if (gameState === "welcome") {
    return renderWelcomeScreen()
  } else if (gameState === "playing") {
    return renderGameScreen()
  } else {
    return renderAnalysisScreen()
  }
}

