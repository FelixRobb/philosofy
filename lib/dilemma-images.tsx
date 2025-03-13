import type { JSX } from "react"
import { Clock } from "lucide-react"

export type DilemmaImageKey =
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

export const dilemmaImages: Record<DilemmaImageKey, JSX.Element> = {
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

