export function matchGeo(countries?: string[], country?: string): boolean {
  if (!countries || countries.length === 0) return true
  return country ? countries.includes(country) : false
}
