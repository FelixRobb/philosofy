import type { JSX } from "react"
import { Braces, Eye, Clock, Lightbulb, Cog, Waves, Zap } from "lucide-react"

export interface HiddenInfluence {
  name: string
  description: string
  icon: JSX.Element
}

// Hidden influences that affected the user's choices
export const hiddenInfluences: HiddenInfluence[] = [
  {
    name: "Position Bias",
    description:
      "Research shows people tend to select options in the middle of a list more often, or the first option when under time pressure. This cognitive bias is hardwired into your brain's decision-making processes.",
    icon: <Braces className="h-5 w-5" />,
  },
  {
    name: "Visual Priming",
    description:
      "The images and icons subtly influenced your choices by activating associated concepts in your brain. This priming effect operates below conscious awareness, yet powerfully shapes your decisions.",
    icon: <Eye className="h-5 w-5" />,
  },
  {
    name: "Time Pressure",
    description:
      "When time was limited, your brain defaulted to faster, more instinctual decision pathways rather than deliberative ones. This shift from System 2 to System 1 thinking (as described by Kahneman) is automatic and beyond your control.",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    name: "Conceptual Priming",
    description:
      "Earlier scenarios primed certain concepts, making related choices in later scenarios more likely. This demonstrates how your past experiences inevitably shape your future decisions through neural pathway activation.",
    icon: <Lightbulb className="h-5 w-5" />,
  },
  {
    name: "Trait Feedback Loop",
    description:
      "Each choice reinforced certain traits, making similar choices more likely in future scenarios. This self-reinforcing causal loop creates the illusion of consistent character while actually demonstrating deterministic processes.",
    icon: <Cog className="h-5 w-5" />,
  },
  {
    name: "Stress Influence",
    description:
      "Your stress level affected which brain regions dominated your decision-making process. High stress shifts control from the prefrontal cortex to more primitive brain regions—a neurological process beyond your conscious control.",
    icon: <Waves className="h-5 w-5" />,
  },
  {
    name: "Philosophical Framing",
    description:
      "The deterministic quotes subtly reinforced the idea that your choices were predetermined. This framing effect demonstrates how external conceptual frameworks influence your perception of your own agency.",
    icon: <Zap className="h-5 w-5" />,
  },
]

