const request = require('supertest');
const app = require('../app');

describe('/', () => {
  test('should redirect to the homepage', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('https://github.com/koddsson/jsonresume-monorepo')
  });
})
