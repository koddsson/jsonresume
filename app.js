const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const addResume = require('./lib/add-resume')
const getResume = require('./lib/get-resume')

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) =>
	res.redirect('https://github.com/koddsson/jsonresume-monorepo'),
)

app.get('/:username', getResume)
app.post('/:username', addResume)

module.exports = app
