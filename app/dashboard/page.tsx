"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Info, Meh, BarChart3, Loader2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, PieChart, Pie } from "recharts"
import { useRouter } from "next/navigation"
import type { AnalysisResult } from "@/lib/api"

const countryFlags: Record<string, string> = {
  Poland: "🇵🇱",
  Morocco: "🇲🇦",
  Netherlands: "🇳🇱",
  Brazil: "🇧🇷",
  Romania: "🇷🇴",
  Turkey: "🇹🇷",
}

const COLORS = [
  "hsl(220, 70%, 75%)",
  "hsl(340, 70%, 80%)",
  "hsl(270, 70%, 80%)",
  "hsl(290, 70%, 75%)",
  "hsl(120, 60%, 75%)",
  "hsl(30, 80%, 75%)",
]

export default function DashboardPage() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [selectedResults, setSelectedResults] = useState<AnalysisResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load selected results from sessionStorage
    const storedResults = sessionStorage.getItem("selectedResults")
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults) as AnalysisResult[]
        setSelectedResults(parsedResults)
      } catch (error) {
        console.error("Error parsing stored results:", error)
      }
    }
    setIsLoading(false)
  }, [])

  // Calculate metrics from real data
  const barData = selectedResults.map((result, index) => ({
    name: result.persona.origin_country,
    value: result.feedback.adoption_score_0_100,
    color: COLORS[index % COLORS.length],
    result: result, // Store full result for hover details
  }))

  // Calculate sentiment distribution
  const sentimentCounts: Record<string, number> = {}
  selectedResults.forEach((result) => {
    const sentiment = result.feedback.sentiment
    sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1
  })

  const pieData = Object.entries(sentimentCounts).map(([name, value], index) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: COLORS[index % COLORS.length],
  }))

  // Calculate average adoption score
  const averageAdoptionScore =
    selectedResults.length > 0
      ? selectedResults.reduce((sum, result) => sum + result.feedback.adoption_score_0_100, 0) /
        selectedResults.length
      : 0

  // Find dominant sentiment
  const dominantSentiment =
    Object.entries(sentimentCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "neutral"
  const dominantSentimentCount = sentimentCounts[dominantSentiment] || 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="ml-16 min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  if (selectedResults.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="ml-16 min-h-screen flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">No countries selected</h2>
            <p className="text-muted-foreground mb-6">Please select countries from the results page.</p>
            <Button onClick={() => router.push("/results")} className="bg-primary hover:bg-primary/90">
              Go to Results
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-16 min-h-screen p-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search country ..." className="pl-10 h-11" />
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 h-11 px-6"
              onClick={() => router.push("/results")}
            >
              View results
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-4xl font-semibold mb-2">{Math.round(averageAdoptionScore)}%</div>
                    <div className="text-sm text-muted-foreground">Average adoption score</div>
                  </div>
                  <div className="mt-2">
                    <BarChart3 className="w-12 h-12 text-primary" strokeWidth={1.5} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-4xl font-semibold mb-2">{selectedResults.length}</div>
                    <div className="text-sm text-muted-foreground">Selected countries</div>
                  </div>
                  <div className="flex gap-1 mt-2 flex-wrap max-w-[120px]">
                    {selectedResults.map((result, index) => (
                      <div
                        key={result.persona.personaId}
                        className="w-8 h-6 rounded-sm flex items-center justify-center text-lg"
                        title={result.persona.origin_country}
                      >
                        {countryFlags[result.persona.origin_country] || "🌍"}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-4xl font-semibold mb-2 capitalize">{dominantSentiment}</div>
                    <div className="text-sm text-muted-foreground">
                      Dominant sentiment {dominantSentimentCount}/{selectedResults.length} responses
                    </div>
                  </div>
                  <div className="mt-2">
                    <Meh className="w-12 h-12 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">All Countries</CardTitle>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative h-[350px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={140}
                        dataKey="value"
                        label={({ name, cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                          const RADIAN = Math.PI / 180
                          const radius = outerRadius + 30
                          const x = cx + radius * Math.cos(-midAngle * RADIAN)
                          const y = cy + radius * Math.sin(-midAngle * RADIAN)

                          const circleRadius = outerRadius + 10
                          const circleX = cx + circleRadius * Math.cos(-midAngle * RADIAN)
                          const circleY = cy + circleRadius * Math.sin(-midAngle * RADIAN)

                          return (
                            <g>
                              <line
                                x1={cx + outerRadius * Math.cos(-midAngle * RADIAN)}
                                y1={cy + outerRadius * Math.sin(-midAngle * RADIAN)}
                                x2={x}
                                y2={y}
                                stroke="hsl(var(--muted-foreground))"
                                strokeWidth={1}
                              />
                              <circle
                                cx={circleX}
                                cy={circleY}
                                r={4}
                                fill={pieData[index].color}
                                stroke="white"
                                strokeWidth={2}
                              />
                              <text
                                x={x}
                                y={y}
                                textAnchor={x > cx ? "start" : "end"}
                                dominantBaseline="central"
                                className="text-sm fill-foreground"
                              >
                                {name}
                              </text>
                            </g>
                          )
                        }}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-5xl font-semibold">{selectedResults.length}</div>
                      <div className="text-sm text-muted-foreground mt-1">Different countries</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Adoption Score</CardTitle>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        domain={[0, 100]}
                        ticks={[0, 20, 40, 60, 80, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Bar
                        dataKey="value"
                        radius={[8, 8, 0, 0]}
                        onMouseEnter={(data, index) => setHoveredBar(index)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} style={{ cursor: "pointer" }} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>

              {hoveredBar !== null && barData[hoveredBar] && (
                <Card className="absolute inset-x-4 bottom-4 w-auto shadow-xl z-10 border-2 pointer-events-none bg-background/95">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {countryFlags[barData[hoveredBar].name] || "🌍"}
                        </span>
                        <CardTitle className="text-lg">
                          {barData[hoveredBar].name} ({barData[hoveredBar].value}%)
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Sentiment:</span>
                      <span className="text-sm font-medium capitalize">
                        {barData[hoveredBar].result.feedback.sentiment}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground italic">
                      "{barData[hoveredBar].result.feedback.one_sentence_reaction}"
                    </p>

                    {barData[hoveredBar].result.feedback.recommendations_for_hr.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Top recommendations</h3>
                        <ul className="space-y-2 text-sm">
                          {barData[hoveredBar].result.feedback.recommendations_for_hr
                            .slice(0, 3)
                            .map((rec, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-muted-foreground mt-1">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {barData[hoveredBar].result.persona.motivations.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Motivations</h3>
                        <ul className="space-y-2 text-sm">
                          {barData[hoveredBar].result.persona.motivations.slice(0, 3).map((mot, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-muted-foreground mt-1">•</span>
                              <span>{mot}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {barData[hoveredBar].result.feedback.practical_barriers.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Practical barriers</h3>
                        <ul className="space-y-2 text-sm">
                          {barData[hoveredBar].result.feedback.practical_barriers.slice(0, 2).map((barrier, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-muted-foreground mt-1">•</span>
                              <span>{barrier}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
