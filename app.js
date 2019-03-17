const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()

const addResume = require('./lib/add-resume')
const getResume = require('./lib/get-resume')

// parse application/json
app.use(bodyParser.json())

app.use(function(req, res, next) {
  if (!req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`)
  }
  next()
})

app.get('/', (req, res) => res.sendFile(path.join(`${__dirname}/site/index.html`)))

app.use(express.static('public'))

app.get('/:username', getResume)
app.post('/:username', addResume)

module.exports = app
