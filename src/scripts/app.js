// Client-side JavaScript for the multiuser game
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const signupForm = document.getElementById('signup-form');
    const usernameInput = document.getElementById('username');
    const signupSection = document.getElementById('signup');
    const gameSection = document.getElementById('game');
    const userList = document.getElementById('user-list');
    const wordDisplay = document.getElementById('word-display');
    const startRoundButton = document.getElementById('start-round');
    const resetGameButton = document.getElementById('reset-game');
    const statusMessage = document.getElementById('status-message');

    // Connect to the server with Socket.IO
    const socket = io();
    
    // Game state
    let currentUser = {
        id: null,
        username: null
    };
    
    // Event listeners
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        
        if (username) {
            // Send username to server
            socket.emit('signup', username);
        }
    });
    
    startRoundButton.addEventListener('click', () => {
        socket.emit('start-round');
    });

    resetGameButton.addEventListener('click', () => {
        socket.emit('reset-game');
    });
    
    // Socket.IO event handlers
    socket.on('connect', () => {
        console.log('Connected to server');
    });
    
    socket.on('signup-success', (user) => {
        currentUser = user;
        signupSection.style.display = 'block';
        gameSection.style.display = 'block';
        usernameInput.disabled = true;
        document.getElementById('signup-button').disabled = true;
        
        // Add message to show successful signup
        const statusArea = document.createElement('p');
        statusArea.id = 'status-message';
        statusArea.textContent = `Willkommen, ${user.username}! Du bist nun angemeldet.`;
        signupSection.appendChild(statusArea);
    });
    
    socket.on('signup-error', (errorMessage) => {
        alert(errorMessage);
    });
    
    socket.on('update-users', (users) => {
        // Clear the current user list
        userList.innerHTML = '';
        
        // Add all users to the list
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.username;
            
            // Highlight the current user
            if (user.id === currentUser.id) {
                li.classList.add('current-user');
            }
            
            userList.appendChild(li);
        });
    });
    
    socket.on('round-started', () => {
        startRoundButton.disabled = true;
        resetGameButton.style.display = 'block';
        
        // Update status message
        if (statusMessage) {
            statusMessage.textContent = 'Runde gestartet!';
        }
    });
    


    socket.on('word-assigned', (word) => {
        
        wordDisplay.textContent = `Dein Wort: ${word}`;
        wordDisplay.classList.add('active');
    });
    
    socket.on('game-error', (errorMessage) => {
        alert(`Game error: ${errorMessage}`);
    });
    
    socket.on('round-ended', (message) => {
        wordDisplay.textContent = '';
        wordDisplay.classList.remove('active');
    
        // Re-enable the "Runde starten" button
        startRoundButton.disabled = false;
        startRoundButton.style.display = 'inline-block';
    
        if (message) {
            alert(message);
        }

        console.log('Game reset triggered round-ended');
console.log('Start Round Button:', startRoundButton.style.display, startRoundButton.disabled);
    });
    
    socket.on('game-reset', () => {
        // Show both sections
        signupSection.style.display = 'block';
        gameSection.style.display = 'block';
        
        // Clear the word display
        wordDisplay.textContent = '';
        wordDisplay.classList.remove('active');
        
        // Enable and show the start button
        startRoundButton.disabled = false;
        startRoundButton.style.display = 'inline-block';
        
        // Hide the reset button
        resetGameButton.style.display = 'none';
        
        // Keep the username input disabled
        usernameInput.disabled = true;
        document.getElementById('signup-button').disabled = true;
        
        // Update status message
        if (statusMessage) {
            statusMessage.textContent = 'Das Spiel wurde zurückgesetzt. Bereit für eine neue Runde!';
        }
    });
    
    socket.on('disconnect', () => {
        console.log('hat verlassen.');
    });
});