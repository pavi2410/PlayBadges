import {Hono} from "hono"
import {fetchAppDetails} from './google-play-scraper.js'
import {fullBadge} from './full-badge.js'
import {shieldsBadge} from "./shields-badge";
import {compactNumberFormatter, findCountryCode, makeStars} from "./utils";

type Bindings = {
    NODE_ENV: string
}

const app = new Hono<{ Bindings: Bindings }>({strict: false})

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

// GET /app/details?id=<appId>
app.get('/app/details', async (c) => {
    const {id: appId, country} = c.req.query()
    const countryCode = findCountryCode(
      country,
      c.req.raw.cf?.country as string | undefined
    );

    const appDetails = await fetchAppDetails(appId, countryCode)

    if (!appDetails) {
        return c.text('App not found', 404)
    }

    return c.json(appDetails)
})

// GET /badge/downloads?id=<appId>&pretty&country=<countryCode>
app.get('/badge/downloads', async (c) => {
    const {id: appId, pretty, country} = c.req.query()
    const isPretty = pretty !== undefined
    const countryCode = findCountryCode(
      country,
      c.req.raw.cf?.country as string | undefined
    );

    const appDetails = await fetchAppDetails(appId, countryCode)

    if (!appDetails) {
        return c.text('App not found', 404)
    }

    c.header('Content-Type', 'image/svg+xml')
    return c.body(shieldsBadge({
        label: 'Downloads',
        status: `${isPretty ? compactNumberFormatter.format(Number(appDetails.maxInstalls)) : appDetails.maxInstalls}`,
    }))
})

// GET /badge/ratings?id=<appId>&pretty&country=<countryCode>
app.get('/badge/ratings', async (c) => {
    const {id: appId, pretty, country} = c.req.query()
    const isPretty = pretty !== undefined
    const countryCode = findCountryCode(
      country,
      c.req.raw.cf?.country as string | undefined
    );    

    const appDetails = await fetchAppDetails(appId, countryCode)

    if (!appDetails) {
        return c.text('App not found', 404)
    }

    c.header('Content-Type', 'image/svg+xml')
    return c.body(shieldsBadge({
        label: 'Ratings',
        status: isPretty ? makeStars(Number(appDetails.score)) : `${appDetails.scoreText ?? 0}/5 (${appDetails.ratings ?? 0})`,
    }))
})

// GET /badge/full?id=<appId>&country=<countryCode>
app.get('/badge/full', async (c) => {
    const {id: appId, country} = c.req.query()
    const countryCode = findCountryCode(
      country,
      c.req.raw.cf?.country as string | undefined
    );

    const appDetails = await fetchAppDetails(appId, countryCode)

    if (!appDetails) {
        return c.text('App not found', 404)
    }

    c.header('Content-Type', 'image/svg+xml')
    return c.body(await fullBadge(appDetails))
})

export default app
