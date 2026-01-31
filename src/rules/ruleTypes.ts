export interface RuleContext {
  category?: string
}

export interface Rule {
  if: Partial<RuleContext>
  blockAdIds?: string[]
}
