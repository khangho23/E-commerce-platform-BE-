const request = require('supertest');
const app = require('../../../app'); // Assuming app.js exports the express app

describe('Index Route', () => {
  it('should return 404 for undefined routes', async () => {
    const res = await request(app).get('/undefined-route');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ message: 'Not Found' });
  });

  it('should return a welcome message for the root route', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Welcome to the API' });
  });
});