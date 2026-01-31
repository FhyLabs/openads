import { Ad } from "../types/Ad"
import { scoreAd } from "./scoreAd"

export function runAuction(ads: Ad[], pageKeywords: string[]): Ad | null {
  let best: Ad | null = null
  let bestScore = 0

  for (const ad of ads) {
    const score = scoreAd(ad, pageKeywords)
    if (score > bestScore) {
      bestScore = score
      best = ad
    }
  }

  return best
}

export function runAuctionScore(ads: Ad[], pageKeywords: string[]): Ad[] {
  return ads
    .map(ad => ({ ad, score: scoreAd(ad, pageKeywords) }))
    .sort((a, b) => b.score - a.score)
    .map(a => a.ad)
}
