jest.mock('../src/services/userService', () => ({ findByEmail: jest.fn() }));
jest.mock('bcryptjs', () => ({ compare: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn(() => 'signed.jwt') }));

const { login } = require('../src/controllers/auth.controller');
const users = require('../src/services/userService');
const bcrypt = require('bcryptjs');

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('login controller (unit)', () => {
  test('400 when fields missing', async () => {
    const req = { body: { email: '' } };
    const res = mockRes();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('401 when user not found', async () => {
    users.findByEmail.mockResolvedValue(null);
    const req = { body: { email: 'a@b.com', password: 'x' } };
    const res = mockRes();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('200 returns token on success', async () => {
    users.findByEmail.mockResolvedValue({ id: 1, passwordHash: 'h' });
    bcrypt.compare.mockResolvedValue(true);
    const req = { body: { email: 'a@b.com', password: 'pw' } };
    const res = mockRes();
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: 'signed.jwt' });
  });
});
