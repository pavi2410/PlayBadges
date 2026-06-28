import { init } from 'satori/wasm'
import initYoga from 'yoga-wasm-web'

let satoriReady: Promise<void> | undefined

export async function ensureSatori() {
    if (satoriReady) return satoriReady

    satoriReady = (async () => {
        const wasm = await loadYogaWasm()
        init(await initYoga(wasm))
    })()

    return satoriReady
}

async function loadYogaWasm() {
    if (typeof process !== 'undefined' && process.versions?.node) {
        const { readFileSync } = await import('node:fs')
        const { createRequire } = await import('node:module')
        const require = createRequire(import.meta.url)
        return readFileSync(require.resolve('yoga-wasm-web/dist/yoga.wasm'))
    }

    const { default: yogaWasm } = await import('yoga-wasm-web/dist/yoga.wasm')
    return yogaWasm
}
