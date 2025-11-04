"use client"

import { useState } from "react"
import Header from "@/components/header"
import PolicyInputCard from "@/components/policy-input-card"
import AnalysisAnimation from "@/components/analysis-animation"
import ResultsDashboard from "@/components/results-dashboard"

export default function Home() {
  const [state, setState] = useState<"input" | "analyzing" | "results">("input")
  const [analysisData, setAnalysisData] = useState(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (data: any) => {
    setState("analyzing")
    setError(null)

    try {
      const { analyzePolicy } = await import("@/app/actions/analyze-policy")
      const result = await analyzePolicy({
        policy_text: data.policy,
        countries: data.countries,
        site_type: data.siteType,
        shift_pattern: data.shiftPattern,
      })

      setAnalysisData(result)
      setState("results")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze policy")
      setState("input")
    }
  }

  const handleReset = () => {
    setState("input")
    setAnalysisData(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-background">
      <Header />

      {state === "input" && <PolicyInputCard onAnalyze={handleAnalyze} />}

      {state === "analyzing" && <AnalysisAnimation />}

      {state === "results" && <ResultsDashboard data={analysisData} onReset={handleReset} />}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg max-w-md">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </main>
  )
}
