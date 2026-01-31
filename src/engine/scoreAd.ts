import { Ad } from "../types/Ad"

export function scoreAd(ad: Ad, pageKeywords: string[]): number {
  const relevance =
    ad.keywords.filter(k => pageKeywords.includes(k)).length

  return relevance * ad.bid
}
