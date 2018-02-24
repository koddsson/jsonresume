const express = require('express')
const bodyParser = require('body-parser')

const addResume = require('./lib/add-resume')
require('./lib/generate-resume')

const app = express()

// parse application/json
app.use(bodyParser.json())

app.post('/:username', addResume)

app.listen(3000, () => console.log('Example app listening on port 3000!'))
