"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface PersonaCardsProps {
  data: any
}

const COUNTRY_FLAGS: { [key: string]: string } = {
  Poland: "🇵🇱",
  Morocco: "🇲🇦",
  Netherlands: "🇳🇱",
  Brazil: "🇧🇷",
  Romania: "🇷🇴",
  Turkey: "🇹🇷",
}

export default function PersonaCards({ data }: PersonaCardsProps) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const personas = (data?.feedback || []).map((feedback: any) => ({
    name: feedback.persona_summary?.name || "Unknown",
    country: feedback.country,
    flag: COUNTRY_FLAGS[feedback.country] || "🌍",
    quote: feedback.persona_summary?.representative_quote || "",
    adoptionScore: feedback.feedback_summary?.adoption_score || 0,
    sentiment: feedback.feedback_summary?.sentiment || "neutral",
    recommendations: feedback.feedback_summary?.top_recommendations || [],
    barriers: feedback.full_feedback?.practical_barriers || [],
    motivations: feedback.full_persona?.motivations || [],
    trainingNeeds: feedback.full_feedback?.training_needs || [],
    translationNeeds: feedback.full_feedback?.translation_needs || [],
    fairnessConcerns: feedback.full_feedback?.fairness_concerns || false,
  }))

  return (
    <motion.div variants={itemVariants} transition={{ delay: 0.5 }}>
      <h3 className="text-2xl font-bold text-foreground mb-6">Cultural Perspectives</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {personas.map((persona, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="group"
            onHoverStart={() => setExpandedCard(index)}
            onHoverEnd={() => setExpandedCard(null)}
          >
            <Card className="p-5 h-full bg-gradient-to-br from-white to-blue-50 border-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="summary" className="text-xs">
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="text-xs">
                    Profile
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{persona.flag}</span>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{persona.name}</p>
                      <p className="text-xs text-muted-foreground">{persona.country}</p>
                    </div>
                  </div>

                  <p className="text-xs italic text-muted-foreground border-l-2 border-accent pl-3">
                    "{persona.quote}"
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Adoption Score:</span>
                      <span className="font-semibold text-accent">{persona.adoptionScore}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-teal-500 h-1.5 rounded-full"
                        style={{ width: `${persona.adoptionScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span>Sentiment:</span>
                      <span>
                        {persona.sentiment === "positive" ? "😊" : persona.sentiment === "negative" ? "😞" : "😐"}
                      </span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="profile" className="space-y-3">
                  <div className="text-xs space-y-3">
                    <div>
                      <p className="font-semibold text-foreground mb-1">Top Recommendations</p>
                      <ul className="space-y-1">
                        {persona.recommendations.slice(0, 2).map((rec: string, i: number) => (
                          <li key={i} className="text-muted-foreground">
                            • {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-foreground mb-1">Motivations</p>
                      <ul className="space-y-1">
                        {persona.motivations.slice(0, 2).map((mot: string, i: number) => (
                          <li key={i} className="text-muted-foreground">
                            • {mot}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
