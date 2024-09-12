const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  const { stockSymbol, title, description, tags } = req.body;
  const userId = req.user.id;

  try {
    const newPost = new Post({
      userId,
      stockSymbol,
      title,
      description,
      tags,
    });

    const savedPost = await newPost.save();
    res.status(201).json({ success: true, postId: savedPost._id, message: 'Post created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error });
  }
};

exports.getAllPosts = async (req, res) => {
  const { stockSymbol, tags, sortBy } = req.query;

  let filter = {};
  if (stockSymbol) filter.stockSymbol = stockSymbol;
  if (tags) filter.tags = { $in: tags.split(',') };

  try {
    let posts = await Post.find(filter);

    if (sortBy === 'date') posts = posts.sort((a, b) => b.createdAt - a.createdAt);
    if (sortBy === 'likes') posts = posts.sort((a, b) => b.likes.length - a.likes.length);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error });
  }
};
