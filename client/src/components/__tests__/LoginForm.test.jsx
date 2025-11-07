import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../LoginForm';

jest.mock('axios', () => ({ post: jest.fn(() => Promise.resolve({ data: { token: 't' } })) }));
import axios from 'axios';

describe('LoginForm', () => {
test('validates empty fields', async () => {
render(<LoginForm />);
await userEvent.click(screen.getByRole('button', { name: /login/i }));
expect(screen.getByRole('alert')).toHaveTextContent(/required/i);
});

test('submits and calls axios', async () => {
const onSuccess = jest.fn();
render(<LoginForm onSuccess={onSuccess} />);
await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com');
await userEvent.type(screen.getByLabelText(/password/i), 'pw');
await userEvent.click(screen.getByRole('button', { name: /login/i }));
expect(axios.post).toHaveBeenCalledWith('/api/auth/login', { email: 'a@b.com', password: 'pw' });
// wait for microtasks
await Promise.resolve();
expect(onSuccess).toHaveBeenCalledWith('t');
});
});