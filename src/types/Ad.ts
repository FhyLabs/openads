export type DeviceType = "all" | "desktop" | "mobile"

export interface Ad {
  id: string
  title: string
  description: string
  url: string
  image?: string
  keywords: string[]
  bid: number
  device?: "all" | "mobile" | "desktop"
  countries?: string[]
  hours?: number[]
  category?: string[]
}
