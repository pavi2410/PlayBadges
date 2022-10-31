import { Hono } from "https://deno.land/x/hono@v2.3.2/mod.ts"
import badgen from "https://esm.sh/badgen@3.2.2"
import { fetchAppDetails } from './src/google-play-scraper.js'
 

const app = new Hono()
// if (!process.env.DB_URL) throw new Error('DB_URL not set')
// const mongo = new MongoClient(process.env.DB_URL);
// const db = mongo.db("playbadges");

// https://simpleicons.org/icons/googleplay.svg
const playStoreLogo = `<svg fill="#f5f5f5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google Play</title><path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"/></svg>`
const playStoreLogoDataUri = 'data:image/svg+xml;base64,' + btoa(playStoreLogo)

function genBadge(format) {
  if (!format.style) delete format.style
  return badgen.badgen({
    color: '00cc00',
    labelColor: '0f0f23',
    icon: playStoreLogoDataUri,
    ...format
  })
}

function makeStars(score) {
  const left = Math.round(score)
  const right = 5 - left
  return ('★').repeat(left) + ('☆').repeat(right)
}

async function collectStats(type, packageName) {
  await db.collection("stats").updateOne(
    { packageName },
    { $inc: { ['count.'+type]: 1, 'count.all': 1 } },
    { upsert: true }
  )
}

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

app.get('/stats.json', async (c) => {
  try {
    // get an object of count of package names and sum of counts
    const [{ n, t }] = await db.collection("stats").aggregate([
      { $group: { _id: null, n: { $sum: 1 }, t: { $sum: '$count.all' } } }
    ]).toArray()

    // find top 10 apps ordered by count.all
    const docs = await db.collection("stats").find({}).sort({'count.all': -1}).limit(10).project({ _id: 0 }).toArray()
    const stats = Object.fromEntries(docs.map(doc => [doc.packageName, doc.count]))

    return c.json({ n, t, stats })
  } catch (e) {
    c.status(500)
    console.error('[Stats.json]', `${e.name}: ${e.message}`)
  }
})

app.get('/stats', async (c) => {
  try {
    // get an object of count of package names and sum of counts
    const [{ n, t }] = await db.collection("stats").aggregate([
      { $group: { _id: null, n: { $sum: 1 }, t: { $sum: '$count.all' } } }
    ]).toArray()

    c.header('Content-Type', 'image/svg+xml')
    return c.body(genBadge({
      label: 'Stats',
      message: `${t} (${n} apps)`,
    }))
  } catch (e) {
    c.header('Content-Type', 'image/svg+xml')
    return c.body(genBadge({
      label: 'Stats',
      message: `${e.name}: ${e.message}`
    }))
    console.error('[Stats]', `${e.name}: ${e.message}`)
  }
})

app.get('/badge/downloads', async (c) => {
  const {id, pretty, style} = c.req.query()
  const isPretty = pretty !== undefined

  const countryCode = c.req.cf?.country ?? 'US'

  try {
    const appDetails = await fetchAppDetails({appId: id, countryCode})
    c.header('Content-Type', 'image/svg+xml')
    return c.body(genBadge({
      label: 'Downloads',
      status: `${isPretty ? appDetails.installs : appDetails.maxInstalls}`,
      style
    }))

    await collectStats('downloads', id)
  } catch (e) {
    c.header('Content-Type', 'image/svg+xml')
    return c.body(genBadge({
      label: 'Downloads',
      status: `${e.name}: ${e.message}`,
    }))
    console.error('[Downloads]', `${e.name}: ${e.message}`)
  }
})

app.get('/badge/ratings', async (c) => {
  const {id, pretty, style} = c.req.query()

  const isPretty = pretty !== undefined

  const countryCode = c.req.cf?.country ?? 'US'

  try {
    const appDetails = await fetchAppDetails({appId: id, countryCode})
    c.header('Content-Type', 'image/svg+xml')
    return c.body(genBadge({
      label: 'Ratings',
      status: isPretty ? makeStars(appDetails.score) : `${appDetails.scoreText}/5 (${appDetails.ratings})`,
      style
    }))

    await collectStats('ratings', id)
  } catch (e) {
    c.header('Content-Type', 'image/svg+xml')
    return c.body(genBadge({
      label: 'Ratings',
      status: `${e.name}: ${e.message}`,
    }))
    console.error('[Ratings]', `${e.name}: ${e.message}`)
  }
})

export default app
