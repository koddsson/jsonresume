const request = require('supertest');
const app = require('../../app')
const testResume = require('../../test_documents/test.json')

describe('/:username', () => {
  test('it should error when the POST has empty body', async () => {
    const response = await request(app).post('/koddsson');
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toEqual(['You need to post data to this endpoint']);
  });
  test('it should accept a valid JSON resume via POST', async () => {
    const response = await request(app).post('/koddsson').send(testResume)
    expect(response.statusCode).toBe(200);
    expect(response.body.errors).toEqual([]);
  });
  test('it should reject invalid JSON resume via POST', async () => {
    const response = await request(app).post('/koddsson').send({foo: 'bar'})
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toEqual(['The root JSON should NOT have additional properties: foo']);
  });
})
