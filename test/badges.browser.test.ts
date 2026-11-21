import { describe, it, expect } from "vitest";
import { page } from "vitest/browser";

// Screenshots the committed SVG snapshots (written by badges.snapshot.test.ts) the way
// users see them: as <img> in a real browser.
const svgs = import.meta.glob<string>("./__snapshots__/**/*.svg", {
    query: "?raw",
    import: "default",
    eager: true,
})

const cases = Object.entries(svgs).map(([path, svg]) => [
    path.replace("./__snapshots__/", "").replace(/\.svg$/, "").replaceAll("/", "-"),
    svg,
] as const)

async function mount(svg: string) {
    document.body.innerHTML = ""
    document.body.style.margin = "0"
    const img = document.createElement("img")
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    img.dataset.testid = "badge"
    document.body.append(img)
    await img.decode()
    return page.getByTestId("badge")
}

describe("badge screenshots", () => {
    it("found the SVG snapshots", () => {
        expect(cases.length).toBeGreaterThan(0)
    })

    it.each(cases)("%s", async (name, svg) => {
        await expect.element(await mount(svg)).toMatchScreenshot(name)
    })
})
