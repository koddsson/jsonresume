const request = require('supertest')
const app = require('../../app')

describe('GET /:username', () => {
	test('should render the correct resume', async () => {
		const response = await request(app).get('/koddsson')
		expect(response.statusCode).toBe(200)
	})
})
