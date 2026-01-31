export interface Context {
  content: string
  title?: string
  type?: "article" | "search" | "category" | "tag" | "home"
  category?: string | string[]
}
