"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import OverviewCards from "./overview-cards"
import ChartsSection from "./charts-section"
import PersonaCards from "./persona-cards"

interface ResultsDashboardProps {
  data: any
  onReset: () => void
}

export default function ResultsDashboard({ data, onReset }: ResultsDashboardProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Analysis Results</h2>
          <p className="text-muted-foreground">Policy insights across cultural perspectives</p>
        </div>
        <Button
          onClick={onReset}
          variant="outline"
          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
        >
          ↺ Analyze Another Policy
        </Button>
      </div>

      {/* Overview Cards */}
      <OverviewCards data={data} />

      {/* Charts Section */}
      <ChartsSection data={data} />

      {/* Persona Cards */}
      <PersonaCards data={data} />
    </motion.div>
  )
}
