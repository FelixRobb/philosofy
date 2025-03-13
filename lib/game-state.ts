import type { Traits, MindState } from "@/lib/game-types"

// The initial traits - everyone starts somewhere
export const initialTraits: Traits = {
  altruism: 5,
  riskTaking: 5,
  conformity: 5,
  emotionality: 5,
  rationality: 5,
}

// The initial mind state
export const initialMindState: MindState = {
  stress: 3,
  primed: null,
  recentChoices: [],
}

