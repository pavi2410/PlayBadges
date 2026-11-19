import { describe, test, expect } from "vitest";
import { cleanJsonString } from "../src/json-utils.js";

describe("cleanJsonString", () => {
    test("quotes the callback keys and header values", () => {
        const raw = `{key: 'ds:5', hash: '11', data:[["Folo"]], sideChannel: {}}`;
        expect(JSON.parse(cleanJsonString(raw))).toEqual({ key: "ds:5", hash: "11", data: [["Folo"]] });
    });

    test("leaves apostrophes inside the data alone", () => {
        const raw = `{key: 'ds:5', hash: '11', data:[[["King's Cup Party Game"]],"it's 'quoted'"], sideChannel: {}}`;
        expect(JSON.parse(cleanJsonString(raw)).data).toEqual([[["King's Cup Party Game"]], "it's 'quoted'"]);
    });
});
