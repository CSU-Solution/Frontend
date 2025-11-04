"use client"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const COLORS = ["#0ea5e9", "#06b6d4", "#f87171"]

interface ChartsSectionProps {
  data: any
}

export default function ChartsSection({ data }: ChartsSectionProps) {
  const sentimentData = Object.entries(data?.sentiment_distribution || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value as number,
  }))

  const adoptionData = (data?.feedback || []).map((persona: any) => ({
    subject: persona.country,
    A: persona.feedback_summary?.adoption_score || 0,
    fullMark: 100,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Sentiment Distribution */}
      <motion.div variants={itemVariants} transition={{ delay: 0.3 }}>
        <Card className="p-6 bg-white border-blue-100">
          <h3 className="text-lg font-semibold text-foreground mb-4">Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Adoption Score Radar */}
      <motion.div variants={itemVariants} transition={{ delay: 0.4 }}>
        <Card className="p-6 bg-white border-blue-100">
          <h3 className="text-lg font-semibold text-foreground mb-4">Adoption Score by Country</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={adoptionData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Adoption Score" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>
    </div>
  )
}
