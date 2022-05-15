import test from 'node:test';

import request from 'supertest'
import {expect} from 'chai'
import app from '../app.js'

test('/', async t => {
  await t.test('should redirect to the homepage', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).to.be.eql(200)
  })
})
