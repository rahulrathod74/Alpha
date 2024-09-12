const express = require('express');
const { createPost, getAllPosts } = require('../controllers/postController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createPost);
router.get('/', getAllPosts);

module.exports = router;
