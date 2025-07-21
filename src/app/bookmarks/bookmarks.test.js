import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Bookmarks from './page';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));

describe('Bookmarks Page', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'testtoken');
    global.fetch = jest.fn((url, opts) => {
      if (opts && opts.method === 'POST') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ _id: '1', url: 'https://test.com', title: 'Test', favicon: '', summary: 'Summary', tags: ['tag'] }) });
      }
      if (opts && opts.method === 'DELETE') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([{ _id: '1', url: 'https://test.com', title: 'Test', favicon: '', summary: 'Summary', tags: ['tag'] }]) });
    });
  });

  it('renders bookmarks list', async () => {
    render(<Bookmarks />);
    await waitFor(() => expect(screen.getByText(/Your Bookmarks/i)).toBeInTheDocument());
    expect(screen.getByText(/Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Summary/i)).toBeInTheDocument();
  });

  it('adds a bookmark', async () => {
    render(<Bookmarks />);
    fireEvent.change(screen.getByPlaceholderText(/Paste URL/i), { target: { value: 'https://test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Tags/i), { target: { value: 'tag' } });
    fireEvent.click(screen.getByText(/Add/i));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      '/api/bookmarks',
      expect.objectContaining({ method: 'POST' })
    ));
  });

  it('deletes a bookmark', async () => {
    render(<Bookmarks />);
    await waitFor(() => expect(screen.getByText(/Delete/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Delete/i));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      '/api/bookmarks',
      expect.objectContaining({ method: 'DELETE' })
    ));
  });
}); 