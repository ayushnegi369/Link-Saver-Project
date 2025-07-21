// Signup page for Link Saver + Auto-Summary
// Handles user registration, validation, and redirects if already logged in.
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Validates email format using a simple regex.
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Signup() {
  // State for form fields, error, success, and loading
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect to /bookmarks if already logged in
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.replace('/bookmarks');
    }
  }, [router]);

  /**
   * Handles form submission for signup.
   * Validates input, calls API, and manages loading/error state.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => router.push('/login'), 1500);
    } else {
      setError(data.error || 'Registration failed');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-0">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-6">Sign Up</h2>
        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            required
            disabled={loading}
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow transition disabled:opacity-60" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
          {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
          {success && <div className="text-green-600 text-sm font-semibold">{success}</div>}
        </form>
        {/* Link to Login */}
        <div className="mt-6 text-sm">
          Already have an account? <Link href="/login" className="text-blue-600 underline">Login</Link>
        </div>
      </div>
    </main>
  );
} 