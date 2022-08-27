console.log('using node', process.version)

import express from 'express'
import logger from 'morgan'
import { default as gplayModule } from 'google-play-scraper'
import Database from '@replit/database'
import * as requestCountry from 'request-country'

const app = express()
const db = new Database()
const gplay = gplayModule.memoized({ maxAge: 1000 * 60 * 60 * 24 }) // 24 hrs

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

async function logAnalyticsEvent(key) {
  const value = await db.get(key)
  const newValue = parseInt(value ?? 0, 10) + 1
  await db.set(key, newValue)
}

app.use(logger('dev'))

app.get('/', (req, res) => {
  res.redirect('https://github.com/pavi2410/PlayBadges')
})

app.get('/health', (req, res) => {
  res.send('OK')
})

app.get('/analytics/:action([^/]+)', async (req, res) => {
  const {action} = req.params

  try {
    const matches = await db.list(`${action}_`)
    const data = {}
    for (let key of matches) {
      const newKey = key.substring(`${action}_`.length)
      data[newKey] = await db.get(key)
    }
    res.json({
      n: Object.keys(data).length,
      ids: data
    })
  } catch (e) {
    res.sendStatus(404)
  }
})

app.get('/badge/downloads', async (req, res) => {
  const {id, pretty, style} = req.query
  const isPretty = pretty !== undefined

  const countryCode = requestCountry.default(req)

  try {
    await logAnalyticsEvent('downloads_' + id)

    const appDetails = await gplay.app({appId: id, country: countryCode})
    res.redirect(shieldsURL({
      label: 'Downloads',
      message: `${isPretty ? appDetails.installs : appDetails.maxInstalls}`,
      style
    }))
  } catch (e) {
    res.sendStatus(404)
  }
})

app.get('/badge/ratings', async (req, res) => {
  const {id, pretty, style} = req.query
  const isPretty = pretty !== undefined

  const countryCode = requestCountry.default(req)

  try {
    await logAnalyticsEvent('ratings_' + id)

    const appDetails = await gplay.app({appId: id, country: countryCode})
    res.redirect(shieldsURL({
      label: 'Rating',
      message: isPretty ? `${makeStars(appDetails.score)}` : `${appDetails.scoreText}/5 (${appDetails.ratings})`,
      style
    }))
  } catch (e) {
    res.sendStatus(404)
  }
})

const port = process.env.PORT ?? 3000
app.listen(port, () => {
  console.log(`⚡ server started at http://localhost:${port}`);
})
