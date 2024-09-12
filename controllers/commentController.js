const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  const { comment } = req.body;
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const newComment = new Comment({
      postId,
      userId,
      comment,
    });

    const savedComment = await newComment.save();
    res.status(201).json({ success: true, commentId: savedComment._id, message: 'Comment added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error });
  }
};
