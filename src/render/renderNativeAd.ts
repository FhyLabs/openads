import { Ad } from "../types/Ad"

export function renderNativeAd(ad: Ad): string {
  return `
  <a id="openads-container" href="${ad.url}">
    <img id="openads-images" src="${ad.image}" />
    <h3 id="openads-title">${ad.title}</h3>
    <p id="openads-desc">${ad.description}</p>
  </a>
  `
}
