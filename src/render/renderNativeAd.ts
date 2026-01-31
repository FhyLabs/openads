import { Ad } from "../types/Ad"

export function renderNativeAd(ad: Ad): string {
  return `
  <div class="native-ad">
    <img src="${ad.image}" />
    <h3>${ad.title}</h3>
    <p>${ad.description}</p>
  </div>
  `
}
