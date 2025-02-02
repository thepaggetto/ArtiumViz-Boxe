// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const app = express();

const competitionsRouter = require('./routes/competitions');

// Middleware
// Middleware per il parsing del JSON
app.use(express.json());

// Rotte di autenticazione

app.use('/api/auth', authRoutes);

app.use(cors());
app.use(express.json());
app.use('/api/competitions', competitionsRouter);
// Connessione al DB (ad es. MongoDB locale)
mongoose.connect('mongodb://localhost:27017/competitiondb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connesso'))
    .catch(err => console.error(err));

// Rotte
app.use('/api/competitions', require('./routes/competitions'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));


