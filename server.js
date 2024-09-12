const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const socketIO = require('socket.io');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const { authMiddleware } = require('./middlewares/authMiddleware');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/:postId/comments', commentRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Socket.io setup
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');
  
  // You can handle real-time events here
  socket.on('newComment', (data) => {
    io.emit('commentAdded', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
