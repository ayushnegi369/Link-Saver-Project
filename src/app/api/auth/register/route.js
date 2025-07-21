import { connectDB } from '../../route';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();
  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Email and password required' }), { status: 400 });
  }
  if (!validateEmail(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email format' }), { status: 400 });
  }
  if (password.length < 6) {
    return new Response(JSON.stringify({ error: 'Password must be at least 6 characters' }), { status: 400 });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    // Do not leak if user exists or not
    return new Response(JSON.stringify({ error: 'Registration failed' }), { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashed });
  await user.save();
  return new Response(JSON.stringify({ success: true }), { status: 201 });
} 