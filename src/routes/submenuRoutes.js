const express = require('express');
const router = express.Router();
const { createSubMenuItem, deleteSubMenuItem } = require('../controllers/submenuController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, isAdmin, createSubMenuItem);

router.route('/:id')
    .delete(protect, isAdmin, deleteSubMenuItem);

module.exports = router;