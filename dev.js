import { serve } from '@honojs/node-server'
import app from './index.js'

const port = process.env.PORT ?? 2410

console.log('using node', process.version)
console.log('startup time', performance.now(), 'ms')
console.log(`⚡ server started at http://localhost:${port}`);
serve({
    app: app.fetch,
    port
})
