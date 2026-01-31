export function detectCategory(text: string): string {
  if (/laptop|software|programming|tech/.test(text)) return "tech"
  if (/finance|bank|money|invest/.test(text)) return "finance"
  if (/travel|hotel|flight/.test(text)) return "travel"
  return "general"
}
