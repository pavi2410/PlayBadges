import { init } from 'satori/wasm'
import initYoga from 'yoga-wasm-web/asm'

let satoriReady: Promise<void> | undefined

export async function ensureSatori() {
    if (satoriReady) return satoriReady

    satoriReady = (async () => {
        init(initYoga())
    })()

    return satoriReady
}
