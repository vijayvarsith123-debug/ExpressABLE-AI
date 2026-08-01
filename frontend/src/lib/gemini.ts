import { createServerFn } from "@tanstack/react-start";

const getApiKey = () => {
  return (
    (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) ||
    (typeof process !== "undefined" && process.env?.VITE_GEMINI_API_KEY) ||
    import.meta.env?.VITE_GEMINI_API_KEY ||
    ""
  );
};

export const isGeminiConfigured = () => {
  return !!getApiKey();
};

const getOllamaUrl = () => {
  return (
    (typeof process !== "undefined" && process.env?.VITE_OLLAMA_API_URL) ||
    import.meta.env?.VITE_OLLAMA_API_URL ||
    "http://localhost:11434"
  );
};

const getOllamaModel = () => {
  return (
    (typeof process !== "undefined" && process.env?.VITE_OLLAMA_MODEL) ||
    import.meta.env?.VITE_OLLAMA_MODEL ||
    "gemma2:2b"
  );
};

export const shouldUseOllama = () => {
  return (
    (typeof process !== "undefined" && process.env?.VITE_USE_LOCAL_OLLAMA === "true") ||
    import.meta.env?.VITE_USE_LOCAL_OLLAMA === "true"
  );
};

// -------------------------------------------------------------
// NVIDIA NIM CONFIGURATION
// -------------------------------------------------------------

const getNvidiaUrl = () => {
  return (
    (typeof process !== "undefined" && process.env?.VITE_NVIDIA_API_URL) ||
    import.meta.env?.VITE_NVIDIA_API_URL ||
    "https://integrate.api.nvidia.com/v1"
  );
};

const getNvidiaModel = () => {
  return (
    (typeof process !== "undefined" && process.env?.VITE_NVIDIA_MODEL) ||
    import.meta.env?.VITE_NVIDIA_MODEL ||
    "meta/llama-3.1-8b-instruct"
  );
};

const getNvidiaApiKey = () => {
  return (
    (typeof process !== "undefined" && process.env?.VITE_NVIDIA_API_KEY) ||
    import.meta.env?.VITE_NVIDIA_API_KEY ||
    ""
  );
};

export const shouldUseNvidiaNim = () => {
  return (
    (typeof process !== "undefined" && process.env?.VITE_USE_NVIDIA_NIM === "true") ||
    import.meta.env?.VITE_USE_NVIDIA_NIM === "true" ||
    !!getNvidiaApiKey()
  );
};

// -------------------------------------------------------------
// SECURE SERVER-SIDE FUNCTION (Runs on Serverless/Node to bypass CORS)
// -------------------------------------------------------------

const callModelServer = createServerFn({ method: "POST" })
  .validator((d: { prompt: string; jsonMode: boolean }) => d)
  .handler(async ({ data: { prompt, jsonMode } }) => {
    // 1. NVIDIA NIM (Local or Cloud API Catalog)
    if (shouldUseNvidiaNim()) {
      const nvidiaUrl = getNvidiaUrl();
      const modelName = getNvidiaModel();
      const apiKey = getNvidiaApiKey();

      try {
        const response = await fetch(`${nvidiaUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: apiKey ? `Bearer ${apiKey}` : "",
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.2,
            max_tokens: 1024,
            response_format: jsonMode ? { type: "json_object" } : undefined,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`NVIDIA NIM returned status ${response.status}: ${errText}`);
        }

        const resData = await response.json();
        return resData.choices?.[0]?.message?.content || "";
      } catch (e) {
        console.error("NVIDIA NIM server call failed:", e);
        throw e;
      }
    }

    // 2. Local Ollama Model
    if (shouldUseOllama()) {
      const ollamaUrl = getOllamaUrl();
      const modelName = getOllamaModel();

      try {
        const response = await fetch(`${ollamaUrl}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            stream: false,
            format: jsonMode ? "json" : undefined,
          }),
        });

        if (!response.ok) {
          throw new Error(`Ollama responded with status ${response.status}`);
        }

        const resData = await response.json();
        return resData.message?.content || "";
      } catch (e) {
        console.error("Ollama server call failed:", e);
        throw e;
      }
    }

    // 3. Google Gemini API
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("Gemini API key is not configured.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: jsonMode
          ? {
              responseMimeType: "application/json",
            }
          : undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const resData = await response.json();
    const text = resData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Empty response from Gemini API.");
    }

    return text;
  });

async function callModel(prompt: string, jsonMode = false): Promise<string> {
  return await callModelServer({ prompt, jsonMode });
}

// -------------------------------------------------------------
// LOCAL RULE-BASED ENGINES (100% Free, Private & Unlimited Fallback)
// -------------------------------------------------------------

function calculateWordOverlapScore(target: string, transcript: string): number {
  const clean = (str: string) =>
    str
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ");

  const targetWords = clean(target);
  const transcriptWords = clean(transcript);

  if (targetWords.length === 0) return 100;

  let matches = 0;
  const transcriptSet = new Set(transcriptWords);

  targetWords.forEach((word) => {
    if (transcriptSet.has(word)) {
      matches++;
    }
  });

  return Math.round((matches / targetWords.length) * 100);
}

// 1. Speech Coach Evaluation
interface SpeechEvaluationResult {
  pronunciation: number;
  fluency: number;
  grammar: number;
  notes: string[];
}

export async function evaluateSpeech(
  promptText: string,
  transcribedText: string,
  seconds: number,
): Promise<SpeechEvaluationResult> {
  if (isGeminiConfigured() || shouldUseOllama() || shouldUseNvidiaNim()) {
    try {
      const prompt = `
        You are an AI speech and communication coach.
        A student was asked to read this prompt aloud:
        "${promptText}"

        The browser's Speech-to-Text recorded their attempt as:
        "${transcribedText}"

        The attempt took ${seconds} seconds.

        Evaluate their attempt. Score their pronunciation (based on transcript matching), fluency (based on duration and phrasing), and grammar (out of 100).
        Provide 3 concise, highly actionable coaching notes/tips to improve.
        Return your response ONLY as a JSON object matching this schema:
        {
          "pronunciation": number,
          "fluency": number,
          "grammar": number,
          "notes": [string, string, string]
        }
      `;

      const responseText = await callModel(prompt, true);
      return JSON.parse(responseText.trim()) as SpeechEvaluationResult;
    } catch (e) {
      console.warn("Failed calling model, falling back to local speech evaluator:", e);
    }
  }

  // Local rule-based evaluation (Free & Unlimited fallback)
  const overlapScore = calculateWordOverlapScore(promptText, transcribedText);
  const wordCount = promptText.split(" ").length;
  const expectedSeconds = (wordCount / 130) * 60;
  const paceRatio = seconds > 0 ? expectedSeconds / seconds : 1;
  const fluencyScore = Math.max(50, Math.min(98, Math.round(90 - Math.abs(1 - paceRatio) * 40)));
  const grammarScore = Math.max(70, Math.min(98, overlapScore + 2));

  const notes: string[] = [];
  if (overlapScore > 85) {
    notes.push("Excellent pronunciation and articulation of the target words.");
  } else {
    notes.push("Try to enunciate clearly; some words were skipped or misrecognized.");
  }

  if (paceRatio > 1.3) {
    notes.push("You read quite quickly. Try to slow down slightly and pause at punctuation.");
  } else if (paceRatio < 0.7) {
    notes.push("Pacing was a bit deliberate. Try grouping words into cohesive phrases.");
  } else {
    notes.push("Good pacing and natural flow of speech.");
  }

  notes.push("Keep up the solid effort! Consistent daily practice will build automaticity.");

  return {
    pronunciation: overlapScore,
    fluency: fluencyScore,
    grammar: grammarScore,
    notes,
  };
}

// 2. Writing Coach Correction
export interface WritingCorrection {
  id: string;
  targetText: string;
  replacementText: string;
  explanation: string;
  type: "grammar" | "spelling" | "tone";
}

const COMMON_WRITING_RULES = [
  {
    find: /\bi have wrote\b/gi,
    replace: "I have written",
    explanation:
      "Use the past participle 'written' with the auxiliary verb 'have'. Also capitalize 'I'.",
    type: "grammar" as const,
  },
  {
    find: /\brecieve\b/gi,
    replace: "receive",
    explanation: "Spelling rule: 'i' before 'e' except after 'c'.",
    type: "spelling" as const,
  },
  {
    find: /\bdont\b/gi,
    replace: "don't",
    explanation: "Contractions require an apostrophe.",
    type: "grammar" as const,
  },
  {
    find: /\basap\b/gi,
    replace: "by Thursday",
    explanation:
      "Using a concrete date or deadline sounds more professional and less demanding than 'ASAP'.",
    type: "tone" as const,
  },
  {
    find: /\bshould of\b/gi,
    replace: "should have",
    explanation: "Use 'should have' (or contraction 'should've') instead of 'should of'.",
    type: "grammar" as const,
  },
  {
    find: /\btheir is\b/gi,
    replace: "there is",
    explanation: "Use 'there' to refer to a place or existence, not the possessive 'their'.",
    type: "grammar" as const,
  },
  {
    find: /\bweather\b(?=\s+or\b)/gi,
    replace: "whether",
    explanation: "Use 'whether' for choices/alternatives and 'weather' for atmospheric conditions.",
    type: "spelling" as const,
  },
];

export async function checkWriting(text: string): Promise<WritingCorrection[]> {
  if (isGeminiConfigured() || shouldUseOllama() || shouldUseNvidiaNim()) {
    try {
      const prompt = `
        You are an expert AI writing coach.
        Analyze the following text for spelling, grammar, and tone issues:
        "${text}"

        Suggest corrections. Focus on making the text professional, concise, and clear.
        Return your suggestions ONLY as a JSON array of correction objects, matching this schema:
        [
          {
            "id": string (unique identifier like "s1", "s2"),
            "targetText": string (exact substring in the text to replace),
            "replacementText": string (suggested replacement),
            "explanation": string (brief, plain-language explanation of why),
            "type": "grammar" | "spelling" | "tone"
          }
        ]
      `;

      const responseText = await callModel(prompt, true);
      return JSON.parse(responseText.trim()) as WritingCorrection[];
    } catch (e) {
      console.warn("Failed calling model, falling back to local writing rules:", e);
    }
  }

  // Local heuristic rule matching (Free & Unlimited)
  const corrections: WritingCorrection[] = [];
  let index = 1;

  COMMON_WRITING_RULES.forEach((rule) => {
    const matches = text.match(rule.find);
    if (matches) {
      matches.forEach((match) => {
        if (!corrections.some((c) => c.targetText.toLowerCase() === match.toLowerCase())) {
          corrections.push({
            id: `local-${index++}`,
            targetText: match,
            replacementText: rule.replace,
            explanation: rule.explanation,
            type: rule.type,
          });
        }
      });
    }
  });

  return corrections;
}

// 3. Mock Interview Assistant
const LOCAL_INTERVIEW_QUESTIONS: Record<string, string[]> = {
  general: [
    "Tell me about yourself and what drew you to this role.",
    "Describe a time you disagreed with a teammate. How did you handle it?",
    "How do you keep stakeholders informed when a deadline slips?",
    "What accommodation or working style helps you do your best work?",
    "Where do you want your communication skills to be in a year?",
  ],
  developer: [
    "How do you explain complex technical architecture to non-technical stakeholders?",
    "Tell me about a time you encountered a critical production bug. How did you coordinate the resolution?",
    "What is your approach to code reviews, both giving and receiving feedback?",
    "How do you balance writing high-quality code with meeting tight product release deadlines?",
  ],
  support: [
    "How do you de-escalate a conversation with an extremely frustrated customer?",
    "Can you share an example of a time you went above and beyond to solve a customer's issue?",
    "How do you manage your time when dealing with a high volume of incoming support tickets?",
    "What steps do you take if a customer asks a question you don't immediately know the answer to?",
  ],
};

export async function getInterviewReply(
  jobContext: string,
  history: { q: string; a: string }[],
): Promise<string> {
  if (isGeminiConfigured() || shouldUseOllama() || shouldUseNvidiaNim()) {
    try {
      const conversationHistory = history
        .map((item) => `Interviewer: ${item.q}\nCandidate: ${item.a}`)
        .join("\n");

      const prompt = `
        You are an expert HR interviewer. You are conducting a mock interview for the role of: "${jobContext}".
        
        Here is the conversation history so far:
        ${conversationHistory}
        
        Respond as the interviewer. Acknowledge their response briefly and ask the next logical interview question. Do not explain your reasoning. Output ONLY the interviewer's direct question/reply.
      `;

      return await callModel(prompt, false);
    } catch (e) {
      console.warn("Failed calling model, falling back to local interview bank:", e);
    }
  }

  // Local fallback: cycle through question bank based on role classification
  const lowerContext = jobContext.toLowerCase();
  let bank = LOCAL_INTERVIEW_QUESTIONS.general;

  if (
    lowerContext.includes("dev") ||
    lowerContext.includes("engineer") ||
    lowerContext.includes("programmer")
  ) {
    bank = LOCAL_INTERVIEW_QUESTIONS.developer;
  } else if (
    lowerContext.includes("support") ||
    lowerContext.includes("service") ||
    lowerContext.includes("customer")
  ) {
    bank = LOCAL_INTERVIEW_QUESTIONS.support;
  }

  const nextIndex = history.length;
  if (nextIndex < bank.length) {
    return bank[nextIndex]!;
  }

  const fallbackQuestions = LOCAL_INTERVIEW_QUESTIONS.general;
  const cycleIndex = (nextIndex - bank.length) % fallbackQuestions.length;
  return fallbackQuestions[cycleIndex]!;
}

export interface InterviewEvaluationResult {
  communicationScore: number;
  professionalismScore: number;
  suggestions: string[];
}

export async function evaluateInterview(
  jobContext: string,
  history: { q: string; a: string }[],
): Promise<InterviewEvaluationResult> {
  if (isGeminiConfigured() || shouldUseOllama() || shouldUseNvidiaNim()) {
    try {
      const conversationHistory = history
        .map((item) => `Interviewer: ${item.q}\nCandidate: ${item.a}`)
        .join("\n");

      const prompt = `
        You are an expert HR senior interviewer and recruiter.
        Analyze this candidate's mock interview performance for the role: "${jobContext}".
        
        Here is the transcript of the interview:
        ${conversationHistory}
        
        Score their overall communication skills (1-100) and professionalism (1-100).
        Provide 3 highly actionable, clear suggestions for improvement.
        Return your response ONLY as a JSON object matching this schema:
        {
          "communicationScore": number,
          "professionalismScore": number,
          "suggestions": [string, string, string]
        }
      `;

      const responseText = await callModel(prompt, true);
      return JSON.parse(responseText.trim()) as InterviewEvaluationResult;
    } catch (e) {
      console.warn("Failed calling model, falling back to local interview evaluator:", e);
    }
  }

  // Local fallback
  return {
    communicationScore: 82,
    professionalismScore: 85,
    suggestions: [
      "Your answers are relevant, but try to structure them using the STAR method (Situation, Task, Action, Result).",
      "Incorporate more industry-specific technical vocabulary to showcase your depth.",
      "Add detail to your examples; brief answers can sometimes be perceived as lack of experience.",
    ],
  };
}
