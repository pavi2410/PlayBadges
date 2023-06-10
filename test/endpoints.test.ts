import {describe, it, assert} from "vitest";

import app from "../src/index.js";

describe("endpoints", () => {
    // it('should fetch stats', async () => {
    //     const response = await app.request('http://localhost:2410/stats')
    //     assert(response.ok)
    //
    //     const body = await response.text()
    //     assertExists(body)
    // })

    it('should fetch downloads', async () => {
        const response = await app.request('http://localhost:2410/badge/downloads?id=com.whatsapp')
        assert.isTrue(response.ok)

        const body = await response.text()
        assert.exists(body)
    })

    it('should fetch ratings', async () => {
        const response = await app.request('http://localhost:2410/badge/ratings?id=com.whatsapp')
        assert.exists(response.ok)

        const body = await response.text()
        assert.exists(body)
    })

    it('should fetch full badge', async () => {
        const response = await app.request('http://localhost:2410/badge/full?id=com.whatsapp')
        assert.isTrue(response.ok)

        const body = await response.text()
        assert.exists(body)
    })
})
