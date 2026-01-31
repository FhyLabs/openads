export function matchCategory(
  adCategory?: string[] | string,
  contextCategory?: string
): boolean {
  if (!adCategory) return true
  if (!contextCategory) return true 

  const categories = Array.isArray(adCategory) ? adCategory : [adCategory]

  return categories.includes(contextCategory)
}
