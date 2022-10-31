import { serve } from "https://deno.land/std@0.139.0/http/server.ts"
import { logger } from "https://deno.land/x/hono@v2.3.2/middleware.ts"
import app from './index.js'

app.use('*', logger())

console.log('startup time', performance.now(), 'ms')
serve(app.fetch, {
    port: 2410
})
