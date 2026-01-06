// API utility functions for backend endpoints

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface PersonaRequest {
  country: string;
  site_type?: string;
  shift_pattern?: string;
  stereotype_level?: number;
}

export interface PersonaResponse {
  status: string;
  persona: {
    personaId: string;
    name: string;
    age: number;
    origin_country: string;
    years_in_nl: number;
    role: string;
    site_type: string;
    contract_type: string;
    shift_pattern: string;
    language_nl_level: string;
    language_other: string[];
    digital_access: string;
    digital_literacy: string;
    communication_style: string;
    work_values: string[];
    motivations: string[];
    pain_points: string[];
    union_member: boolean;
    representative_quote: string;
  };
}

export interface FeedbackRequest {
  persona: PersonaResponse["persona"];
  policy_text: string;
}

export interface FeedbackResponse {
  readability_issues: string[];
  fairness_concerns: string[];
  practical_barriers: string[];
  training_needs: string[];
  translation_needs: string[];
  adoption_score_0_100: number;
  sentiment: "very_negative" | "negative" | "neutral" | "positive" | "very_positive";
  one_sentence_reaction: string;
  recommendations_for_hr: string[];
}

export interface SaveAllPersonasResponse {
  status: string;
  saved_personas: Array<{
    country: string;
    personaId: string;
  }>;
}

export interface AnalysisResult {
  persona: PersonaResponse["persona"];
  feedback: FeedbackResponse;
}

/**
 * Generate and save a single persona for a specific country
 */
export async function createPersona(
  country: string,
  siteType: string = "hospital",
  shiftPattern: string = "early",
  stereotypeLevel: number = 1
): Promise<PersonaResponse> {
  const res = await fetch(`${API_BASE_URL}/persona/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      country,
      site_type: siteType,
      shift_pattern: shiftPattern,
      stereotype_level: stereotypeLevel,
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return await res.json();
}

/**
 * Generate and save personas for ALL 6 countries at once
 */
export async function generateAllPersonas(): Promise<SaveAllPersonasResponse> {
  const res = await fetch(`${API_BASE_URL}/personas/save-all`);

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return await res.json();
}

/**
 * Generate feedback analysis for a persona on a specific policy
 */
export async function analyzeFeedback(
  persona: PersonaResponse["persona"],
  policyText: string
): Promise<FeedbackResponse> {
  const res = await fetch(`${API_BASE_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      persona: persona,
      policy_text: policyText,
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return await res.json();
}

/**
 * Complete workflow: Generate personas for selected countries and analyze feedback
 */
export async function analyzePolicyForCountries(
  policyText: string,
  countries: string[],
  siteType: string = "hospital",
  shiftPattern: string = "early",
  stereotypeLevel: number = 1
): Promise<AnalysisResult[]> {
  // Step 1: Generate personas for selected countries
  const personaPromises = countries.map((country) =>
    createPersona(country, siteType, shiftPattern, stereotypeLevel)
  );

  const personaResponses = await Promise.all(personaPromises);

  // Step 2: Generate feedback for each persona
  const feedbackPromises = personaResponses.map((response) =>
    analyzeFeedback(response.persona, policyText)
  );

  const feedbackResponses = await Promise.all(feedbackPromises);

  // Step 3: Combine results
  return personaResponses.map((personaResponse, index) => ({
    persona: personaResponse.persona,
    feedback: feedbackResponses[index],
  }));
}

