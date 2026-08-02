// Multer config for accepting a single image or audio file in memory
// (no disk writes needed — we forward the buffer straight to Flask).
import multer from 'multer';

const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024; // 12MB

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed on this endpoint.'));
    }
    cb(null, true);
  },
});

export const uploadAudio = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('audio/') && !file.mimetype.startsWith('video/webm')) {
      return cb(new Error('Only audio uploads are allowed on this endpoint.'));
    }
    cb(null, true);
  },
});
