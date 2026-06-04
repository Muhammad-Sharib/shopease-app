import { isDbConnected } from '../config/mongoose.config.js';

export const requireDb = (req, res, next) => {
  if (!isDbConnected()) {
    return res.status(503).json({
      message: 'Database not connected. Check server/.env MONGODB_URI and MongoDB Atlas Network Access.',
    });
  }
  next();
};
