import test from 'node:test';

import request from 'supertest'
import {expect} from 'chai'
import sinon from 'sinon'
import aws from 'aws-sdk'

import crypto from '../../lib/utils/crypto.js'
import app from '../../app.js'

import {S3} from '../../__mocks__/aws-sdk.js'

sinon.stub(crypto, 'encrypt').callsFake((publicKey, buffer) => buffer)
sinon.stub(crypto, 'decrypt').callsFake((publicKey, buffer) => buffer)
sinon.stub(aws, 'S3').callsFake(S3)

test('GET /:username', async t => {
  await t.test('should render the correct resume', async () => {
    const response = await request(app).get('/koddsson')
    expect(response.statusCode).to.be.eql(200)
  })

  await t.test("should show a 404 when the resume isn't found", async () => {
    const response = await request(app).get('/not-a-user')
    expect(response.statusCode).to.be.eql(404)
  })
})
