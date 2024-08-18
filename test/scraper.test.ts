import { describe, test, expect, assert } from "vitest";
import { fetchAppDetails } from "../src/google-play-scraper.js";

describe("scraper", () => {
    test.each([
        { appId: 'com.whatsapp', appTitle: 'WhatsApp Messenger' },
        { appId: 'appinventor.ai_pavitragolchha.VR', appTitle: 'VR Compatibility Checker' },
        { appId: 'me.pavi2410.folo', appTitle: 'Folo: Social Followers Tracker' },
    ])('should fetch $appId', async ({ appId, appTitle }) => {
        const appDetails = await fetchAppDetails(appId);

        expect(appDetails).not.toBeNull();

        expect(appDetails!.title).toBe(appTitle);
        expect(appDetails!.description).not.toBeNull();
        expect(appDetails!.summary).not.toBeNull();
        expect(appDetails!.installs).not.toBeNull();
        expect(appDetails!.minInstalls).not.toBeNull();
        expect(appDetails!.maxInstalls).not.toBeNull();
        expect(appDetails!.icon).not.toBeNull();
        expect(appDetails!.developer).not.toBeNull();

        expect(appDetails!.minInstalls).toBeTypeOf('number');
        expect(appDetails!.maxInstalls).toBeTypeOf('number');
        expect(appDetails!.minInstalls).toBeLessThanOrEqual(appDetails!.maxInstalls!);

        expect(URL.canParse(appDetails!.icon!)).toBe(true);
    });
});
