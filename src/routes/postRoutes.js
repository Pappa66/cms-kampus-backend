const express = require('express');
const router = express.Router();
const { getPostById, updatePost } = require('../controllers/postController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Hanya admin yang bisa get by id (untuk editor) dan update
router.route('/:id')
    .get(protect, isAdmin, getPostById)
    .put(protect, isAdmin, updatePost);

module.exports = router;