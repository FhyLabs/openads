import { Ad } from "./Ad"

export interface Campaign {
  id: string
  ads: Ad[]
  budget: number
}
