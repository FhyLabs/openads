import { Ad, Context, selectAd, selectAds, renderHtml, Campaign } from "../index"

/**
 * =========================
 * DATA IKLAN (10 IKLAN)
 * =========================
 */
const ads: Ad[] = [
  {
    id: "ad-1",
    title: "Hosting Node.js Indonesia",
    description: "Hosting cepat untuk backend Node.js",
    url: "https://hostingnode.id",
    image: "https://img.example.com/hosting.jpg",
    keywords: ["hosting", "node", "backend", "server"],
    bid: 3500,
    device: "desktop",
    countries: ["ID"],
    hours: [9,10,11,12,13,14,15,16,17],
    category: ["hardware", "programming"]
  },
  {
    id: "ad-2",
    title: "Cloud VPS Global",
    description: "Server cloud cepat semua negara",
    url: "https://cloudvps.com",
    keywords: ["cloud", "vps", "server"],
    bid: 2800,
    device: "all",
    hours: []            // 24 jam
  },
  {
    id: "ad-3",
    title: "Belajar Coding dari HP",
    description: "Aplikasi mobile untuk belajar programming",
    url: "https://mobilecoding.app",
    keywords: ["coding", "mobile", "programming"],
    bid: 3000,
    device: "mobile",
    hours: [],           // 24 jam
    category: ["programming"]
  },
  {
    id: "ad-4",
    title: "Kursus React Online",
    description: "Belajar React dan frontend modern",
    url: "https://reactcourse.dev",
    keywords: ["react", "frontend", "javascript"],
    bid: 2500,
    device: "all",
    hours: [], 
    category: ["frontend"]
  },
  {
    id: "ad-5",
    title: "Template Website Developer",
    description: "Template siap pakai untuk portofolio",
    url: "https://template.dev",
    keywords: ["template", "website", "developer"],
    bid: 2000,
    device: "all",
    hours: [], 
  },
  {
    id: "ad-6",
    title: "Bootcamp Backend Node.js",
    description: "Belajar API, database, dan backend",
    url: "https://bootcamp.dev",
    keywords: ["backend", "node", "api", "developer"],
    bid: 3000,
    device: "all",
    hours: [],
    category: ["backend"]
  },
  {
    id: "ad-7",
    title: "Tools Produktivitas Developer",
    description: "Coding lebih cepat dan rapi",
    url: "https://devtools.app",
    keywords: ["tools", "developer", "productivity"],
    bid: 1800,
    device: "all",
    hours: []
  },
  {
    id: "ad-8",
    title: "Kursus TypeScript Intensif",
    description: "TypeScript untuk project skala besar",
    url: "https://typescript.dev",
    keywords: ["typescript", "javascript", "developer"],
    bid: 2400,
    device: "all",
    hours: [],
    category: ["frontend"]
  },
  {
    id: "ad-9",
    title: "Cloud Server Murah Indonesia",
    description: "Server cloud cepat untuk web app",
    url: "https://cloudid.dev",
    keywords: ["cloud", "vps", "server", "hosting"],
    bid: 2600,
    device: "all",
    countries: ["ID"],
    hours: [],
    category: ["backend"]
  },
  {
    id: "ad-10",
    title: "Buku Backend Architecture",
    description: "Panduan membangun backend scalable",
    url: "https://backendbook.dev",
    keywords: ["backend", "architecture", "server"],
    bid: 2000,
    device: "all",
    hours: [],
    category: ["backend"]
  }
]

/**
 * =========================
 * CAMPAIGN
 * =========================
 */
const campaign: Campaign = {
  id: "camp-1",
  ads,
  budget: 100000
}

/**
 * =========================
 * CONTEXTS (SEMUA HALAMAN)
 * =========================
 */
const contexts: { label: string, context: Context, options?: any }[] = [
  {
    label: "ARTICLE PAGE",
    context: {
      type: "article",
      title: "Belajar Backend Node.js",
      content: "Tutorial backend Node.js untuk developer. Membahas server, hosting, dan cloud infrastructure.",
      category: "backend"
    },
    options: { device: "desktop", country: "ID" }
  },
  {
    label: "SEARCH PAGE",
    context: { type: "search", content: "cloud vps server" },
    options: { device: "all", country: "ID" }
  },
  {
    label: "CATEGORY PAGE",
    context: { type: "category", content: "backend", category: "backend" }
  },
  {
    label: "TAG PAGE",
    context: { type: "tag", content: "developer" }
  },
  {
    label: "HOMEPAGE",
    context: { type: "home", content: "javascript typescript react developer tools" }
  }
]

/**
 * =========================
 * OUTPUT (Multi Ads)
 * =========================
 */
for (const { label, context, options } of contexts) {
  const topAds: Ad[] = selectAds(context, ads, options, 3)
  console.log(`\n===== ${label} =====`)
  if (!topAds.length) console.log("Tidak ada iklan yang cocok")
  else {
    topAds.forEach((ad: Ad, i: number) => {
      console.log(`\n--- Iklan #${i + 1} ---`)
      console.log(`ID      : ${ad.id}`)
      console.log(`Title   : ${ad.title}`)
      console.log(`Device  : ${ad.device}`)
      console.log(`Category: ${ad.category}`)
      console.log(`Bid     : ${ad.bid}`)
      console.log("\nHTML OUTPUT:")
      console.log(renderHtml(ad))
    })
  }
}

/**
 * =========================
 * OUTPUT (Single Ads)
 * =========================
 */
for (const { label, context, options } of contexts) {
  const ad = selectAd(context, ads, options)
  console.log(`\n===== ${label} =====`)
  if (!ad) {
    console.log("Tidak ada iklan yang cocok")
  } else {
    console.log(`ID      : ${ad.id}`)
    console.log(`Judul   : ${ad.title}`)
    console.log(`Device  : ${ad.device}`)
    console.log(`Category: ${ad.category}`)
    console.log(`Bid     : ${ad.bid}`)
    console.log("\nHTML OUTPUT:\n")
    console.log(renderHtml(ad))
  }
}

/**
 * =========================
 * OUTPUT Campaign (Multi Ads)
 * =========================
 */
const { context: articleContext, options: articleOptions } = contexts[0]
const topAdsFromCampaign = selectAds(articleContext, campaign.ads, articleOptions, 3)

console.log("\n===== CAMPAIGN: Multi Ads =====")
if (!topAdsFromCampaign.length) console.log("Tidak ada iklan yang cocok")
else {
  topAdsFromCampaign.forEach((ad: Ad, i: number) => {
    console.log(`\n--- Iklan #${i + 1} ---`)
    console.log(`ID      : ${ad.id}`)
    console.log(`Title   : ${ad.title}`)
    console.log(`Bid     : ${ad.bid}`)
    console.log("HTML OUTPUT:")
    console.log(renderHtml(ad))
  })
}

/**
 * =========================
 * OUTPUT Campaign (Single Ads)
 * =========================
 */
const adFromCampaign = selectAd(articleContext, campaign.ads, articleOptions)

console.log("\n===== CAMPAIGN: Single Ad =====")
if (adFromCampaign) {
  console.log(`ID      : ${adFromCampaign.id}`)
  console.log(`Title   : ${adFromCampaign.title}`)
  console.log(`Bid     : ${adFromCampaign.bid}`)
  console.log("HTML OUTPUT:")
  console.log(renderHtml(adFromCampaign))
} else {
  console.log("Tidak ada iklan yang cocok")
}