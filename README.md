# OpenAds <a href="./README-ID.md">ID</a>

**OpenAds** is a **Node.js** library for displaying ads based on **page context** or **user activity**.

**Key Features**:

* Supports various page types: `article`, `search`, `category`, `tag`, `home`
* Ad filters: **device**, **country**, **hour**, **category**
* Auction-based scoring to show the **most relevant and profitable ads**

---

## Ad Bidding & Scoring Flow

### Ad Score (Auction Score)

Each ad receives a **score** based on the following factors:

| Factor                        | Description                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------- |
| **Bid / Offer Price**         | Higher bid → higher chance to win                                            |
| **Keyword Relevance**         | Ad keywords compared to page context (`title + content`)                     |
| **Category (optional)**       | Matching page category → score increases                                     |
| **Device, Geo, Hour Filters** | **Filters**, not scores. Ads that don't match are **removed** before scoring |

### Ad Ranking

* All ads that pass the filters are sorted by **score: highest → lowest**
* Ads with the highest relevance & bid → displayed **at the top**
* `selectAd()` function → returns **one winning ad**
* `selectAds(context, ads, options, limit)` → returns **multiple top ads** (multi-ad)

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

> Note: Bid + keyword relevance determine the score. Device/geo/hour filters eliminate irrelevant ads before scoring.

---

## Campaign & Budget Flow

Every ad in a campaign **reduces the campaign budget** when displayed.

| Concept / Factor              | Description                                                        |
| ----------------------------- | ------------------------------------------------------------------ |
| **Campaign Budget**           | Total fund allocated for the campaign (e.g., 100,000)              |
| **Bid / Ad Price**            | When an ad is shown, the bid **is deducted from the budget**       |
| **Device, Geo, Hour Filters** | Ads that do not match are **removed**, budget is not reduced       |
| **Ad Priority**               | Ads with higher bid & higher keyword relevance are displayed first |
| **Stop When Budget Runs Out** | If remaining budget < ad bid → ad is not displayed                 |

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
> * Irrelevant ads (by device/geo/hour filters) **do not reduce budget**
> * Multi-ad campaigns → each ad displayed **reduces the budget separately**

---

## Usage

### Installation

```
npm i @fhylabs/openads
```

### Importing

```js
// CommonJS
const { Ad, Context, selectAd, selectAds, renderHtml } = require("@fhylabs/openads");

// ES Modules
import { Ad, Context, selectAd, selectAds, renderHtml } from "@fhylabs/openads"
```

### Sample Ads Data

```js
const ads: Ad[] = [
  {
    id: "ad-1",
    title: "Ultra Fast Laptop",
    description: "Laptop with high performance",
    url: "https://example.com",
    image: "https://img.example.com/laptop.jpg",
    keywords: ["laptop", "gaming", "developer", "high performance"],
    bid: 3500,
    device: "desktop",                      // all | desktop | mobile
    countries: ["ID", "EN"],                // [] → all countries
    hours: [9,10,11,12,13,14,15,16,17],     // [] → all hours
    category: ["hardware", "programming"]   // [] → all categories
  }
  // other ads ...
]
```

### Sample Page Contexts

```js
const contexts: { label: string, context: Context, options?: any }[] = [
  {
    label: "ARTICLE PAGE",
    context: {
      type: "article",
      title: "Learn Node.js Backend",
      content: "Node.js backend tutorial for developers. Covers server, hosting, and cloud infrastructure.",
      category: "backend"
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
        category: "backend" 
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
    label: "HOMEPAGE",
    context: { 
        type: "home", 
        content: "javascript typescript react developer tools" 
    }
  }
]
```

### Displaying Ads

#### Single Ad

```js
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

#### Multiple Ads

```js
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

```js
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

```js
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