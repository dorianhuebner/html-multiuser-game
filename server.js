// Server for the multiuser game
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
  });

// Game state
const gameState = {
  users: [],
  isRoundActive: false,
  words: ['apple', 'banana', 'carrot', 'diamond', 'elephant', 'flamingo', 'giraffe', 'hamburger', 'igloo', 'jaguar'],
  mainWord: '',
  oddOneOutUser: null,
  oddOneOutWord: 'IMPOSTOR' // The different word for one user
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user sign up
  socket.on('signup', (username) => {
    // Check if username already exists
    if (gameState.users.some(user => user.username === username)) {
      socket.emit('signup-error', 'Username already taken');
      return;
    }

    // Add user to game state
    const newUser = {
      id: socket.id,
      username,
      isReady: false
    };
    
    gameState.users.push(newUser);
    
    // Send confirmation to the user
    socket.emit('signup-success', { userId: socket.id, username });
    
    // Broadcast updated user list to all clients
    io.emit('update-users', gameState.users);
    
    console.log(`User ${username} signed up`);
  });

  // Handle start round
  socket.on('start-round', () => {
    if (gameState.users.length < 2) {
      socket.emit('game-error', 'Need at least 2 players to start');
      return;
    }

    if (gameState.isRoundActive) {
      socket.emit('game-error', 'Round already in progress');
      return;
    }

    // Set up the round
    gameState.isRoundActive = true;
    
    // Choose a random word
    const randomIndex = Math.floor(Math.random() * gameState.words.length);
    gameState.mainWord = gameState.words[randomIndex];
    
    // Choose a random user to be the odd one out
    const randomUserIndex = Math.floor(Math.random() * gameState.users.length);
    gameState.oddOneOutUser = gameState.users[randomUserIndex].id;

    console.log(`Round started! Main word: ${gameState.mainWord}`);
    console.log(`Odd one out: ${gameState.users[randomUserIndex].username}`);

    // Send words to all users
    gameState.users.forEach(user => {
      const wordToSend = user.id === gameState.oddOneOutUser ? gameState.oddOneOutWord : gameState.mainWord;
      io.to(user.id).emit('word-assigned', wordToSend);
    });

    // Notify all users that round has started
    io.emit('round-started');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // Remove user from game state
    const userIndex = gameState.users.findIndex(user => user.id === socket.id);
    
    if (userIndex !== -1) {
      const username = gameState.users[userIndex].username;
      gameState.users.splice(userIndex, 1);
      console.log(`User ${username} disconnected`);
      
      // Broadcast updated user list
      io.emit('update-users', gameState.users);
      
      // If odd one out disconnected during active round, end the round
      if (gameState.isRoundActive && socket.id === gameState.oddOneOutUser) {
        gameState.isRoundActive = false;
        io.emit('round-ended', 'The odd one out left the game');
      }
    }
  });

  // Reset game
  socket.on('reset-game', () => {
    gameState.isRoundActive = false;
    gameState.mainWord = '';
    gameState.oddOneOutUser = null;
    io.emit('game-reset');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});