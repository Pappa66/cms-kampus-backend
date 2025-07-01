const express = require('express');
const router = express.Router();
const { getPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getPosts); // getPosts tidak perlu proteksi jika ingin bisa diakses publik

router.route('/:id')
    .get(getPostById) // getPostById juga tidak perlu proteksi untuk halaman publik
    .put(protect, isAdmin, updatePost)
    .delete(protect, isAdmin, deletePost);

module.exports = router;