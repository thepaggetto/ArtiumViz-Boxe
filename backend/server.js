// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/auth');
const competitionsRouter = require('./routes/competitions');
const uploadsRouter = require('./routes/uploads');

const app = express();

// Verifica/crea la cartella "uploads/atleti"
const uploadsAtletiDir = path.join(__dirname, 'uploads', 'atleti');
if (!fs.existsSync(uploadsAtletiDir)) {
    fs.mkdirSync(uploadsAtletiDir, { recursive: true });
    console.log('Cartella "uploads/atleti" creata.');
}

// Middleware
app.use(cors({  origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Rotte
app.use('/api/auth', authRoutes);
app.use('/api/competitions', competitionsRouter);
app.use('/api/uploads', uploadsRouter);

// Serve i file statici dalla cartella "uploads"
app.use('/uploads', express.static(process.env.UPLOADS_DIR || 'uploads/atleti'));

// Connessione al DB (ad es. MongoDB locale)
mongoose.connect('mongodb://localhost:27017/competitiondb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connesso'))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));
