# HTML Multiuser Game

## Overview
This project is a web-based multiuser game that allows multiple users to sign up for a round. Once the round starts, all users will see the same word except for one person, creating an engaging and interactive experience.

## Project Structure
```
html-multiuser-game
├── src
│   ├── index.html          # Main HTML document
│   ├── styles
│   │   └── style.css       # Styles for the web page
│   ├── scripts
│   │   └── app.js          # Client-side JavaScript
├── server.js               # Node.js server with Socket.IO
├── package.json            # Node.js dependencies
├── Dockerfile              # Docker configuration
├── README.md               # Project documentation
```

## Features
- Real-time multiuser experience with Socket.IO
- User registration for signing up for a round
- Live updates of connected users
- A button to start the round
- Randomly selects one player to receive a different word
- Display of words to all users

## Getting Started

### Local Development
To set up and run the project locally, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   ```

2. **Navigate to the project directory**:
   ```
   cd html-multiuser-game
   ```

3. **Install dependencies**:
   ```
   npm install
   ```

4. **Start the server**:
   ```
   npm start
   ```

5. **Open your browser** and navigate to `http://localhost:3000` to access the game.

### Docker Deployment
To build and run the project using Docker:

1. **Build the Docker image**:
   ```
   docker build -t multiuser-game .
   ```

2. **Run the Docker container**:
   ```
   docker run -p 3000:3000 multiuser-game
   ```

3. **Access the game** at `http://localhost:3000`.

### Deployment on DigitalOcean
To deploy the game on DigitalOcean:

1. **Create a new Droplet** on DigitalOcean.

2. **Install Docker** on your Droplet if not already installed.

3. **Clone your repository** on the Droplet:
   ```
   git clone <repository-url>
   ```

4. **Navigate to your project directory**:
   ```
   cd html-multiuser-game
   ```

5. **Build and run using Docker**:
   ```
   docker build -t multiuser-game .
   docker run -p 80:3000 -d multiuser-game
   ```

6. **Access the game** via your Droplet's IP address.

## How to Play
1. Enter your username and sign up.
2. Wait for other players to join.
3. Once enough players have joined, anyone can click "Start Round".
4. Everyone will receive a word, but one player will receive a different word.
5. Players need to figure out who received the different word!

## Technologies Used
- HTML, CSS, JavaScript (Frontend)
- Node.js with Express (Backend)
- Socket.IO for real-time communication
- Docker for containerization

## Contributing
If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.x