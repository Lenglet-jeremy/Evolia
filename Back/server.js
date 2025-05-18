// server.js

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Sert les fichiers statiques comme script.js et style.css
app.use(express.static(path.join(__dirname, '../Front')));

// Fallback pour les routes SPA (sans extension)
app.get(/^\/(?!.*\.).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, '../Front/index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Serveur lancé : http://localhost:${PORT}`);
});
