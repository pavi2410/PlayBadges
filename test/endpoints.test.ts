import { describe, it, expect } from "vitest";
import app from "../src/index.js";
import { testApps } from "./fixtures.js";

const BASE_URL = "http://127.0.0.1:8787";

describe.each(testApps)("endpoints for $appTitle ($appId)", ({ appId, appTitle }) => {
    it('should fetch downloads', async () => {
        const response = await app.request(`${BASE_URL}/badge/downloads?id=${appId}`)
        expect(response.ok).toBe(true)

        const body = await response.text()
        expect(body).toBeDefined()
    })

    it('should fetch ratings', async () => {
        const response = await app.request(`${BASE_URL}/badge/ratings?id=${appId}`)
        expect(response.ok).toBe(true)

        const body = await response.text()
        expect(body).toBeDefined()
    })

    it('should fetch full badge', async () => {
        const response = await app.request(`${BASE_URL}/badge/full?id=${appId}`)
        expect(response.ok).toBe(true)

        const body = await response.text()
        expect(body).toBeDefined()
    })
})
