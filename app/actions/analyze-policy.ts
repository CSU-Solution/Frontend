"use server"

export async function analyzePolicy(payload: {
  policy_text: string
  countries: string[]
  site_type: string
  shift_pattern: string
}) {
  try {
    const response = await fetch("http://localhost:8000/analyze-policy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error analyzing policy:", error)
    throw error
  }
}
