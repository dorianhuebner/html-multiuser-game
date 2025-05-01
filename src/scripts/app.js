const users = [];
let currentWord = '';
let currentUserIndex = 0;

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    if (username && !users.includes(username)) {
        users.push(username);
        updateUserList();
        document.getElementById('username').value = '';
    }
});

document.getElementById('start-round').addEventListener('click', function() {
    if (users.length > 1) {
        startRound();
    } else {
        alert('Please sign up at least 2 users to start the round.');
    }
});

function startRound() {
    currentUserIndex = Math.floor(Math.random() * users.length);
    currentWord = generateRandomWord();
    displayWord();
}

function generateRandomWord() {
    const words = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
    return words[Math.floor(Math.random() * words.length)];
}

function displayWord() {
    users.forEach((user, index) => {
        if (index === currentUserIndex) {
            document.getElementById('word-display').innerText = 'You are out!';
        } else {
            document.getElementById('word-display').innerText = currentWord;
        }
    });
}

function updateUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        userList.appendChild(li);
    });
}