// Personality traits that will be tracked
export type Traits = {
  altruism: number
  riskTaking: number
  conformity: number
  emotionality: number
  rationality: number
}

// User's state of mind that affects choices
export type MindState = {
  stress: number
  primed: string | null // Concept that user has been primed with
  recentChoices: string[]
}

// A single choice in a dilemma
export type Choice = {
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
export type Dilemma = {
  id: string
  title: string
  scenario: string
  image: string
  choices: Choice[]
  reflection: string
  philosophicalContext?: string // Additional philosophical context for the reflection
  primingEffect?: string // Concept this dilemma primes the user with
  stressEffect?: number // How this dilemma affects stress level
  requiresStress?: { min: number; max: number } // Only show if stress is in this range
  timeLimit?: number // Optional time limit in seconds
  deterministicQuote?: string // Quote about determinism
  visualPriming?: string // Visual element that subtly primes a choice
}

// Record of a choice made by the user
export type ChoiceHistoryItem = {
  dilemmaId: string
  choiceId: string
  choiceText: string
  hiddenInfluences: string[]
  positionBias?: string
}

