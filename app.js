import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'

import addResume from './lib/add-resume.js'
import getResume from './lib/get-resume.js'

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express()

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.sendFile(path.join(`${__dirname}/site/index.html`)))

app.use(express.static('public'))

app.get('/:username', getResume)
app.post('/:username', addResume)

export default app
