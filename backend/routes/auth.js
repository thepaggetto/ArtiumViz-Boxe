const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Endpoint per il login (da personalizzare con logica reale di verifica credenziali)
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Esempio statico: in produzione, verifica le credenziali dal database e usa hashing per la password
    if (email === 'admin' && password === 'simo1100') {
        // Crea un token JWT (sostituisci 'your_secret_key' con una chiave sicura)
        const token = jwt.sign({ email }, 'your_secret_key', { expiresIn: '1h' });
        return res.json({ token });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
