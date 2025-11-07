/* MARKER: Counter.test.jsx loaded */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from '../Counter.jsx';

test('shows initial count 0', () => {
  render(<Counter />);
  expect(screen.getByRole('status')).toHaveTextContent('0');
});

test('increments, decrements (not below 0), and resets', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  const inc   = screen.getByRole('button', { name: /increment/i });
  const dec   = screen.getByRole('button', { name: /decrement/i });
  const reset = screen.getByRole('button', { name: /reset/i });
  const count = screen.getByRole('status');

  await user.click(inc);
  expect(count).toHaveTextContent('1');

  await user.click(inc);
  expect(count).toHaveTextContent('2');

  await user.click(dec);
  expect(count).toHaveTextContent('1');

  await user.click(reset);
  expect(count).toHaveTextContent('0');

  await user.click(dec); // should not go below 0
  expect(count).toHaveTextContent('0');
});
