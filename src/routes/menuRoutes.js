const express = require('express');
const router = express.Router();
const { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getMenuItems)
    .post(protect, isAdmin, createMenuItem);

router.route('/:id')
    // --- PERUBAHAN SEMENTARA: Hapus 'protect' dan 'isAdmin' dari baris ini ---
    .put(updateMenuItem) 
    .delete(protect, isAdmin, deleteMenuItem);

module.exports = router;