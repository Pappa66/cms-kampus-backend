const express = require('express');
const router = express.Router();
const { 
  getAllAdminRepositoryItems, 
  getAllRepositoryItems, 
  getRepositoryItemById, 
  createRepositoryItem, 
  updateRepositoryItem, 
  deleteRepositoryItem } = require('../controllers/repositoryController');
  
const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/admin').get(protect, isAdmin, getAllAdminRepositoryItems);
router.route('/').get(getAllRepositoryItems).post(protect, isAdmin, upload.array('files', 10), createRepositoryItem);
router.route('/:id').get(getRepositoryItemById).put(protect, isAdmin, updateRepositoryItem).delete(protect, isAdmin, deleteRepositoryItem);

module.exports = router;
