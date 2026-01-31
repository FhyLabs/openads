import { normalizeText } from "./normalizeText"

export function extractKeywords(text: string): string[] {
  const words = normalizeText(text).split(/\s+/)
  const freq: Record<string, number> = {}

  for (const w of words) {
    if (w.length < 4) continue
    freq[w] = (freq[w] || 0) + 1
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)
}
