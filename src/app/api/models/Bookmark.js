import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  title: { type: String },
  favicon: { type: String },
  summary: { type: String },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema); 