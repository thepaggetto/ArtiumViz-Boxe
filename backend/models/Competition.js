// backend/models/Competition.js
const mongoose = require('mongoose');

const CompetitionSchema = new mongoose.Schema({
    nome: { type: String, required: true }, // ad es. "Gara1"
    tipoGara: { type: String, required: true },
    nomeCampionato: { type: String, default: '' },
    // Dati per il primo partecipante
    nomePL1: { type: String, required: true },
    recordPL1: { type: String, required: true },
    cittaPL1: { type: String, required: true },
    nazionalitaPL1: { type: String, required: true },
    svgPL1: { type: String, required: true },
    etaPL1: { type: String, default: '00' },
    pesoPL1: { type: String, default: '00' },
    altezzaPL1: { type: String, default: '00' },
    // Dati per il secondo partecipante
    nomePL2: { type: String, required: true },
    recordPL2: { type: String, required: true },
    cittaPL2: { type: String, required: true },
    nazionalitaPL2: { type: String, required: true },
    svgPL2: { type: String, required: true },
    etaPL2: { type: String, default: '00' },
    pesoPL2: { type: String, default: '00' },
    altezzaPL2: { type: String, default: '00' },
    sortIndex: { type: Number, default: 0 },
});

module.exports = mongoose.model('Competition', CompetitionSchema);
