// backend/routes/competitions.js
const express = require('express');
const router = express.Router();
const Competition = require('../models/Competition');



// GET /api/competitions/players
router.get('/players', async (req, res) => {
    try {
        const comps = await Competition.find();

        // Usiamo un Set per non avere duplicati
        const playersSet = new Set();

        // Per ogni gara, aggiungiamo nomePL1 e nomePL2 al set (se non vuoti)
        comps.forEach((comp) => {
            if (comp.nomePL1) playersSet.add(comp.nomePL1);
            if (comp.nomePL2) playersSet.add(comp.nomePL2);
        });

        // Convertiamo il set in array di oggetti { id, title }
        const playersArray = Array.from(playersSet).map((playerName) => ({
            id: playerName,
            title: playerName,
        }));

        res.json(playersArray);
    } catch (error) {
        console.error('Errore nel recupero dei players', error);
        res.status(500).json({ error: 'Errore nel recupero dei dati' });
    }
});






// GET: Ottieni tutte le gare
router.get('/', async (req, res) => {
    try {
        const comps = await Competition.find().sort({ sortIndex: 1 });
        res.json(comps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Crea una nuova gara
router.post('/', async (req, res) => {
    try {
        const competition = new Competition(req.body);
        await competition.save();
        res.status(201).json(competition);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT: Aggiorna una gara
router.put('/:id', async (req, res) => {
    try {
        const competition = await Competition.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(competition);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE: Cancella una gara
router.delete('/:id', async (req, res) => {
    try {
        await Competition.findByIdAndDelete(req.params.id);
        res.json({ message: 'Competition deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/allmatch', async (req, res) => {
    try {
        // Recuperiamo i record dal DB, ordinati secondo sortIndex
        const comps = await Competition.find().sort({ sortIndex: 1 });

        // Creiamo l'oggetto CompetitionsLookupTable
        const CompetitionsLookupTable = {};

        // Per ogni record, useremo comp.nome come chiave
        comps.forEach((comp) => {
            CompetitionsLookupTable[comp.nome] = {
                tipoGara: comp.tipoGara,
                nomeCampionato: comp.nomeCampionato,
                arbitro: comp.arbitro,
                giudice1: comp.giudice1,
                giudice2: comp.giudice2,
                giudice3: comp.giudice3,
                nomePL1: comp.nomePL1,
                recordPL1: comp.recordPL1,
                cittaPL1: comp.cittaPL1,
                nazionalitaPL1: comp.nazionalitaPL1,
                svgPL1: comp.svgPL1,
                etaPL1: comp.etaPL1,
                pesoPL1: comp.pesoPL1,
                altezzaPL1: comp.altezzaPL1,
                nomePL2: comp.nomePL2,
                recordPL2: comp.recordPL2,
                cittaPL2: comp.cittaPL2,
                nazionalitaPL2: comp.nazionalitaPL2,
                svgPL2: comp.svgPL2,
                etaPL2: comp.etaPL2,
                pesoPL2: comp.pesoPL2,
                altezzaPL2: comp.altezzaPL2,
                imgAtleta1: comp.imgAtleta1,
                imgAtleta2: comp.imgAtleta2,
            };
        });

        // Rispondiamo con l'oggetto generato
        res.json(CompetitionsLookupTable);
    } catch (err) {
        console.error('Errore nel recupero dei competitions', err);
        res.status(500).json({ error: 'Errore nel recupero dei dati' });
    }
});





// Esempio di rotta: POST /api/competitions/reorder
router.post('/reorder', async (req, res) => {
    /*
      req.body è un array di oggetti:
      [
        { _id: '...', sortIndex: 0 },
        { _id: '...', sortIndex: 1 },
        ...
      ]
    */
    const updatedOrder = req.body;
    try {
        for (const item of updatedOrder) {
            // Aggiorniamo sortIndex di ciascuna gara
            await Competition.findByIdAndUpdate(
                item._id,
                { sortIndex: item.sortIndex },
                { new: true }
            );
        }
        // Al termine, restituiamo un messaggio
        res.json({ message: 'Ordine aggiornato con successo' });
    } catch (error) {
        console.error('Errore nell\'aggiornamento dell\'ordine:', error);
        res.status(500).json({ error: 'Errore nel riordinamento' });
    }
});


module.exports = router;
