// Home page for Link Saver + Auto-Summary app.
// Provides a hero section, navigation to login, signup, and bookmarks, and author details.
// Shows/hides buttons based on authentication status. Includes logout logic.
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  // State to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // On mount, check for JWT token to determine login status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(!!localStorage.getItem('token'));
    }
  }, []);

  /**
   * Logs out the user by removing the JWT token and redirecting to login.
   */
  function handleLogout() {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-0">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-8 py-24 px-4 w-full">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 dark:text-blue-300 text-center mb-4 drop-shadow-lg">Link Saver + Auto-Summary</h1>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 text-center max-w-2xl mb-8">Save, auto-summarize, and organize your favorite links with ease. Secure, fast, and beautiful. Powered by Next.js, MongoDB, and Jina AI.</p>
        {/* Navigation Buttons */}
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          <Link href="/bookmarks" className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-lg font-semibold shadow transition hover:bg-gray-300 dark:hover:bg-gray-700 text-center">View Bookmarks</Link>
          {/* Show Login/Signup only if not logged in */}
          {!isLoggedIn && <>
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold shadow transition text-center">Login</Link>
            <Link href="/signup" className="bg-white dark:bg-gray-900 border border-blue-600 dark:border-blue-300 text-blue-700 dark:text-blue-300 px-8 py-4 rounded-lg font-semibold shadow transition hover:bg-blue-50 dark:hover:bg-gray-800 text-center">Sign Up</Link>
          </>}
          {/* Show Logout only if logged in */}
          {isLoggedIn && <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold shadow transition text-center">Logout</button>}
        </div>
      </section>
      {/* Author Details Section */}
      <section className="w-full flex justify-center mt-12 mb-8">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 max-w-xl w-full flex flex-col items-center">
          <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">Project by Ayush Negi</h3>
          <div className="text-gray-700 dark:text-gray-200 text-center mb-2">Email: <a href="mailto:ayushnegi369@gmail.com" className="underline text-blue-600">ayushnegi369@gmail.com</a></div>
          <div className="text-gray-700 dark:text-gray-200 text-center mb-2">Portfolio: <a href="https://ayushnegi22.vercel.app" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">ayushnegi22.vercel.app</a></div>
          <div className="text-gray-700 dark:text-gray-200 text-center">Contact No: <span className="font-semibold">+918368465119</span></div>
        </div>
      </section>
    </main>
  );
}
