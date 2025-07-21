// API route for bookmarks CRUD operations for Link Saver + Auto-Summary
// Handles GET (list), POST (add with summary), and DELETE (remove) bookmarks for authenticated users.
// Uses JWT for authentication and fetches summary from Jina AI.
import { connectDB } from '../route';
import Bookmark from '../models/Bookmark';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

/**
 * Extracts userId from JWT in the Authorization header.
 * @param {Request} req
 * @returns {string|null}
 */
async function getUserIdFromToken(req) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

/**
 * GET: List all bookmarks for the authenticated user.
 */
export async function GET(req) {
  await connectDB();
  const userId = await getUserIdFromToken(req);
  if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const bookmarks = await Bookmark.find({ user: userId }).sort({ createdAt: -1 });
  return new Response(JSON.stringify(bookmarks), { status: 200 });
}

/**
 * POST: Add a new bookmark for the authenticated user.
 * Fetches title, favicon, and summary using axios and Jina AI.
 */
export async function POST(req) {
  await connectDB();
  const userId = await getUserIdFromToken(req);
  if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const { url, tags } = await req.json();
  // Fetch title and favicon from the URL
  let title = url, favicon = '', summary = '';
  try {
    const { data } = await axios.get(url);
    const match = data.match(/<title>(.*?)<\/title>/i);
    if (match) title = match[1];
    const favMatch = data.match(/<link[^>]*rel=["']icon["'][^>]*href=["']([^"']+)["']/i);
    if (favMatch) favicon = favMatch[1];
    else favicon = new URL('/favicon.ico', url).href;
    // Fetch summary from Jina AI
    const jina = await axios.post('https://r.jina.ai/', { url });
    summary = jina.data;
  } catch (e) {
    // If fetching fails, fallback to url as title and empty summary
  }
  const bookmark = new Bookmark({ user: userId, url, title, favicon, summary, tags });
  await bookmark.save();
  return new Response(JSON.stringify(bookmark), { status: 201 });
}

/**
 * DELETE: Remove a bookmark by ID for the authenticated user.
 */
export async function DELETE(req) {
  await connectDB();
  const userId = await getUserIdFromToken(req);
  if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  const { id } = await req.json();
  await Bookmark.deleteOne({ _id: id, user: userId });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
} 