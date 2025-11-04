"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PolicyInputCardProps {
  onAnalyze: (data: any) => void
}

const COUNTRIES = ["Poland", "Morocco", "Netherlands", "Brazil", "Romania", "Turkey"]
const SITE_TYPES = ["hospital", "elderly care", "office"]
const SHIFT_PATTERNS = ["early", "late", "night"]

export default function PolicyInputCard({ onAnalyze }: PolicyInputCardProps) {
  const [policy, setPolicy] = useState("")
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [siteType, setSiteType] = useState("")
  const [shiftPattern, setShiftPattern] = useState("")
  const [intensity, setIntensity] = useState(50)

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) => (prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]))
  }

  const handleAnalyze = () => {
    if (!policy.trim()) return
    onAnalyze({
      policy,
      countries: selectedCountries,
      siteType,
      shiftPattern,
      intensity,
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Card className="p-8 shadow-2xl hover:shadow-3xl transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-6">
          {/* Policy Text Area */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Paste your HR Policy here…</label>
            <textarea
              value={policy}
              onChange={(e) => setPolicy(e.target.value)}
              placeholder="Enter your HR policy text for analysis..."
              className="w-full h-32 p-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none bg-white text-foreground placeholder-muted-foreground"
            />
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl">📄</div>
              <p className="text-sm font-medium text-foreground">Drag and drop a file</p>
              <p className="text-xs text-muted-foreground">or click to select</p>
            </div>
          </div>

          {/* Country Selector */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Select Countries</label>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map((country) => (
                <button
                  key={country}
                  onClick={() => toggleCountry(country)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCountries.includes(country)
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-border"
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Site Type</label>
              <Select value={siteType} onValueChange={setSiteType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select site type" />
                </SelectTrigger>
                <SelectContent>
                  {SITE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Shift Pattern</label>
              <Select value={shiftPattern} onValueChange={setShiftPattern}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shift pattern" />
                </SelectTrigger>
                <SelectContent>
                  {SHIFT_PATTERNS.map((pattern) => (
                    <SelectItem key={pattern} value={pattern}>
                      {pattern}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stereotype Intensity Slider */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-foreground">Stereotype Intensity</label>
              <span className="text-sm font-medium text-accent">{intensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(Number.parseInt(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          {/* Analyze Button */}
          <div className="pt-4 space-y-3">
            <Button
              onClick={handleAnalyze}
              disabled={!policy.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔍 Analyze Policy
            </Button>
            <p className="text-xs text-center text-muted-foreground">Upload or paste an HR policy to start analysis.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
