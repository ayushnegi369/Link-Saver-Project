// API route for MongoDB connection using Mongoose
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/link-saver';

export async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export async function GET() {
  await connectDB();
  return new Response(JSON.stringify({ status: 'connected' }), { status: 200 });
} 