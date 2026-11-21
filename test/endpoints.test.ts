import { describe, it, expect } from "vitest";
import app from "../src/index.js";
import { testApps } from "./fixtures.js";

describe("root page", () => {
    it("serves the badge generator", async () => {
        const response = await app.request("http://localhost/")
        expect(response.ok).toBe(true)
        expect(response.headers.get("content-type")).toMatch(/text\/html/)

        const body = await response.text()
        expect(body).toContain("PlayBadges")
        expect(body).toContain("Copy snippet")
        expect(body).toContain('type="importmap"')
        expect(body).toContain('from "preact"')
        expect(body).toContain('id="app"')
        expect(body).toContain("window.location.origin")
        expect(body).toContain("prefers-color-scheme: dark")
        expect(body).toContain("/badge/")
        expect(body).toContain('<link rel="canonical" href="https://playbadges.pavi2410.com/">')
        expect(body).toContain("<h1>Google Play Store badge generator</h1>")
        expect(body).toContain("application/ld+json")
    })

    it("serves robots.txt pointing at the sitemap", async () => {
        const response = await app.request("http://localhost/robots.txt")
        expect(response.ok).toBe(true)
        const body = await response.text()
        expect(body).toContain("Allow: /")
        expect(body).toContain("Sitemap: https://playbadges.pavi2410.com/sitemap.xml")
    })

    it("serves sitemap.xml", async () => {
        const response = await app.request("http://localhost/sitemap.xml")
        expect(response.ok).toBe(true)
        expect(response.headers.get("content-type")).toMatch(/application\/xml/)
        expect(await response.text()).toContain("<loc>https://playbadges.pavi2410.com/</loc>")
    })
})

describe.each(testApps)("endpoints for $appId",
    { timeout: 10000 },
    ({ appId }) => {
        it('should fetch downloads', async () => {
            const response = await app.request(`/badge/downloads?id=${appId}`)
            expect(response.ok).toBe(true)

            const body = await response.text()
            expect(body).toBeDefined()
        })

        it('should fetch ratings', async () => {
            const response = await app.request(`/badge/ratings?id=${appId}`)
            expect(response.ok).toBe(true)

            const body = await response.text()
            expect(body).toBeDefined()
        })

        it('should fetch version', async () => {
            const response = await app.request(`/badge/version?id=${appId}`)
            expect(response.ok).toBe(true)

            const body = await response.text()
            expect(body).toBeDefined()
        })

        it('should fetch full badge', async () => {
            const response = await app.request(`/badge/full?id=${appId}`)
            expect(response.ok).toBe(true)

            const body = await response.text()
            expect(body).toBeDefined()
        })
    })
