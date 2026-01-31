import { Ad } from "../types/Ad"

export function renderTextAd(ad: Ad): string {
  return `
  <a id="openads-container" href="${ad.url}">
    <strong id="openads-title">${ad.title}</strong><br/>
    <span id="openads-desc">${ad.description}</span>
  </a>`
}
