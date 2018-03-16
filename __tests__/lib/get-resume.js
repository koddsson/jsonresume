const request = require('supertest')
const app = require('../../app')

describe('GET /:username', () => {
	test('should render the correct resume', async () => {
		const response = await request(app).get('/koddsson')
		expect(response.statusCode).toBe(200)
	})

	test("should show a 404 when the resume isn't found", async () => {
		const response = await request(app).get('/not-a-user')
		expect(response.statusCode).toBe(404)
	})
})
