console.log('using node', process.version)

import {readFile} from 'node:fs/promises'
import express from 'express'
import logger from 'morgan'
import { default as gplayModule } from 'google-play-scraper'
import marked from 'marked'
import Database from '@replit/database'

const app = express()
const db = new Database()
const gplay = gplayModule.memoized({ maxAge: 1000 * 60 * 60 * 24 }) // 24 hrs

function shieldsURL({label, message, style}) {
  let url = `https://img.shields.io/static/v1?logo=google-play&color=00cc00&labelColor=0f0f23&label=${encodeURIComponent(label)}&message=${encodeURIComponent(message)}`;
  if (style) url += `&style=${encodeURIComponent(style)}`
  return url
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

app.get('/', async (req, res) => {
  try {
    const text = await readFile('./README.md')
    const md = await text.toString()
    const html = await marked(md)
    res.send(html)
  } catch (e) {
    res.sendStatus(404)
  }
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

  try {
    await logAnalyticsEvent('downloads_' + id)

    const appDetails = await gplay.app({appId: id})
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

  try {
    await logAnalyticsEvent('ratings_' + id)

    const appDetails = await gplay.app({appId: id})
    res.redirect(shieldsURL({
      label: 'Rating',
      message: isPretty ? `${makeStars(appDetails.score)}` : `${appDetails.scoreText}/5 (${appDetails.ratings})`,
      style
    }))
  } catch (e) {
    res.sendStatus(404)
  }
})

app.listen(3000, () => {
  console.log('server started at http://localhost:3000');
})
