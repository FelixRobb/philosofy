import type { Dilemma } from "@/lib/game-types"
import { philosophicalContexts } from "@/lib/philosophical-content"

// All possible dilemmas in the game
export const allDilemmas: Dilemma[] = [
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
    philosophicalContext: philosophicalContexts.neuroscience,
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
    philosophicalContext: philosophicalContexts.causalChain,
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
    philosophicalContext: philosophicalContexts.hardDeterminism,
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
    philosophicalContext: philosophicalContexts.illusionOfChoice,
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
    philosophicalContext: philosophicalContexts.neuroscience,
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
    philosophicalContext: philosophicalContexts.compatibilism,
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
    philosophicalContext: philosophicalContexts.hardDeterminism,
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
    philosophicalContext: philosophicalContexts.causalChain,
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
    philosophicalContext: philosophicalContexts.illusionOfChoice,
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
    philosophicalContext: philosophicalContexts.compatibilism,
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
    philosophicalContext: philosophicalContexts.neuroscience,
    stressEffect: -2,
    deterministicQuote:
      "The assumption of an absolute determinism is the essential foundation of every scientific enquiry. — Max Planck",
    visualPriming: "freetime",
  },
]

