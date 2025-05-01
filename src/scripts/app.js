const users = [];
let currentWord = '';
let currentUserIndex = 0;

// Event-Listener für das Sign-Up-Formular
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    if (username && !users.includes(username)) {
        users.push(username);
        updateUserList();
        document.getElementById('username').value = '';
    } else if (users.includes(username)) {
        alert('This username is already taken!');
    }
});

// Event-Listener für den Start-Button
document.getElementById('start-round').addEventListener('click', function() {
    if (users.length > 1) {
        startRound();
    } else {
        alert('Please sign up at least 2 users to start the round.');
    }
});

// Funktion, um die Runde zu starten
function startRound() {
    currentUserIndex = Math.floor(Math.random() * users.length);
    currentWord = generateRandomWord();
    displayWord();
    document.getElementById('game').style.display = 'block';
}

// Funktion, um ein zufälliges Wort zu generieren
function generateRandomWord() {
    const words = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
    return words[Math.floor(Math.random() * words.length)];
}

// Funktion, um das Wort anzuzeigen
function displayWord() {
    const wordDisplay = document.getElementById('word-display');
    wordDisplay.innerHTML = ''; // Reset the display

    users.forEach((user, index) => {
        const userWord = document.createElement('p');
        if (index === currentUserIndex) {
            userWord.innerText = `${user}: You are the Imposter!`;
        } else {
            userWord.innerText = `${user}: ${currentWord}`;
        }
        wordDisplay.appendChild(userWord);
    });
}

// Funktion, um die Benutzerliste zu aktualisieren
function updateUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        userList.appendChild(li);
    });
}