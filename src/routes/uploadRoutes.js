const express = require('express');
const path = require('path');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { uploadFile } = require('../controllers/uploadController');

const router = express.Router();

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/uploads/'); // Simpan file di folder 'public/uploads'
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// Route untuk upload. 'upload' adalah nama field yang diharapkan oleh CKFinder
router.post('/', upload.single('upload'), uploadFile);
//'/', protect, <-- nanti tambah
module.exports = router;