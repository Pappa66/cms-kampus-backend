const express = require('express');
const router = express.Router();
const { getAllRepositoryItems, createRepositoryItem, updateRepositoryItem, deleteRepositoryItem, getRepositoryItemById } = require('../controllers/repositoryController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getAllRepositoryItems)
  .post(protect, isAdmin, upload.array('files', 10), createRepositoryItem);

router.route('/:id')
  .get(getRepositoryItemById)
  .put(protect, isAdmin, updateRepositoryItem)
  .delete(protect, isAdmin, deleteRepositoryItem);

module.exports = router;