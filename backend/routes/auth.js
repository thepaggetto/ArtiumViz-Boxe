const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// CONFIG
const JWT_SECRET = '6e479b5627579cda2f94ca6bc2dda335bf16acf150a6958849ce2b564ceba7e7'; // Sostituisci con una chiave sicura
const SALT_ROUNDS = 10;                     // Per bcrypt

// POST /api/auth/register
// Registra un nuovo utente
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifica se l'utente esiste già
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email già in uso' });
        }

        // Crea l'hash della password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Crea nuovo utente
        const newUser = new User({
            email,
            passwordHash,
        });
        await newUser.save();

        res.status(201).json({ message: 'Utente registrato con successo' });
    } catch (error) {
        console.error('Errore registrazione:', error);
        res.status(500).json({ error: 'Errore di server' });
    }
});

// POST /api/auth/login
// Effettua il login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Trova l'utente
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        // Confronta la password in chiaro con l'hash salvato
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        // Se la password è corretta, generiamo un token JWT
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Errore login:', error);
        res.status(500).json({ error: 'Errore di server' });
    }
});

module.exports = router;
