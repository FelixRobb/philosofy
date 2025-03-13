import type { Traits } from "@/lib/game-types"

// Trait descriptions for the final analysis
export const traitDescriptions: Record<keyof Traits, { high: string; low: string }> = {
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
export const traitColors: Record<keyof Traits, string> = {
  altruism: "bg-emerald-500",
  riskTaking: "bg-red-500",
  conformity: "bg-blue-500",
  emotionality: "bg-purple-500",
  rationality: "bg-amber-500",
}

