const express = require('express')
const bodyParser = require('body-parser')

const addResume = require('./lib/add-resume')

const app = express()

// parse application/json
app.use(bodyParser.json())

app.post('/:username', addResume)

module.exports = app
