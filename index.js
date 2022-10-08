import express from 'express'
import logger from 'morgan'
import { default as gplayModule } from 'google-play-scraper'
import * as requestCountry from 'request-country'
import { MongoClient } from 'mongodb'
import 'dotenv/config'
import { makeBadge } from 'badge-maker'

const app = express()
app.set('query parser', 'simple')
const gplay = gplayModule.memoized({ maxAge: 1000 * 60 * 60 * 24 }) // 24 hrs
if (!process.env.DB_URL) throw new Error('DB_URL not set')
const mongo = new MongoClient(process.env.DB_URL);
const db = mongo.db("playbadges");

// https://simpleicons.org/icons/googleplay.svg
const playStoreLogo = `<svg fill="#f5f5f5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google Play</title><path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"/></svg>`
const playStoreLogoDataUri = 'data:image/svg+xml;base64,' + Buffer.from(playStoreLogo).toString('base64')

function genBadge(format) {
  if (!format.style) delete format.style
  return makeBadge({
    color: '00cc00',
    labelColor: '0f0f23',
    logo: playStoreLogoDataUri,
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

app.use(logger('dev'))

app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.redirect('https://github.com/pavi2410/PlayBadges')
  } else {
    res.end('Hello World!')
  }
})

app.get('/health', (req, res) => {
  res.send('OK')
})

app.get('/stats.json', async (req, res) => {
  try {
    // get an object of count of package names and sum of counts
    const [{ n, t }] = await db.collection("stats").aggregate([
      { $group: { _id: null, n: { $sum: 1 }, t: { $sum: '$count.all' } } }
    ]).toArray()

    // find top 10 apps ordered by count.all
    const docs = await db.collection("stats").find({}).sort({'count.all': -1}).limit(10).project({ _id: 0 }).toArray()
    const stats = Object.fromEntries(docs.map(doc => [doc.packageName, doc.count]))
    
    res.json({ n, t, stats })
  } catch (e) {
    res.sendStatus(500)
    console.error(e)
  }
})

app.get('/stats', async (req, res) => {
  try {
    // get an object of count of package names and sum of counts
    const [{ n, t }] = await db.collection("stats").aggregate([
      { $group: { _id: null, n: { $sum: 1 }, t: { $sum: '$count.all' } } }
    ]).toArray()

    res.send(genBadge({
      label: 'Usage',
      message: `${t} (${n} apps)`,
    }))
  } catch (e) {
    res.send(genBadge({
      label: 'Usage',
      message: 'error'
    }))
    console.error(e)
  }
})

app.get('/badge/downloads', async (req, res) => {
  const {id, pretty, style} = req.query
  const isPretty = pretty !== undefined

  const countryCode = requestCountry.default(req)

  try {
    const appDetails = await gplay.app({appId: id, country: countryCode})
    res.send(genBadge({
      label: 'Downloads',
      message: `${isPretty ? appDetails.installs : appDetails.maxInstalls}`,
      style
    }))

    await collectStats('downloads', id)
  } catch (e) {
    res.send(genBadge({
      label: 'Downloads',
      message: 'error',
    }))
    console.error(e)
  }
})

app.get('/badge/ratings', async (req, res) => {
  const {id, pretty, style} = req.query
  const isPretty = pretty !== undefined

  const countryCode = requestCountry.default(req)

  try {
    const appDetails = await gplay.app({appId: id, country: countryCode})
    res.send(genBadge({
      label: 'Ratings',
      message: isPretty ? makeStars(appDetails.score) : `${appDetails.scoreText}/5 (${appDetails.ratings})`,
      style
    }))

    await collectStats('ratings', id)
  } catch (e) {
    res.send(genBadge({
      label: 'Rating',
      message: 'error',
    }))
    console.error(e)
  }
})

const port = process.env.PORT ?? 2410
app.listen(port, () => {
  console.log('using node', process.version)
  console.log('startup time', performance.now(), 'ms')
  console.log(`⚡ server started at http://localhost:${port}`);
})
