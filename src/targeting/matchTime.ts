export function matchTime(
  adHours?: number[],
  currentHour?: number
): boolean {
  if (!adHours || adHours.length === 0) return true
  if (currentHour === undefined) return false
  return adHours.includes(currentHour)
}
