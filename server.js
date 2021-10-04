const express = require('express');

const PORT = process.env.PORT || 3006;
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Root directory for routing, 
app.use(express.static('Develop/public'));

app.get('/index.html', (req, res) => {
    res.send('index');
});

app.get('/notes.html', (req, res) => {
    res.send('notes');
});

// Not Found response for unmatched routes
app.use((req, res) => {
    res.status(404).end();
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });