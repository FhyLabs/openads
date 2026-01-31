# OpenAds <a href="./README.md">EN</a>

**OpenAds** adalah library **Node.js** untuk menampilkan iklan berdasarkan **konteks** halaman atau aktivitas pengguna.

**Fitur Utama**:

* Mendukung berbagai tipe halaman: `article`, `search`, `category`, `tag`, `home`
* Filter iklan: **device**, **negara**, **jam**, **kategori**
* Penentuan iklan menggunakan **auction-based scoring** untuk menampilkan iklan **paling relevan dan menguntungkan**
* Support **multi-category** di context dan ads
* `renderHtml` otomatis pilih **text ad** atau **native ad** berdasarkan `ad.image`

---

## Alur Bidding & Skor Iklan

### Skor Iklan (Auction Score)

Setiap iklan mendapatkan **skor** berdasarkan beberapa faktor:

| Faktor                      | Penjelasan                                                              |
| --------------------------- | ----------------------------------------------------------------------- |
| **Bid / Harga Tawaran**     | Bid lebih tinggi → peluang menang lebih besar                           |
| **Relevansi Keyword**       | Keyword iklan dibandingkan dengan kata di konteks (`title + content`)   |
| **Kategori (opsional)**     | Cocok dengan kategori halaman → skor naik                               |
| **Filter Device, Geo, Jam** | **Filter**, bukan skor. Iklan yang tidak cocok langsung **dikeluarkan** |

### Ranking Iklan

* Semua iklan yang lolos filter diurutkan dari **skor tertinggi → terendah**
* Iklan dengan relevansi dan bid tertinggi → tampil **paling atas**
* Fungsi `selectAd()` → menampilkan **satu pemenang**
* Fungsi `selectAds(context, ads, options, limit)` → menampilkan **beberapa iklan teratas** (multi-ad)

#### Contoh Skor

| Iklan | Bid  | Relevansi Keyword | Skor Total |
| ----- | ---- | ----------------- | ---------- |
| ad-1  | 3500 | Tinggi            | 95         |
| ad-2  | 2800 | Sedang            | 75         |
| ad-3  | 3000 | Rendah            | 70         |

**Urutan Tayang:**

```
ad-1 → ad-2 → ad-3
```

> Catatan: Bid + relevansi keyword menentukan skor. Filter device/geo/jam mengeliminasi iklan yang tidak relevan sebelum scoring.

---

## Alur Campaign & Budget

Setiap iklan dalam campaign mengurangi budget saat ditayangkan.

| Konsep / Faktor             | Penjelasan                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------- |
| **Budget Campaign**         | Total dana yang dialokasikan untuk campaign (misal: 100.000)                          |
| **Bid / Harga Iklan**       | Saat iklan ditayangkan, bid **dikurangkan dari budget**                               |
| **Filter Device, Geo, Jam** | Iklan yang tidak cocok langsung **dikeluarkan**, budget tidak berkurang               |
| **Prioritas Iklan**         | Iklan dengan bid lebih tinggi & relevansi keyword lebih tinggi ditayangkan lebih dulu |
| **Stop Saat Habis Budget**  | Jika budget tersisa < bid iklan → iklan tidak ditayangkan                             |

#### Contoh Budget

| Iklan | Bid   | Relevansi | Budget Sebelum | Budget Sesudah |
| ----- | ----- | --------- | -------------- | -------------- |
| ad-1  | 3.500 | Tinggi    | 10.000         | 6.500          |
| ad-2  | 2.800 | Sedang    | 6.500          | 3.700          |
| ad-3  | 3.000 | Rendah    | 3.700          | 700            |

**Urutan Tayang:**

```
ad-1 → ad-2 → ad-3
```

> Catatan:
>
> * Iklan hanya ditayangkan jika **budget campaign ≥ bid iklan**
> * Iklan yang tidak relevan (filter device/geo/jam) **tidak mengurangi budget**
> * Multi-ad campaign → setiap iklan yang ditayangkan **mengurangi budget** secara terpisah

---

## Penggunaan

### Instalasi

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

### Contoh Data Iklan (Ad)

```ts
const ads: Ad[] = [
  {
    id: "ad-1",
    title: "Laptop Ultra Cepat",
    description: "Laptop dengan performa tinggi",
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
    title: "Cloud VPS Global",
    description: "Server cloud cepat semua negara",
    url: "https://cloudvps.com",
    bid: 2800,
    device: "all",
    countries: [],
    hours: [],
    category: ["backend"],
    keywords: ["cloud","vps","server"]
  },
  // Tambahkan iklan lainnya (total 10) ...
]
```

---

### Contoh Context Halaman (Support Multi-Category)

```ts
const contexts: { label: string, context: Context, options?: any }[] = [
  {
    label: "HALAMAN ARTIKEL",
    context: {
      type: "article",
      title: "Belajar Backend & Frontend Node.js",
      content: "Tutorial lengkap backend dan frontend Node.js",
      category: ["backend","frontend"]   // Bisa lebih dari 1
    },
    options: { device: "desktop", country: "ID" }
  },
  {
    label: "HALAMAN PENCARIAN",
    context: { 
        type: "search", 
        content: "cloud vps server" 
    },
    options: { device: "all", country: "ID" }
  },
  {
    label: "HALAMAN KATEGORI",
    context: { 
        type: "category", 
        content: "backend", 
        category: ["backend","frontend"] 
    }
  },
  {
    label: "HALAMAN TAG",
    context: { 
        type: "tag", 
        content: "developer" 
    }
  },
  {
    label: "HALAMAN BERANDA",
    context: { 
        type: "home", 
        content: "javascript typescript react developer tools" 
    }
  }
]
```

---

### Contoh Campaign

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

### Menampilkan Iklan

#### Single Ad

```ts
for (const { label, context, options } of contexts) {
  const ad = selectAd(context, ads, options)
  console.log(`\n===== ${label} =====`)
  if (!ad) console.log("Tidak ada iklan yang cocok")
  else {
    console.log(`ID      : ${ad.id}`)
    console.log(`Judul   : ${ad.title}`)
    console.log(`Device  : ${ad.device}`)
    console.log(`Kategori: ${ad.category}`)
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
  if (!topAds.length) console.log("Tidak ada iklan yang cocok")
  else {
    topAds.forEach((ad: Ad, i: number) => {
      console.log(`\n--- Iklan #${i + 1} ---`)
      console.log(`ID      : ${ad.id}`)
      console.log(`Title   : ${ad.title}`)
      console.log(`Device  : ${ad.device}`)
      console.log(`Kategori: ${ad.category}`)
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
  console.log("Tidak ada iklan yang cocok")
}
```