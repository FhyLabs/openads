import { Context } from "../types/Context"
import { Ad } from "../types/Ad"
import { extractKeywords } from "../context/extractKeywords"
import { detectCategory } from "../context/detectCategory"
import { runAuction, runAuctionScore } from "./auction"
import { matchDevice } from "../targeting/matchDevice"
import { matchGeo } from "../targeting/matchGeo"
import { matchTime } from "../targeting/matchTime"
import { matchCategory } from "../targeting/matchCategory"

interface Options {
  device?: "all" | "mobile" | "desktop"
  country?: string
  hour?: number
}

export function selectAds(
  context: Context,
  ads: Ad[],
  options: Options = {},
  limit: number = 3
): Ad[] {
  const text = `${context.title ?? ""}\n${context.content}`
  const keywords = extractKeywords(text)
  const category = context.category ?? detectCategory(text)

  const filtered = ads.filter(ad =>
    matchDevice(ad.device, options.device) &&
    matchGeo(ad.countries, options.country) &&
    matchTime(ad.hours, options.hour) &&
    matchCategory(ad.category, category)
  )

  if (!filtered.length) return []

  const ranked = runAuctionScore(filtered, keywords)
  return ranked.slice(0, limit)
}

export function selectAd(
  context: Context,
  ads: Ad[],
  options: Options = {}
): Ad | null {
  const top = selectAds(context, ads, options, 1)
  return top.length ? top[0] : null
}
