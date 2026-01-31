import { Context } from "../types/Context";
import { Ad } from "../types/Ad";
import { extractKeywords } from "../context/extractKeywords";
import { detectCategory } from "../context/detectCategory";
import { runAuction, runAuctionScore } from "./auction";
import { matchDevice } from "../targeting/matchDevice";
import { matchGeo } from "../targeting/matchGeo";
import { matchTime } from "../targeting/matchTime";
import { matchCategory } from "../targeting/matchCategory";

interface Options {
  device?: "all" | "mobile" | "desktop";
  country?: string;
  hour?: number;
}

function normalizeCategories(category?: string | string[]): string[] {
  if (!category) return [];
  return Array.isArray(category) ? category : [category];
}

export function selectAds(
  context: Context,
  ads: Ad[],
  options: Options = {},
  limit: number = 3
): Ad[] {
  const text = `${context.title ?? ""}\n${context.content}`;
  const contextCategories = normalizeCategories(context.category);
  const keywords = extractKeywords(text);

  if (contextCategories.length === 0) {
    const detected = detectCategory(text);
    contextCategories.push(...normalizeCategories(detected));
  }

  const filtered = ads.filter(ad => {
    const adCategories = normalizeCategories(ad.category);
    const categoryMatch =
      contextCategories.length === 0 || adCategories.some(cat => contextCategories.includes(cat));

    return (
      matchDevice(ad.device, options.device) &&
      matchGeo(ad.countries, options.country) &&
      matchTime(ad.hours, options.hour) &&
      categoryMatch
    );
  });

  if (!filtered.length) return [];

  const ranked = runAuctionScore(filtered, keywords);
  return ranked.slice(0, limit);
}

export function selectAd(
  context: Context,
  ads: Ad[],
  options: Options = {}
): Ad | null {
  const top = selectAds(context, ads, options, 1);
  return top.length ? top[0] : null;
}
