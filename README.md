# OpenAds <a href="./README-ID.md">ID</a>

**OpenAds** is a **Node.js** library for displaying ads based on **page context** or **user activity**.

**Key Features**:

* Supports multiple page types: `article`, `search`, `category`, `tag`, `home`
* Ad filters: **device**, **country**, **hour**, **category**
* Ad selection uses **auction-based scoring** to show the **most relevant and profitable ads**
* Supports **multi-category** in context and ads
* `renderHtml` automatically chooses **text ad** or **native ad** based on `ad.image`

---

## Bidding & Ad Scoring Flow

### Ad Score (Auction Score)

Each ad gets a **score** based on several factors:

| Factor                       | Description                                                               |
| ---------------------------- | ------------------------------------------------------------------------- |
| **Bid / Offer Price**        | Higher bid → higher chance of winning                                     |
| **Keyword Relevance**        | Ad keywords compared to page context (`title + content`)                  |
| **Category (optional)**      | Matches page category → increases score                                   |
| **Device, Geo, Hour Filter** | **Filter**, not a score. Ads that don't match are **immediately removed** |

### Ad Ranking

* All ads that pass the filters are sorted from **highest → lowest score**
* Ads with the highest relevance and bid → displayed **at the top**
* `selectAd()` → displays **one winning ad**
* `selectAds(context, ads, options, limit)` → displays **top multiple ads** (multi-ad)

#### Example Score

| Ad   | Bid  | Keyword Relevance | Total Score |
| ---- | ---- | ----------------- | ----------- |
| ad-1 | 3500 | High              | 95          |
| ad-2 | 2800 | Medium            | 75          |
| ad-3 | 3000 | Low               | 70          |

**Display Order:**

```
ad-1 → ad-2 → ad-3
```

> Note: Bid + keyword relevance determine the score. Device/geo/hour filters eliminate irrelevant ads **before scoring**.

---

## Campaign & Budget Flow

Each ad in a campaign reduces the budget when displayed.

| Concept / Factor              | Description                                                              |
| ----------------------------- | ------------------------------------------------------------------------ |
| **Campaign Budget**           | Total funds allocated for the campaign (e.g., 100,000)                   |
| **Ad Bid / Price**            | When an ad is displayed, the bid **is subtracted from the budget**       |
| **Device, Geo, Hour Filter**  | Ads that don't match are immediately **removed**, budget is not deducted |
| **Ad Priority**               | Ads with higher bid & keyword relevance are displayed first              |
| **Stop When Budget Runs Out** | If remaining budget < ad bid → ad is not displayed                       |

#### Example Budget

| Ad   | Bid   | Relevance | Budget Before | Budget After |
| ---- | ----- | --------- | ------------- | ------------ |
| ad-1 | 3,500 | High      | 10,000        | 6,500        |
| ad-2 | 2,800 | Medium    | 6,500         | 3,700        |
| ad-3 | 3,000 | Low       | 3,700         | 700          |

**Display Order:**

```
ad-1 → ad-2 → ad-3
```

> Notes:
>
> * Ads are displayed only if **campaign budget ≥ ad bid**
> * Irrelevant ads (device/geo/hour filters) **do not reduce the budget**
> * Multi-ad campaigns → each displayed ad **reduces the budget separately**

---

## Usage

### Installation

```
npm i @fhylabs/openads
```

### Import Library

```js
// CommonJS
const { Ad, Context, selectAd, selectAds, renderHtml, Campaign } = require("@fhylabs/openads");

// ES Modules
import { Ad, Context, selectAd, selectAds, renderHtml, Campaign } from "@fhylabs/openads"
```

---

### Example Ad Data

```ts
const ads: Ad[] = [
  {
    id: "ad-1",
    title: "Ultra Fast Laptop",
    description: "High-performance laptop",
    url: "https://example.com",
    image: "https://img.example.com/laptop.jpg",
    keywords: ["laptop", "gaming", "developer", "high performance"],
    bid: 3500,
    device: "desktop",
    countries: ["ID", "EN"],
    hours: [9,10,11,12,13,14,15,16,17],
    category: ["hardware", "programming"]
  },
  {
    id: "ad-2",
    title: "Global Cloud VPS",
    description: "Fast cloud server worldwide",
    url: "https://cloudvps.com",
    bid: 2800,
    device: "all",
    countries: [],
    hours: [],
    category: ["backend"],
    keywords: ["cloud","vps","server"]
  },
  // Add other ads (total 10) ...
]
```

---

### Example Page Context (Supports Multi-Category)

```ts
const contexts: { label: string, context: Context, options?: any }[] = [
  {
    label: "ARTICLE PAGE",
    context: {
      type: "article",
      title: "Learn Backend & Frontend Node.js",
      content: "Complete tutorial on Node.js backend and frontend",
      category: ["backend","frontend"] // Can have multiple
    },
    options: { device: "desktop", country: "ID" }
  },
  {
    label: "SEARCH PAGE",
    context: { 
        type: "search", 
        content: "cloud vps server" 
    },
    options: { device: "all", country: "ID" }
  },
  {
    label: "CATEGORY PAGE",
    context: { 
        type: "category", 
        content: "backend", 
        category: ["backend","frontend"] 
    }
  },
  {
    label: "TAG PAGE",
    context: { 
        type: "tag", 
        content: "developer" 
    }
  },
  {
    label: "HOME PAGE",
    context: { 
        type: "home", 
        content: "javascript typescript react developer tools" 
    }
  }
]
```

---

### Example Campaign

```ts
const campaigns: Campaign[] = [
  {
    id: "camp-1",
    ads: adsCampaign1,
    budget: 100000
  },
  {
    id: "camp-2",
    ads: adsCampaign2,
    budget: 50000
  }
]
```

---

### Displaying Ads

#### Single Ad

```ts
for (const { label, context, options } of contexts) {
  const ad = selectAd(context, ads, options)
  console.log(`\n===== ${label} =====`)
  if (!ad) console.log("No matching ads")
  else {
    console.log(`ID      : ${ad.id}`)
    console.log(`Title   : ${ad.title}`)
    console.log(`Device  : ${ad.device}`)
    console.log(`Category: ${ad.category}`)
    console.log(`Bid     : ${ad.bid}`)
    console.log("\nHTML OUTPUT:\n")
    console.log(renderHtml(ad))
  }
}
```

#### Multi Ads

```ts
for (const { label, context, options } of contexts) {
  const topAds: Ad[] = selectAds(context, ads, options, 3)
  console.log(`\n===== ${label} =====`)
  if (!topAds.length) console.log("No matching ads")
  else {
    topAds.forEach((ad: Ad, i: number) => {
      console.log(`\n--- Ad #${i + 1} ---`)
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
```

#### Campaign Multi Ads

```ts
const { context: articleContext, options: articleOptions } = contexts[0]
const topAdsFromCampaign = selectAds(articleContext, campaign.ads, articleOptions, 3)
console.log("\n===== CAMPAIGN: Multi Ads =====")
if (!topAdsFromCampaign.length) console.log("No matching ads")
else {
  topAdsFromCampaign.forEach((ad: Ad, i: number) => {
    console.log(`\n--- Ad #${i + 1} ---`)
    console.log(`ID      : ${ad.id}`)
    console.log(`Title   : ${ad.title}`)
    console.log(`Bid     : ${ad.bid}`)
    console.log("HTML OUTPUT:")
    console.log(renderHtml(ad))
  })
}
```

#### Campaign Single Ad

```ts
const adFromCampaign = selectAd(articleContext, campaign.ads, articleOptions)
console.log("\n===== CAMPAIGN: Single Ad =====")
if (adFromCampaign) {
  console.log(`ID      : ${adFromCampaign.id}`)
  console.log(`Title   : ${adFromCampaign.title}`)
  console.log(`Bid     : ${adFromCampaign.bid}`)
  console.log("HTML OUTPUT:")
  console.log(renderHtml(adFromCampaign))
} else {
  console.log("No matching ads")
}
```