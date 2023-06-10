import {Hono} from "hono"
import {fetchAppDetails} from './google-play-scraper.js'
import {fullBadge} from './full-badge.js'
import {shieldsBadge} from "./shields-badge";
import {compactNumberFormatter, makeStars} from "./utils";

type Bindings = {
    NODE_ENV: string
}

const app = new Hono<{ Bindings: Bindings }>({strict: false})

// async function collectStats(type: string, packageName: string) {
//     await db.collection("stats").updateOne(
//         {packageName},
//         {$inc: {['count.' + type]: 1, 'count.all': 1}},
//         {upsert: true}
//     )
// }

app.get('/', (c) => {
    if (c.env.NODE_ENV === 'production') {
        return c.redirect('https://github.com/pavi2410/PlayBadges')
    } else {
        return c.text('Hello World!')
    }
})

app.get('/health', (c) => {
    return c.text('OK')
})

// app.get('/stats.json', async (c) => {
//     try {
//         // get an object of count of package names and sum of counts
//         const [{n, t}] = await db.collection("stats").aggregate([
//             {$group: {_id: null, n: {$sum: 1}, t: {$sum: '$count.all'}}}
//         ]).toArray()
//
//         // find top 10 apps ordered by count.all
//         const docs = await db.collection("stats").find({}).sort({'count.all': -1}).limit(10).project({_id: 0}).toArray()
//         const stats = Object.fromEntries(docs.map(doc => [doc.packageName, doc.count]))
//
//         return c.json({n, t, stats})
//     } catch (e) {
//         c.status(500)
//         console.error('[Stats.json]', `${e.name}: ${e.message}`)
//     }
// })

// app.get('/stats', async (c) => {
//     try {
//         // get an object of count of package names and sum of counts
//         const [{n, t}] = await db.collection("stats").aggregate([
//             {$group: {_id: null, n: {$sum: 1}, t: {$sum: '$count.all'}}}
//         ]).toArray()
//
//         c.header('Content-Type', 'image/svg+xml')
//         return c.body(fullBadge({
//             label: 'Stats',
//             message: `${t} (${n} apps)`,
//         }))
//     } catch (e) {
//         c.header('Content-Type', 'image/svg+xml')
//         return c.body(fullBadge({
//             label: 'Stats',
//             message: `${e.name}: ${e.message}`
//         }))
//         console.error('[Stats]', `${e.name}: ${e.message}`)
//     }
// })


// GET /badge/downloads?id=<appId>&pretty
app.get('/badge/downloads', async (c) => {
    const {id: appId, pretty} = c.req.query()
    const isPretty = pretty !== undefined
    const countryCode = (c.req.raw.cf?.country as string | undefined) ?? 'US'

    const appDetails = await fetchAppDetails(appId, countryCode)

    if (!appDetails) {
        return c.text('App not found', 404)
    }

    c.header('Content-Type', 'image/svg+xml')
    return c.body(shieldsBadge({
        label: 'Downloads',
        status: `${isPretty ? compactNumberFormatter.format(parseFloat(appDetails.maxInstalls)) : appDetails.maxInstalls}`,
    }))
})

// GET /badge/ratings?id=<appId>&pretty
app.get('/badge/ratings', async (c) => {
    const {id: appId, pretty} = c.req.query()
    const isPretty = pretty !== undefined
    const countryCode = (c.req.raw.cf?.country as string | undefined) ?? 'US'

    const appDetails = await fetchAppDetails(appId, countryCode)

    if (!appDetails) {
        return c.text('App not found', 404)
    }

    c.header('Content-Type', 'image/svg+xml')
    return c.body(shieldsBadge({
        label: 'Ratings',
        status: isPretty ? makeStars(parseFloat(appDetails.score)) : `${appDetails.scoreText}/5 (${appDetails.ratings})`,
    }))
})

// GET /badge/full?id=<appId>
app.get('/badge/full', async (c) => {
    const {id: appId} = c.req.query()

    const appDetails = await fetchAppDetails(appId)

    if (!appDetails) {
        return c.text('App not found', 404)
    }

    c.header('Content-Type', 'image/svg+xml')
    return c.body(await fullBadge(appDetails))
})

export default app
