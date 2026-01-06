"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Plus, Loader2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { analyzePolicyForCountries } from "@/lib/api"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

const AVAILABLE_COUNTRIES = ["Poland", "Morocco", "Netherlands", "Brazil", "Romania", "Turkey"]

export default function CreatePolicyPage() {
  const [policyText, setPolicyText] = useState("")
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [siteType, setSiteType] = useState<string>("hospital")
  const [shiftPattern, setShiftPattern] = useState<string>("early")
  const [intensity, setIntensity] = useState([50]) // 0-100, will convert to 0-2
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    )
  }

  const handleAnalyze = async () => {
    // Validation
    if (!policyText.trim()) {
      toast.error("Please enter a policy text")
      return
    }

    if (selectedCountries.length === 0) {
      toast.error("Please select at least one country")
      return
    }

    setIsLoading(true)

    try {
      // Convert intensity from 0-100 to 0-2
      const stereotypeLevel = Math.round((intensity[0] / 100) * 2)

      // Analyze policy for the selected countries
      const results = await analyzePolicyForCountries(
        policyText,
        selectedCountries,
        siteType,
        shiftPattern,
        stereotypeLevel
      )

      // Store results in sessionStorage to pass to results page
      sessionStorage.setItem("analysisResults", JSON.stringify(results))
      sessionStorage.setItem("policyText", policyText)

      toast.success("Analysis complete!")
      router.push("/results")
    } catch (error) {
      console.error("Error analyzing policy:", error)
      toast.error(
        error instanceof Error
          ? `Failed to analyze policy: ${error.message}`
          : "Failed to analyze policy. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-16 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-semibold mb-12 text-center">Create policy</h1>

          <div className="space-y-6">
            <div className="relative">
              <Textarea
                placeholder="Type in a HR Policy"
                className="min-h-[120px] text-base pr-12 resize-none"
                value={policyText}
                onChange={(e) => setPolicyText(e.target.value)}
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="absolute right-2 top-2 bg-primary hover:bg-primary/90"
                onClick={() => setPolicyText("")}
                disabled={isLoading}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-3">
              <label className="text-base font-medium">Select countries</label>
              <div className="border rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto">
                {AVAILABLE_COUNTRIES.map((country) => (
                  <div key={country} className="flex items-center space-x-3">
                    <Checkbox
                      id={country}
                      checked={selectedCountries.includes(country)}
                      onCheckedChange={() => toggleCountry(country)}
                      disabled={isLoading}
                    />
                    <label
                      htmlFor={country}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {country}
                    </label>
                  </div>
                ))}
              </div>
              {selectedCountries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedCountries.map((country) => (
                    <Badge key={country} variant="secondary" className="h-8 px-3 gap-2">
                      {country}
                      <button
                        onClick={() => toggleCountry(country)}
                        disabled={isLoading}
                        className="hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select value={siteType} onValueChange={setSiteType} disabled={isLoading}>
                <SelectTrigger className="h-14 text-base">
                  <SelectValue placeholder="Select site type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="elderly care">Elderly Care</SelectItem>
                </SelectContent>
              </Select>

              <Select value={shiftPattern} onValueChange={setShiftPattern} disabled={isLoading}>
                <SelectTrigger className="h-14 text-base">
                  <SelectValue placeholder="Select shift pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="early">Early</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-6">
              <div className="flex justify-between items-center">
                <label className="text-base font-medium">Stereotype intensity</label>
                <span className="text-primary font-semibold">{intensity[0]}%</span>
              </div>
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
              />
            </div>

            <div className="pt-8 flex justify-end">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 px-12 h-12 text-base"
                onClick={handleAnalyze}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Start analyzing"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
