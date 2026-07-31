import { defineConfig } from "vitest/config"

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
})
