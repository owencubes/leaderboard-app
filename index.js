const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3001;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (your HTML, JS, etc.)

// Path to the leaderboard file
const leaderboardFilePath = './leaderboard.json';

// Read leaderboard data from file
function readLeaderboard() {
    if (fs.existsSync(leaderboardFilePath)) {
        const data = fs.readFileSync(leaderboardFilePath);
        return JSON.parse(data);
    }
    return {}; // Return empty object if file doesn't exist
}

// Save leaderboard data to file
function saveLeaderboard(leaderboard) {
    fs.writeFileSync(leaderboardFilePath, JSON.stringify(leaderboard, null, 2));
}

// API to get the leaderboard data, sorted by score in descending order
app.get('/api/leaderboard', (req, res) => {
    let leaderboard = readLeaderboard();
    
    // Convert leaderboard to an array, sort by score in descending order
    let sortedLeaderboard = Object.entries(leaderboard)
        .map(([name, score]) => ({ name, score }))
        .sort((a, b) => b.score - a.score); // Sort by score, highest first
    
    res.json(sortedLeaderboard);
});

// API to update the score for a user
app.post('/api/update-score', (req, res) => {
    const { name, score } = req.body;
    let leaderboard = readLeaderboard();

    // Update or initialize the user's score
    if (!leaderboard[name]) {
        leaderboard[name] = 0;
    }
    
    leaderboard[name] += score; // Increment score

    saveLeaderboard(leaderboard); // Save updated leaderboard

    res.json({ message: `Score for ${name} updated`, leaderboard });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
