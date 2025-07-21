import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from './page';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));

describe('Signup Page', () => {
  it('renders signup form', () => {
    render(<Signup />);
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });

  it('shows error on failed registration', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({ error: 'Registration failed' }) })
    );
    render(<Signup />);
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByText(/Sign Up/i));
    await waitFor(() => expect(screen.getByText(/Registration failed/i)).toBeInTheDocument());
  });
}); 