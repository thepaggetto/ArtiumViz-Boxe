// backend/routes/uploads.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router(); // <--- Assicurati di definire il router

// Configurazione di Multer per salvare i file nella cartella "uploads"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOADS_DIR || 'uploads/atleti/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo file immagine sono ammessi.'), false);
    }
};

const upload = multer({ storage, fileFilter });

// Rotta per l'upload dell'immagine
router.post('/image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nessun file inviato.' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/atleti/${req.file.filename}`;
    res.json({ url: fileUrl });
});

module.exports = router;
