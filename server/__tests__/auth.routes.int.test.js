const request = require('supertest');
jest.mock('../src/services/userService', () => ({ findByEmail: jest.fn() }));
jest.mock('bcryptjs', () => ({ compare: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn(() => 't.ok'), verify: jest.fn(() => ({ id: 1 })) }));

const app = require('../src/app');
const users = require('../src/services/userService');
const bcrypt = require('bcryptjs');

describe('Auth routes (integration)', () => {
  test('POST /api/auth/login 200', async () => {
    users.findByEmail.mockResolvedValue({ id: 1, passwordHash: 'h' });
    bcrypt.compare.mockResolvedValue(true);
    const res = await request(app).post('/api/auth/login').send({ email: 'e@x.com', password: 'pw' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBe('t.ok');
  });

  test('GET /api/auth/me requires token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me 200 with token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer t.ok');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1 });
  });
});
