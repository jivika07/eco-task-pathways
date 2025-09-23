import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple keyword-based relevance scoring between task text and submission text
export function computeTextRelevance(taskText: string, submissionText: string): {
  score: number;
  reasons: string[];
} {
  const task = normalizeText(expandEcoSynonyms(taskText));
  const submission = normalizeText(expandEcoSynonyms(submissionText));

  const taskKeywords = extractKeywords(task);
  const submissionKeywords = extractKeywords(submission);

  if (taskKeywords.size === 0 || submissionKeywords.size === 0) {
    return { score: 0, reasons: ["Insufficient descriptive text to assess relevance"] };
  }

  const intersection = new Set(
    [...submissionKeywords].filter((k) => taskKeywords.has(k))
  );
  const union = new Set([...taskKeywords, ...submissionKeywords]);

  const jaccard = intersection.size / union.size;

  // Boost score if important eco-action verbs appear in submission
  const actionVerbs = [
    "plant","planted","planting","clean","cleaned","cleaning","collect","collected","sorting","sort","sorted","recycle","recycled","recycling","audit","audited","auditing","monitor","monitored","monitoring","save","saved","saving"
  ];
  const submissionTokens = [...submissionKeywords];
  const hasAction = submissionTokens.some((t) => actionVerbs.includes(t));
  const boosted = Math.min(1, jaccard + (hasAction ? 0.1 : 0));

  const reasons: string[] = [];
  if (intersection.size > 0) {
    reasons.push(
      `Shared terms: ${[...intersection].slice(0, 6).join(", ")}${
        intersection.size > 6 ? "…" : ""
      }`
    );
  } else {
    reasons.push("No shared keywords between task and submission");
  }

  return { score: boosted, reasons };
}

export function scoreToLabel(score: number): "low" | "medium" | "high" {
  if (score >= 0.6) return "high";
  if (score >= 0.3) return "medium";
  return "low";
}

function normalizeText(text: string): string {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractKeywords(text: string): Set<string> {
  const stopwords = new Set([
    "the","a","an","and","or","but","if","then","else","for","of","on","in","to","with","by","at","from","as","is","are","was","were","be","been","being","this","that","these","those","it","its","into","over","under","about","your","you","i","we","they","he","she","them","our","us","me"
  ]);

  const tokens = text.split(" ")
    .map((t) => t.trim())
    .map((t) => stem(t))
    .filter((t) => t.length >= 3 && !stopwords.has(t));

  return new Set(tokens);
}

// Very lightweight stemmer for English verbs/nouns (rule-based)
function stem(token: string): string {
  let t = token;
  if (t.endsWith("ing") && t.length > 5) t = t.slice(0, -3);
  else if (t.endsWith("ed") && t.length > 4) t = t.slice(0, -2);
  else if (t.endsWith("es") && t.length > 4) t = t.slice(0, -2);
  else if (t.endsWith("s") && t.length > 3) t = t.slice(0, -1);
  return t;
}

// Expand common eco-related synonyms so semantically related words overlap
function expandEcoSynonyms(text: string): string {
  const map: Record<string, string[]> = {
    tree: ["sapling","oak","maple","native","plant"],
    plant: ["tree","sapling","seedling","reforest","afforest"],
    cleanup: ["clean","trash","waste","litter","beach","river","park"],
    recycle: ["sorting","segregate","plastic","paper","glass","metal"],
    water: ["conserve","saving","usage","leak","tap","flow"],
    energy: ["efficiency","audit","electricity","power","bulb","lighting"],
  };
  let augmented = text;
  for (const [key, syns] of Object.entries(map)) {
    const regex = new RegExp(`\\b${key}s?\\b`, "gi");
    if (regex.test(text)) {
      augmented += " " + syns.join(" ");
    }
  }
  return augmented;
}