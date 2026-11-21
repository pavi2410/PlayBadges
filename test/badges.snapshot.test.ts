import { describe, it, expect, vi } from "vitest";
import app from "../src/index.js";
import { badgeApps, localeApps, localBadgeFonts, type BadgeAppId } from "./badge-fixtures.js";

vi.mock("../src/google-play-scraper.js", async () => {
    const { allBadgeApps } = await import("./badge-fixtures.js")
    return {
        fetchAppDetails: async (appId: string) => allBadgeApps[appId as BadgeAppId] ?? null,
    }
})

vi.mock("../src/badge-fonts.js", () => ({
    getBadgeFonts: async () => localBadgeFonts,
}))

async function badge(path: string) {
    const response = await app.request(`http://localhost${path}`)
    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toMatch(/image\/svg\+xml/)
    return response.text()
}

// badgen gives each gradient/mask a random id; rename them in order of appearance.
function stableIds(svg: string) {
    const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])
    return ids.reduce((out, id, i) => out.replaceAll(id, `id${i}`), svg)
}

const shieldsCases = [
    ["downloads", "/badge/downloads?id=com.example.rated"],
    ["downloads-pretty", "/badge/downloads?id=com.example.huge&pretty"],
    ["downloads-label", "/badge/downloads?id=com.example.rated&label=Installs"],
    ["ratings", "/badge/ratings?id=com.example.rated"],
    ["ratings-pretty", "/badge/ratings?id=com.example.rated&pretty"],
    ["ratings-unrated", "/badge/ratings?id=com.example.unrated"],
    ["version", "/badge/version?id=com.example.rated"],
    ["version-fallback", "/badge/version?id=com.example.unrated&fallback=Latest"],
] as const

// Localized `label` values: badgen estimates text width from Verdana metrics.
const localizedLabels = {
    ar: "التنزيلات",
    he: "הורדות",
    hi: "डाउनलोड",
    de: "Herunterladen",
    zh: "下载量",
    ja: "ダウンロード数",
    ko: "다운로드",
} as const

describe("shields badges with localized labels", () => {
    it.each(Object.entries(localizedLabels))("%s", async (locale, label) => {
        const svg = await badge(`/badge/downloads?id=com.example.rated&pretty&label=${encodeURIComponent(label)}`)
        await expect(stableIds(svg)).toMatchFileSnapshot(`./__snapshots__/shields-locale/downloads-${locale}.svg`)
    })
})

describe("shields badges", () => {
    it.each(shieldsCases)("%s", async (name, path) => {
        await expect(stableIds(await badge(path))).toMatchFileSnapshot(`./__snapshots__/shields/${name}.svg`)
    })
})

const fullAppIds = Object.keys(badgeApps) as BadgeAppId[]

describe("full badge", () => {
    describe.each(["light", "dark"] as const)("%s", (theme) => {
        it.each(fullAppIds)("%s", async (appId) => {
            const svg = await badge(`/badge/full?id=${appId}&theme=${theme}`)
            await expect(svg).toMatchFileSnapshot(`./__snapshots__/full/${appId}-${theme}.svg`)
        })
    })
})

describe("full badge locales", () => {
    describe.each(["light", "dark"] as const)("%s", (theme) => {
        it.each(Object.keys(localeApps))("%s", async (appId) => {
            const svg = await badge(`/badge/full?id=${appId}&theme=${theme}`)
            await expect(svg).toMatchFileSnapshot(`./__snapshots__/full-locale/${appId.replace("com.example.", "")}-${theme}.svg`)
        })
    })
})

it("returns 404 for unknown apps", async () => {
    const response = await app.request("http://localhost/badge/full?id=com.example.missing")
    expect(response.status).toBe(404)
})
