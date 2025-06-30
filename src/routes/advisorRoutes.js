const express = require('express');
const router = express.Router();
const { getAdvisedItems, approveItem } = require('../controllers/advisorController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Semua route di sini memerlukan login

router.route('/items').get(getAdvisedItems);
router.route('/items/:id/approve').put(approveItem);

module.exports = router;