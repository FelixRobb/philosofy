import type { Traits, ChoiceHistoryItem } from "@/lib/game-types"

export function findDecisionPatterns(
  traits: Traits,
  choiceHistory: ChoiceHistoryItem[],
  decisionTimes: Record<string, number>,
  completedDilemmas: string[],
) {
  const patterns = []

  // Check for fast decisions
  const fastDecisions = Object.entries(decisionTimes).filter(([, time]) => time < 5).length
  if (fastDecisions > completedDilemmas.length / 2) {
    patterns.push(
      "You consistently made quick decisions, revealing a predetermined tendency to trust your initial impulses—a trait shaped by your neurological reward system and past experiences where quick thinking was beneficial.",
    )
  }

  // Check for slow, deliberate decisions
  const slowDecisions = Object.entries(decisionTimes).filter(([, time]) => time > 10).length
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
  const firstChoicesUnderPressure = choiceHistory.filter((choice) => {
    return choice.positionBias === "first" && choice.hiddenInfluences.some((infl) => infl.includes("Time pressure"))
  }).length

  if (firstChoicesUnderPressure > 1) {
    patterns.push(
      "When under time pressure, you tended to select the first option presented—a well-documented cognitive bias where time constraints activate primitive decision-making pathways that favor initial options.",
    )
  }

  // Check for trait-based patterns
  if (traits.altruism > 7 && traits.emotionality > 6) {
    patterns.push(
      "Your decisions consistently favored helping others, especially when emotional elements were present. This pattern reveals how your empathy circuits are strongly connected to your emotional processing centers—a neural architecture you didn't choose.",
    )
  }

  if (traits.rationality > 7 && traits.emotionality < 4) {
    patterns.push(
      "You consistently prioritized logical outcomes over emotional considerations, revealing a brain structure that gives greater weight to prefrontal cortex activity than limbic system responses—a neurological configuration determined by genetics and development.",
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

