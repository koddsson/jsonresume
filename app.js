const express = require('express')
const bodyParser = require('body-parser')

const addResume = require('./lib/add-resume')

const app = express()

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.redirect('https://github.com/koddsson/jsonresume-monorepo'))
app.post('/:username', addResume)

module.exports = app
