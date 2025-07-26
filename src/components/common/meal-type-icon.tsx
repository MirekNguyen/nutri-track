import { Coffee, Utensils, Moon, Apple } from "lucide-react"

interface MealTypeIconProps {
  type: "breakfast" | "lunch" | "dinner" | "snack"
}

export function MealTypeIcon({ type }: MealTypeIconProps) {
  switch (type) {
    case "breakfast":
      return <Coffee className="h-4 w-4 text-blue-600" />
    case "lunch":
      return <Utensils className="h-4 w-4 text-purple-600" />
    case "dinner":
      return <Moon className="h-4 w-4 text-indigo-600" />
    case "snack":
      return <Apple className="h-4 w-4 text-orange-600" />
  }
}
