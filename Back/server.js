// server.js

const User = require('./Models/User');


const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI, process.env.MONGO_OPTIONS)
    .then(() => console.log("MongoDB connecté"))
    .catch(err => console.error(err));


app.use(express.json());


// Sert les fichiers statiques comme script.js et style.css
app.use(express.static(path.join(__dirname, '../Front')));

// Fallback pour les routes SPA (sans extension)
app.get(/^\/(?!.*\.).*$/, (req, res) => {
    res.sendFile(path.join(__dirname, '../Front/index.html'));
});


app.listen(PORT, () => 
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
);


// Inscription
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Utilisateur déjà existant' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();

  res.status(201).json({ message: 'Utilisateur enregistré' });
});

// Connexion
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Utilisateur introuvable' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});




