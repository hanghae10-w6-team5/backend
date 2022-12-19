const express = require('express');
const router = express.Router();
const CommentsController = require('../controllers/comments.controller');
const commentsController = new CommentsController();

router.post('/:postId/comments', commentsController.createComment);
router.patch('/:postId/comments/:commentId', commentsController.updateComment);
router.delete('/:postId/comments/:commentId');

module.exports = router;
