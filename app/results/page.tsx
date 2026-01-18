"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { AnalysisResult } from "@/lib/api"

// Country flag mapping
const countryFlags: Record<string, string> = {
  Poland: "🇵🇱",
  Morocco: "🇲🇦",
  Netherlands: "🇳🇱",
  Brazil: "🇧🇷",
  Romania: "🇷🇴",
  Turkey: "🇹🇷",
}

export default function ResultsPage() {
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load results from sessionStorage
    const storedResults = sessionStorage.getItem("analysisResults")
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults) as AnalysisResult[]
        setResults(parsedResults)
        // Auto-select first country by default
        if (parsedResults.length > 0) {
          setSelectedCountries(new Set([parsedResults[0].persona.origin_country]))
        }
      } catch (error) {
        console.error("Error parsing stored results:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const toggleCountrySelection = (country: string) => {
    setSelectedCountries((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(country)) {
        newSet.delete(country)
      } else {
        newSet.add(country)
      }
      return newSet
    })
  }

  const handleViewDashboard = () => {
    if (selectedCountries.size === 0) {
      toast.error("Please select at least one country")
      return
    }

    // Store selected countries for dashboard
    const selectedResults = results.filter((result) =>
      selectedCountries.has(result.persona.origin_country)
    )
    sessionStorage.setItem("selectedResults", JSON.stringify(selectedResults))
    sessionStorage.setItem("selectedCountries", JSON.stringify(Array.from(selectedCountries)))
    router.push("/dashboard")
  }

  // Filter results based on search
  const filteredResults = results.filter((result) => {
    const country = result.persona.origin_country
    const matchesSearch = country.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

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

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="ml-16 min-h-screen flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">No results found</h2>
            <p className="text-muted-foreground mb-6">Please analyze a policy first.</p>
            <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary/90">
              Go to Create Policy
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
              <Input
                placeholder="Search country ..."
                className="pl-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 h-11 px-6"
              onClick={handleViewDashboard}
              disabled={selectedCountries.size === 0}
            >
              View dashboard ({selectedCountries.size})
            </Button>
          </div>

          {selectedCountries.size > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {Array.from(selectedCountries).map((country) => (
                <Badge key={country} variant="secondary" className="h-8 px-3 gap-2">
                  {country}
                  <button
                    onClick={() => toggleCountrySelection(country)}
                    className="hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="bg-card rounded-lg border border-border overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-[40px_80px_150px_1fr_120px_150px] gap-4 p-4 border-b border-border bg-muted/30">
                <div></div>
                <div className="text-sm font-medium text-muted-foreground">Country</div>
                <div className="text-sm font-medium text-muted-foreground">Adoption score</div>
                <div className="text-sm font-medium text-muted-foreground">Description</div>
                <div className="text-sm font-medium text-muted-foreground">Sentiment</div>
                <div className="text-sm font-medium text-muted-foreground">Recommendations</div>
              </div>

              {filteredResults.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No results match your search criteria.
                </div>
              ) : (
                filteredResults.map((result, index) => {
                  const country = result.persona.origin_country
                  const flag = countryFlags[country] || "🌍"
                  const adoptionScore = result.feedback.adoption_score_0_100
                  const description = result.feedback.one_sentence_reaction
                  const sentiment = result.feedback.sentiment
                  const recommendations = result.feedback.recommendations_for_hr.slice(0, 2).join(", ")
                  const uniqueKey = result.persona.personaId || `${country}-${index}`

                  return (
                    <div
                      key={uniqueKey}
                      className="grid grid-cols-[40px_80px_150px_1fr_120px_150px] gap-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center">
                        <Checkbox
                          checked={selectedCountries.has(country)}
                          onCheckedChange={() => toggleCountrySelection(country)}
                          className={
                            selectedCountries.has(country)
                              ? "border-primary data-[state=checked]:bg-primary"
                              : ""
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2 min-w-[140px]">
                        <span className="text-xl">{flag}</span>
                        <span className="text-sm whitespace-nowrap">{country}</span>
                      </div>
                      <div className="flex items-center gap-3 min-w-[160px]">
                        <span className="text-sm font-medium whitespace-nowrap">{adoptionScore}%</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-400 rounded-full"
                            style={{ width: `${adoptionScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground capitalize">{sentiment}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {recommendations}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {filteredResults.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
