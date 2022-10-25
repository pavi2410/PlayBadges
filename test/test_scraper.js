import {describe, it} from "node:test";
import assert from "node:assert";
import {fetchAppDetails} from "../src/google-play-scraper.js";

describe("scraper", () => {
    it('should fetch whatsapp', async () => {
        const appDetails = await fetchAppDetails({appId: 'com.whatsapp', countryCode: 'US'})

        // assert that appDetails is not null
        assert.ok(appDetails)
        assert.strictEqual(appDetails.title, 'WhatsApp Messenger');
    });

    it('should fetch fake app', async () => {
        const appDetails = await fetchAppDetails({appId: 'com.fakesapp', countryCode: 'US'})

        assert.ifError(appDetails)
    });
});
