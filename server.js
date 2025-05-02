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
   words: [
    'Schwimmbad', 'Supermarkt', 'Zeltplatz', 'Autowerkstatt', 'Bibliothek', 'Krankenhaus',
    'Bäckerei', 'Tankstelle', 'Schule', 'Kindergarten', 'Post', 'Bank',
    'Zoo', 'Museum', 'Restaurant', 'Café', 'Fitnessstudio', 'Spielplatz',
    'Bahnhof', 'Flughafen', 'Wohnzimmer', 'Keller', 'Dachboden', 'Garage',
    'Abstellraum', 'Waschsalon', 'Garten', 'Wald', 'Wiese', 'Strand',
    'Park', 'Höhle', 'Marktplatz', 'Fußgängerzone', 'Hof', 'Terrasse',
    'Hütte', 'Scheune', 'Bauernhof', 'Aquarium', 'Rathaus', 'Friedhof',
    'Turnhalle', 'Einkaufszentrum', 'Sportplatz', 'Kiosk', 'Tankstelle',
    'Autobahn', 'U-Bahn', 'Bushaltestelle', 'Zug', 'Boot', 'Schiff',
    'Brücke', 'Tunnel', 'Lagerhalle', 'Baustelle', 'Müllhalde', 'Recyclinghof',
    'Fernsehstudio', 'Theater', 'Kino', 'Kantine', 'Konferenzraum', 'Empfang',
    'Hotel', 'Jugendherberge', 'Pension', 'Campingplatz', 'Lagerfeuer',
    'Almhütte', 'Wasserfall', 'Berghütte', 'Wanderweg', 'Skigebiet', 'See',
    'Insel', 'Leuchtturm', 'Staudamm', 'Schloss', 'Burg', 'Festung',
    'Raststätte', 'Grenze', 'Zollstation', 'Markthalle', 'Pavillon',
    'Zugabteil', 'Cockpit', 'Kontrollraum', 'Krankenstation', 'Apotheke',
    'Labor', 'Chemieraum', 'Computerraum', 'Lesesaal', 'Archiv', 'Lagerraum',
    'Sporthalle', 'Werkstatt', 'Maschinenraum', 'Küche', 'Speisekammer',
    'Esszimmer', 'Badezimmer', 'Toilette', 'Kinderzimmer', 'Schlafzimmer',
    'Balkon', 'Flur', 'Eingangshalle', 'Aufzug', 'Treppenhaus', 'Dachterrasse',
    'Konzerthalle', 'Diskothek', 'Club', 'Spielhalle', 'Bowlingbahn',
    'Eishalle', 'Kletterhalle', 'Hallenbad', 'Sauna', 'Therme',
    'Behandlungszimmer', 'Notaufnahme', 'Intensivstation', 'Wartezimmer',
    'Untersuchungsraum', 'Röntgenraum', 'Büro', 'Konferenzsaal', 'Chefzimmer',
    'Müllraum', 'Schulhof', 'Aula', 'Lehrerzimmer', 'Sekretariat',
    'Werkraum', 'Kunstraum', 'Musikraum', 'Turnraum', 'Proberaum',
    'Tanzstudio', 'Fotostudio', 'Tonstudio', 'Serverraum', 'Netzwerkschrank',
    'Druckerraum', 'Rechenzentrum', 'Stromkasten', 'Waschraum', 'Heizungsraum',
    'Luftschutzkeller', 'Tanklager', 'Abwasserkanal', 'Pumpstation', 'Wachturm',
    'Waffenlager', 'Trainingsplatz', 'Kasino', 'Speisesaal', 'Lagerfeuerplatz',
    'Grillplatz', 'Picknickwiese', 'Kreisverkehr', 'Fahrstuhl', 'Gleis',
    'Ladezone', 'Lieferanteneingang', 'Warenannahme', 'Paketzentrum', 'Briefkasten',
    'Karton', 'Regal', 'Treppe', 'Stuhl', 'Tisch', 'Lampe',
    'Fernseher', 'Computer', 'Smartphone', 'Tablet', 'Tastatur', 'Maus',
    'Buch', 'Heft', 'Stift', 'Uhr', 'Fenster', 'Tür',
    'Vorhang', 'Teppich', 'Bild', 'Spiegel', 'Blume', 'Vase',
    'Kissen', 'Decke', 'Schrank', 'Kleiderschrank', 'Kommode', 'Schublade',
    'Bett', 'Matratze', 'Koffer', 'Rucksack', 'Tasche', 'Geldbeutel',
    'Schlüssel', 'Brille', 'Hut', 'Jacke', 'Schuh', 'Handschuh',
    'Regenschirm', 'Fahrrad', 'Auto', 'Bus', 'Straßenbahn', 'Traktor',
    'Roller', 'Motorrad', 'Helm', 'Ampel'
  ],
    mainWord: '',
  oddOneOutUser: null,
  oddOneOutWord: 'Spion' // The different word for one user
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Benutzer hat sich angemeldet:', socket.id);

  // Handle user sign up
  socket.on('signup', (username) => {
    // Check if username already exists
    if (gameState.users.some(user => user.username === username)) {
      socket.emit('signup-error', 'Benutzername bereits vergeben');
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
    
    console.log(`Benutzer ${username} angemeldet`);
  });

  // Handle start round
  socket.on('start-round', () => {
    if (gameState.users.length < 4) {
      socket.emit('game-error', 'Mindestens 4 Spieler erforderlich, um eine Runde zu starten');
      return;
    }

    if (gameState.isRoundActive) {
      socket.emit('game-error', 'Runde läuft bereits');
      return;
    }

    // Set up the round
    gameState.isRoundActive = true;
    
    // Choose a random word
    const randomIndex = Math.floor(Math.random() * gameState.words.length);
    gameState.mainWord = gameState.words[randomIndex];
    
    // Suche nach der Stelle, wo die Wörter an die Benutzer gesendet werden (Zeile 112-115):
    gameState.users.forEach(user => {
        const wordToSend = {
        word: user.id === gameState.oddOneOutUser ? gameState.oddOneOutWord : gameState.mainWord,
        highlight: user.id === gameState.oddOneOutUser // Highlight nur für den "Odd One Out"
        };
        io.to(user.id).emit('word-assigned', wordToSend);
    });
    
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