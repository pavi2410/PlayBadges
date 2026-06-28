import { serve } from '@hono/node-server'
import app from './index.js'

const port = Number(process.env.PORT ?? 8787)

serve({
    fetch: (request) =>
        app.fetch(request, { NODE_ENV: process.env.NODE_ENV ?? 'development' }),
    port,
}, (info) => {
    console.log(`Listening on http://localhost:${info.port}`)
})
