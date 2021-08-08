console.log('using node', process.version)

const fsp = require('fs').promises
const express = require('express');
const logger = require('morgan')
const gplay = require('google-play-scraper');
const marked = require("marked")
const Database = require("@replit/database")

const app = express();
const db = new Database()

function randomNumber() {
  return ('' + Math.random()).substring(2)
}

function shieldsURL({label, message}) {
  return `https://img.shields.io/static/v1?logo=google-play&color=00cc00&labelColor=0f0f23&label=${encodeURIComponent(label)}&message=${encodeURIComponent(message)}`
}

app.use(logger('dev'))

app.get('/', (req, res) => {
  fsp.readFile('./README.md')
    .then(text => text.toString())
    .then(markdown => marked(markdown))
    .then(html => res.send(html))
    .catch(e => res.sendStatus(404))
});

app.get('/analytics/:action([^/]+)', (req, res) => {
  const action = req.params.action
  db.list(`${action}_`)
    .then(async matches => {
      const data = {}
      for (key of matches) {
        const newKey = key.substring(`${action}_`.length)
        data[newKey] = await db.get(key)
      }
      return data
    })
    .then(v => {
      res.json({
        n: Object.keys(v).length,
        ids: v
      })
    })
    .catch(e => res.sendStatus(404))
})

app.get('/badge/downloads', (req, res) => {
  const id = req.query.id

  const key = "downloads_" + id

  db.get(key)
    .then(value => {
      if (value === null) value = 0 // value ??= 0
      const newValue = parseInt(value, 10) + 1
      return db.set(key, newValue)
    })
    .then(() => gplay.app({appId: id}))
    .then(appDetails => {
      res.redirect(shieldsURL({
        "label": "Downloads",
        "message": `${appDetails.maxInstalls}`,
      }))
    })
    .catch(e => res.sendStatus(404))
});

app.get('/badge/ratings', (req, res) => {
  const id = req.query.id

  const key = "ratings_" + id

  db.get(key)
    .then(value => {
      if (value === null) value = 0 // value ??= 0
      const newValue = parseInt(value, 10) + 1
      return db.set(key, newValue)
    })
    .then(() => gplay.app({appId: id}))
    .then(appDetails => {
      res.redirect(shieldsURL({
        "label": "Rating",
        "message": `${appDetails.scoreText}/5 (${appDetails.ratings})`
      }))
    })
    .catch(e => res.sendStatus(404))
});

app.listen(3000, () => {
  console.log('server started at http://localhost:3000');
});
