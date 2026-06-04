import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { isDbConnected } from './config/mongoose.config.js';
import morgan from 'morgan';
import path from 'path';
import dbConnect from './config/mongoose.config.js';
import { requireDb } from './middlewares/dbMiddleware.js';
import Router from './routes/routes.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 9999;

// ── Middleware ──
app.use(morgan('dev'));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static files (uploaded product/banner images) ──
app.use('/images', express.static(path.join(process.cwd(), 'upload/images')));

// ── Connect to MongoDB ──
dbConnect();

// ── API Routes ──
app.use('/api', requireDb, Router);

// ── Health check ──
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopEase API is running',
    database: isDbConnected() ? 'connected' : 'disconnected',
  });
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ── Start server ──
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} already in use. Run: npx kill-port ${PORT}`);
    console.error('   Or close the other terminal where server is running.');
  } else {
    console.error('❌ Server error:', err.message);
  }
  process.exit(1);
});
