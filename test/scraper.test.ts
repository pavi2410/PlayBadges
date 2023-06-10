import {describe, it, assert} from "vitest";
import {fetchAppDetails} from "../src/google-play-scraper.js";

describe("scraper", () => {
    it('should fetch whatsapp', async () => {
        const appDetails = await fetchAppDetails('com.whatsapp', 'US');

        assert.exists(appDetails);
        // @ts-ignore
        assert.strictEqual(appDetails.title, 'WhatsApp Messenger');
    });
});
