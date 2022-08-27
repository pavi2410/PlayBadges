console.log('using node', process.version)

import express from 'express'
import logger from 'morgan'
import { default as gplayModule } from 'google-play-scraper'
import * as requestCountry from 'request-country'
import { MongoClient } from 'mongodb'
import 'dotenv/config'

const app = express()
const gplay = gplayModule.memoized({ maxAge: 1000 * 60 * 60 * 24 }) // 24 hrs
const mongo = new MongoClient(process.env.DB_URL);
const db = mongo.db("playbadges");
const stats = db.collection("stats")

function shieldsURL({label, message, style}) {
  const url = new URL('https://img.shields.io/static/v1')
  url.searchParams.append('logo', 'google-play')
  url.searchParams.append('color', '00cc00')
  url.searchParams.append('labelColor', '0f0f23')
  url.searchParams.append('label', label)
  url.searchParams.append('message', message)
  if (style) url.searchParams.append('style', style)
  return url.toString()
}

function makeStars(score) {
  const left = Math.round(score)
  const right = 5 - left
  return ('★').repeat(left) + ('☆').repeat(right)
}

async function collectStats(type, packageName) {
  await stats.updateOne(
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
    const [{ n, t }] = await stats.aggregate([
      { $group: { _id: null, n: { $sum: 1 }, t: { $sum: '$count.all' } } }
    ]).toArray()

    // find top 10 apps ordered by count.all
    const docs = await stats.find({}).sort({'count.all': -1}).limit(10).project({ _id: 0 }).toArray()
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
    const [{ n, t }] = await stats.aggregate([
      { $group: { _id: null, n: { $sum: 1 }, t: { $sum: '$count.all' } } }
    ]).toArray()

    res.redirect(shieldsURL({
      label: 'Usage',
      message: `${t} (${n} apps)`,
    }))
  } catch (e) {
    res.redirect(shieldsURL({
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
    res.redirect(shieldsURL({
      label: 'Downloads',
      message: `${isPretty ? appDetails.installs : appDetails.maxInstalls}`,
      style
    }))

    await collectStats('downloads', id)
  } catch (e) {
    res.redirect(shieldsURL({
      label: 'Downloads',
      message: 'error',
      style
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
    res.redirect(shieldsURL({
      label: 'Ratings',
      message: isPretty ? makeStars(appDetails.score) : `${appDetails.scoreText}/5 (${appDetails.ratings})`,
      style
    }))

    await collectStats('ratings', id)
  } catch (e) {
    res.redirect(shieldsURL({
      label: 'Rating',
      message: 'error',
      style
    }))
    console.error(e)
  }
})

const port = process.env.PORT ?? 3000
app.listen(port, () => {
  console.log(`⚡ server started at http://localhost:${port}`);
})
