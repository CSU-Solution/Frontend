"use client"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface OverviewCardsProps {
  data: any
}

export default function OverviewCards({ data }: OverviewCardsProps) {
  const averageAdoptionScore = data?.average_adoption_score || 0
  const totalPersonas = data?.total_personas || 0
  const sentimentDistribution = data?.sentiment_distribution || {}

  // Calculate total sentiment count
  const totalSentiments = Object.values(sentimentDistribution).reduce((sum: number, val: any) => sum + val, 0)

  // Find dominant sentiment
  const dominantSentiment =
    Object.entries(sentimentDistribution).sort(([, a]: any, [, b]: any) => b - a)[0]?.[0] || "Neutral"

  const overviewCards = [
    {
      label: "Average Adoption Score",
      value: `${Math.round(averageAdoptionScore)}%`,
      change: `${Math.round(averageAdoptionScore) >= 70 ? "+" : ""}${Math.round(averageAdoptionScore - 66)}%`,
      icon: "📈",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Personas Analyzed",
      value: totalPersonas.toString(),
      change: "Cultural perspectives",
      icon: "👥",
      color: "from-teal-500 to-teal-600",
    },
    {
      label: "Dominant Sentiment",
      value: dominantSentiment.charAt(0).toUpperCase() + dominantSentiment.slice(1),
      change: `${sentimentDistribution[dominantSentiment] || 0}/${totalSentiments} responses`,
      icon: dominantSentiment === "Positive" ? "😊" : dominantSentiment === "Negative" ? "😞" : "😐",
      color: "from-purple-500 to-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {overviewCards.map((card, index) => (
        <motion.div key={index} variants={itemVariants} transition={{ delay: index * 0.1 }}>
          <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-blue-100 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-accent mt-2">{card.change}</p>
              </div>
              <div className="text-3xl">{card.icon}</div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
