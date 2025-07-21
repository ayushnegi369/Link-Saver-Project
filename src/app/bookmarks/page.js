// Bookmarks page for Link Saver + Auto-Summary
// Allows users to add, view, filter, delete, and reorder bookmarks with drag-and-drop.
// Fetches title, favicon, and summary for each URL. Supports tag filtering and copying data.
// Only accessible to authenticated users.
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Link from 'next/link';

/**
 * Button to copy text to clipboard with feedback.
 * @param {Object} props
 * @param {string} props.text - The text to copy
 * @param {string} props.label - Label for accessibility
 */
function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="ml-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      title={`Copy ${label}`}
    >
      {copied ? 'Copied!' : `Copy ${label}`}
    </button>
  );
}

export default function Bookmarks() {
  // State for bookmarks, form fields, error, loading, and tag filter
  const [bookmarks, setBookmarks] = useState([]);
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const router = useRouter();

  // Fetch bookmarks on mount
  useEffect(() => {
    fetchBookmarks();
  }, []);

  /**
   * Fetches bookmarks for the logged-in user.
   */
  async function fetchBookmarks() {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    const res = await fetch('/api/bookmarks', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setBookmarks(data);
    } else {
      setError('Failed to fetch bookmarks');
    }
    setLoading(false);
  }

  /**
   * Handles adding a new bookmark.
   * Calls the API to save the bookmark and refreshes the list.
   */
  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    const res = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url, tags: tags.split(',').map(t => t.trim()).filter(Boolean) }),
    });
    if (res.ok) {
      setUrl('');
      setTags('');
      fetchBookmarks();
    } else {
      setError('Failed to add bookmark');
    }
  }

  /**
   * Handles deleting a bookmark by ID.
   */
  async function handleDelete(id) {
    setError('');
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    const res = await fetch('/api/bookmarks', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      fetchBookmarks();
    } else {
      setError('Failed to delete bookmark');
    }
  }

  /**
   * Logs out the user and redirects to login.
   */
  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  /**
   * Handles drag-and-drop reordering of bookmarks.
   * Updates the order in local state.
   */
  function handleDragEnd(result) {
    if (!result.destination) return;
    const reordered = Array.from(filtered);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    if (filter) {
      const newBookmarks = [...bookmarks];
      filtered.forEach((b, i) => {
        const idx = newBookmarks.findIndex(x => x._id === b._id);
        if (idx !== -1) newBookmarks[idx] = reordered[i];
      });
      setBookmarks(newBookmarks);
    } else {
      setBookmarks(reordered);
    }
  }

  // Filter bookmarks by tag
  const filtered = filter
    ? bookmarks.filter(b => b.tags && b.tags.includes(filter))
    : bookmarks;

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-0">
      {/* Header Bar */}
      <header className="w-full flex items-center justify-between px-8 py-6 bg-white dark:bg-gray-900 shadow-md mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-blue-700 dark:text-blue-300">Link Saver</h2>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition">Logout</button>
      </header>

      {/* Add Bookmark Form */}
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 mb-8 w-full max-w-2xl bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <input
          type="url"
          placeholder="Paste URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
          className="w-60 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow transition">Add</button>
      </form>

      {/* Filter Input */}
      <div className="mb-6 w-full max-w-2xl">
        <input
          type="text"
          placeholder="Filter by tag"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {error && <div className="text-red-600 mb-4 font-semibold">{error}</div>}
      {loading ? (
        <div className="text-lg text-gray-700 dark:text-gray-200">Loading...</div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="bookmarks">
            {(provided) => (
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {/* Render each bookmark as a draggable card */}
                {filtered.map((b, idx) => (
                  <Draggable key={b._id} draggableId={b._id} index={idx}>
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 flex flex-col transition hover:shadow-2xl hover:-translate-y-1 duration-200 max-h-96 min-h-[180px]"
                      >
                        {/* Title, favicon, and link */}
                        <div className="flex items-center gap-3 mb-3">
                          {b.favicon && <img src={b.favicon} alt="favicon" className="w-8 h-8 rounded" />}
                          <a href={b.url} target="_blank" rel="noopener noreferrer" className="font-bold text-lg text-blue-700 dark:text-blue-300 underline truncate max-w-xs md:max-w-md">
                            {b.title || b.url}
                          </a>
                        </div>
                        {/* URL with copy button */}
                        <div className="flex items-center mb-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400 break-all select-all">{b.url}</span>
                          <CopyButton text={b.url} label="URL" />
                        </div>
                        {/* Summary with copy button, scrollable if long */}
                        <div className="flex-1 overflow-y-auto mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded max-h-32">
                          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line select-all">
                            {b.summary}
                          </div>
                          <CopyButton text={b.summary} label="Summary" />
                        </div>
                        {/* Tags */}
                        <div className="flex gap-2 flex-wrap mb-3">
                          {b.tags && b.tags.map(tag => (
                            <span key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-blue-200 dark:border-blue-800 select-all">{tag}</span>
                          ))}
                        </div>
                        {/* Delete button */}
                        <button onClick={() => handleDelete(b._id)} className="text-red-500 hover:text-red-700 text-xs self-end font-semibold transition">Delete</button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      {/* Footer with link to home */}
      <footer className="mt-16 mb-4 text-gray-500 text-xs">
        <Link href="/" className="underline">Back to Home</Link>
      </footer>
    </main>
  );
} 