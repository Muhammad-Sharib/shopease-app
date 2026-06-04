import multer from 'multer';
import path from 'path';

// Multer storage configuration
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Multer instance
const upload = multer({ storage: storage });

export default upload;
