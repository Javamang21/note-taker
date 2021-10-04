const express = require('express');
const path = require('path')
const fs = require('fs')

const PORT = process.env.PORT || 3006;
const app = express();
const staticDir = path.join(__dirname, "/Develop/public");

console.log(staticDir);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static('public'));

// Get routes that pull html, css and, javascript files
app.get('/notes', (req, res) => {
    res.sendFile(path.join(staticDir, 'notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/Develop/db/db.json'));
});

app.get('/api/notes/:id', (req, res) => {
    let newNotes = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf8'));
    res.json(newNotes[Number(req.params.id)]);
});

app.get("/api/js", (req, res) => {
    res.sendFile(path.join(staticDir, "assets/js/index.js"));
});

app.get("/api/css", (req, res) => {
    res.sendFile(path.join(staticDir, "assets/css/styles.css"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
});

// Post requests 
app.post("/api/notes", (req, res) => {
    let savedNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    let newNotes = req.body;
    let uniqueID = (savedNotes.length).toString();
    newNotes.id = uniqueID;
    savedNotes.push(newNotes);
    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved to db.json. Content: ", newNotes);
    res.json(savedNotes);
});

// Delete requests
app.delete("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }
    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
});

// Not Found response for unmatched routes
app.use((req, res) => {
    res.status(404).end();
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });