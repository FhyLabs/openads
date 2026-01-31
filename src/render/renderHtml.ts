import { Ad } from "../types/Ad";
import { renderTextAd } from "./renderTextAd";
import { renderNativeAd } from "./renderNativeAd";

export function renderHtml(ad: Ad): string {
  if (ad.image && ad.image.trim() !== "") {
    return renderNativeAd(ad);
  }

  return renderTextAd(ad);
}
