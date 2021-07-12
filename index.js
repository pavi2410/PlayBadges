const express = require('express');
const gplay = require('google-play-scraper');
const marked = require("marked")
const fetch = require("node-fetch")
const Database = require("@replit/database")

const app = express();
const db = new Database()

const selfURL = "https://PlayBadges.pavi2410.repl.co"
const randomNumber = () => ('' + Math.random()).substring(2)
const shieldsURL = (url) => `https://img.shields.io/endpoint?url=${url}&r=${randomNumber()}`
const README_URL = "https://raw.githubusercontent.com/pavi2410/PlayBadges/main/README.md"

app.get('/', (req, res) => {
  fetch(README_URL)
    .then(res => res.text())
    .then(markdown => {
      const html = marked(markdown)
      res.send(html)
    })
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

app.get('/downloads', (req, res) => {
  const id = req.query.id

  const key = "downloads_" + id

  db.get(key)
    .then(value => {
      if (value === null) value = 0 // value ??= 0
      const newValue = parseInt(value, 10) + 1
      return db.set(key, newValue)
    })
    .then(() => gplay.app({ appId: id }))
    .then(appDetails => {
      res.json({
        "schemaVersion": 1,
        "label": appDetails.title,
        "message": `${appDetails.maxInstalls} downloads`,
        "color": "green"
      })
    })
    .catch(e => res.sendStatus(404))
});

app.get('/ratings', (req, res) => {
  const id = req.query.id

  const key = "ratings_" + id

  db.get(key)
    .then(value => {
      if (value === null) value = 0 // value ??= 0
      const newValue = parseInt(value, 10) + 1
      return db.set(key, newValue)
    })
    .then(() => gplay.app({ appId: id }))
    .then(appDetails => {
      const score = Math.round(appDetails.score * 100) / 100

      res.json({
        "schemaVersion": 1,
        "label": appDetails.title,
        "message": `${score} stars`,
        "color": "green"
      })
    })
    .catch(e => res.sendStatus(404))
});

app.get('/:action([^/]+)/image', (req, res) => {
  const action = req.params.action
  const id = req.query.id

  const url = `${selfURL}/${action}?id=${id}`
  const redirectURL = shieldsURL(url)
  res.redirect(redirectURL)
});

app.listen(3000, () => {
  console.log('server started');
});