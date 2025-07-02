const express = require('express');
const router = express.Router();
// Tambahkan reorderMenuItems ke dalam import
const { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, reorderMenuItems } = require('../controllers/menuController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/reorder')
    .put(protect, isAdmin, reorderMenuItems);

router.route('/')
    .get(getMenuItems)
    .post(protect, isAdmin, createMenuItem);

router.route('/:id')
    .put(protect, isAdmin, updateMenuItem)
    .delete(protect, isAdmin, deleteMenuItem);

module.exports = router;
