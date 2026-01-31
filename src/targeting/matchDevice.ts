import { DeviceType } from "../types/Ad"

export function matchDevice(
  adDevice?: "all" | "mobile" | "desktop",
  currentDevice?: "all" | "mobile" | "desktop"
): boolean {
  const ad = adDevice ?? "all"
  const user = currentDevice ?? "all"

  if (ad === "all" || user === "all") return true
  return ad === user
}