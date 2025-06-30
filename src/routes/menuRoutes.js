const express = require('express');
const router = express.Router();
const { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getMenuItems)
    .post(protect, isAdmin, createMenuItem);

router.route('/:id')
    .put(protect, isAdmin, updateMenuItem)
    .delete(protect, isAdmin, deleteMenuItem);

module.exports = router;