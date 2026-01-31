import { Rule, RuleContext } from "./ruleTypes"
import { Ad } from "../types/Ad"

export function applyRules(
  ads: Ad[],
  rules: Rule[],
  context: RuleContext
): Ad[] {
  return ads.filter(ad => {
    for (const rule of rules) {
      if (rule.if.category === context.category) {
        if (rule.blockAdIds?.includes(ad.id)) {
          return false
        }
      }
    }
    return true
  })
}
