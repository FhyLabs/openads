import { Ad } from "../types/Ad"

export function renderTextAd(ad: Ad): string {
  return `<a href="${ad.url}">
    <strong>${ad.title}</strong><br/>
    <span>${ad.description}</span>
  </a>`
}
