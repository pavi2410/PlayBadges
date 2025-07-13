import { describe, test, expect, assert } from "vitest";
import { fetchAppDetails } from "../src/google-play-scraper.js";
import { testApps } from "./fixtures.js";

describe("scraper", () => {
    test.each(testApps)('should fetch $appId', async ({ appId, appTitle }) => {
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
