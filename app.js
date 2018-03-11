const express = require('express')
const bodyParser = require('body-parser')

const addResume = require('./lib/add-resume')

const app = express()

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) =>
	res.redirect('https://github.com/koddsson/jsonresume-monorepo'),
)

app.get('/:username', (req, res) =>
	res.redirect(
		`https://jsonresume.ams3.digitaloceanspaces.com/${req.params.username}`,
	),
)
app.post('/:username', addResume)

module.exports = app
