const request = require('supertest')
const app = require('../../app')
const testResume = require('../../test_documents/test.json')

jest.mock('crypto')

describe('POST /:username', () => {
	test('it should error when the POST has empty body', async () => {
		const response = await request(app).post('/new-user')
		expect(response.statusCode).toBe(400)
		expect(response.body.errors).toEqual([
			'You need to post data to this endpoint',
		])
	})

	test('it rejects first time uploads that are missing a auth header', async () => {
		const response = await request(app)
			.post('/new-user')
			.send(testResume)
		expect(response.statusCode).toBe(400)
		expect(response.body.errors).toEqual([
			'You need to supply a password via the `auth` header on first upload.',
		])
	})

	test('it should accept a valid JSON resume via POST', async () => {
		const response = await request(app)
			.post('/new-user')
			.set({ auth: 'new-user' })
			.send(testResume)
		expect(response.statusCode).toBe(302)
		expect(response.headers.location).toBe(
			'https://jsonresume.ams3.digitaloceanspaces.com/new-user',
		)
		expect(response.body.errors).toEqual([])
	})

	test('it should reject invalid JSON resume via POST', async () => {
		const response = await request(app)
			.post('/new-user')
			.set({ auth: 'new-user' })
			.send({ foo: 'bar' })
		expect(response.statusCode).toBe(400)
		expect(response.body.errors).toEqual([
			'The root JSON should NOT have additional properties: foo',
		])
	})

	test('it rejects updates when auth fails', async () => {
		const response = await request(app)
			.post('/existing-user')
			.set({ auth: 'other-user' })
			.send(testResume)
		expect(response.statusCode).toBe(401)
	})

	test('it accepts updates when auth checks out', async () => {
		const response = await request(app)
			.post('/existing-user')
			.set({ auth: 'existing-user' })
			.send(testResume)
		expect(response.body.errors).toEqual([])
	})
})
