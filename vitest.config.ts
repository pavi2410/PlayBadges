import { defineConfig } from "vitest/config"
import { playwright } from "@vitest/browser-playwright"

export default defineConfig({
  plugins: [
    {
      name: "html-as-text",
      transform(code, id) {
        if (!id.endsWith(".html")) return
        return {
          code: `export default ${JSON.stringify(code)}`,
          map: null,
        }
      },
    },
  ],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          include: ["test/**/*.test.ts"],
          exclude: ["test/**/*.browser.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: ["test/**/*.browser.test.ts"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
            viewport: { width: 800, height: 600 },
          },
        },
      },
    ],
  },
})
