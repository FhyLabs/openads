import { Ad } from "../types/Ad"
import { renderTextAd } from "./renderTextAd"
import { renderNativeAd } from "./renderNativeAd"

export function renderHtml(ad: Ad): string {
  return ad.image ? renderNativeAd(ad) : renderTextAd(ad)
}
