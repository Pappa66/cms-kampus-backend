const express = require('express');
const router = express.Router();
// --- PERBAIKAN: Impor semua fungsi yang diperlukan ---
const { 
  getUsers, 
  createUser, 
  bulkCreateUsers, 
  updateUser, 
  deleteUser, 
  resetPassword 
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/').get(protect, isAdmin, getUsers).post(protect, isAdmin, createUser);
router.route('/bulk').post(protect, isAdmin, bulkCreateUsers);
router.route('/:id')
  .put(protect, isAdmin, updateUser)
  .delete(protect, isAdmin, deleteUser);
router.route('/:id/reset-password')
  .put(protect, isAdmin, resetPassword);

module.exports = router;
