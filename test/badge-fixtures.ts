import { readFileSync } from "node:fs";
import type { AppDetails } from "../src/google-play-scraper.js";

// A fixed, offline icon so renders never fetch from play-lh.googleusercontent.com.
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34a853"/><stop offset="1" stop-color="#1a73e8"/></linearGradient></defs><rect width="120" height="120" fill="url(#g)"/><circle cx="60" cy="60" r="28" fill="#fff"/></svg>`
const icon = `data:image/svg+xml,${encodeURIComponent(iconSvg)}`

const base: AppDetails = {
    title: "Snapshot App",
    description: "A fixture app for snapshot tests.",
    summary: "Fixture",
    installs: "1,000,000+",
    minInstalls: 1_000_000,
    maxInstalls: 1_234_567,
    score: 4.36,
    scoreText: "4.4",
    ratings: 12_345,
    icon,
    developer: "PlayBadges Tests",
    version: "2.3.1",
    recentChanges: null,
    released: null,
    updated: null,
}

export const badgeApps = {
    "com.example.rated": base,
    "com.example.unrated": { ...base, title: "Fresh Launch", maxInstalls: 42, score: null, scoreText: null, ratings: null, version: null },
    "com.example.huge": { ...base, title: "Massively Popular Messenger", developer: "Huge Corp", maxInstalls: 5_000_000_000, score: 4.1, scoreText: "4.1", ratings: 210_000_000 },
    "com.example.longname": { ...base, title: "An Extremely Long Application Title That Should Overflow The Badge", developer: "A Developer Studio With A Very Long Legal Name LLC" },
} satisfies Record<string, AppDetails>

// Apps with titles/developers in scripts the bundled fonts may not cover: RTL, Indic,
// CJK, and long Latin compounds with diacritics.
export const localeApps = {
    "com.example.ar": { ...base, title: "الطقس اليوم ٢٤ ساعة", developer: "شركة النخبة للتطبيقات" },
    "com.example.he": { ...base, title: "מזג האוויר בישראל", developer: "סטודיו כחול לבן" },
    "com.example.hi": { ...base, title: "हिंदी समाचार और मौसम", developer: "भारत डिजिटल प्राइवेट लिमिटेड" },
    "com.example.de": { ...base, title: "Straßenbahnfahrplanauskunft", developer: "Verkehrsbetriebe Zürich-Süd GmbH" },
    "com.example.zh": { ...base, title: "微信读书", developer: "腾讯科技（深圳）有限公司" },
    "com.example.ja": { ...base, title: "ポケット家計簿 かんたん記録", developer: "株式会社サンプルアプリ" },
    "com.example.ko": { ...base, title: "배달의민족 주문하기", developer: "우아한형제들" },
    "com.example.mixed": { ...base, title: "Tasks • مهام • 할 일 • 任务", developer: "Global Apps 🌍 Ltd" },
} satisfies Record<string, AppDetails>

export const allBadgeApps = { ...badgeApps, ...localeApps }

export type BadgeAppId = keyof typeof allBadgeApps

const font = (file: string) => readFileSync(new URL(`./fixtures/fonts/${file}`, import.meta.url))

// Local copies of the fonts in src/badge-fonts.ts, so glyph output can't drift with the CDN.
export const localBadgeFonts = [
    font("Pretendard-Regular.woff2"),
    font("Pretendard-SemiBold.woff2"),
    font("Inter-Regular.ttf"),
    font("Inter-SemiBold.ttf"),
]
