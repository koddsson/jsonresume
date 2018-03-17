const request = require('supertest')
const app = require('../app')

describe('/', () => {
	test('should redirect to the homepage', async () => {
		const response = await request(app).get('/')
		expect(response.statusCode).toBe(200)
	})
})
