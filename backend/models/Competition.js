const mongoose = require('mongoose');

const CompetitionSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    tipoGara: { type: String, required: true },
    nomeCampionato: { type: String, default: '' },

    // Nuovi campi:
    arbitro: { type: String, required: true }, // opzionale, se vuoi renderlo obbligatorio o no
    giudice1: { type: String, default: '' },     // opzionali
    giudice2: { type: String, default: '' },
    giudice3: { type: String, default: '' },

    // Dati dei partecipanti (già presenti)
    nomePL1: { type: String, required: true },
    recordPL1: { type: String, required: true },
    cittaPL1: { type: String, required: true },
    nazionalitaPL1: { type: String, required: true },
    svgPL1: { type: String, required: true },
    etaPL1: { type: String, required: true },
    pesoPL1: { type: String, required: true },
    altezzaPL1: { type: String, required: true },

    nomePL2: { type: String, required: true },
    recordPL2: { type: String, required: true },
    cittaPL2: { type: String, required: true },
    nazionalitaPL2: { type: String, required: true },
    svgPL2: { type: String, required: true },
    etaPL2: { type: String, required: true },
    pesoPL2: { type: String, required: true },
    altezzaPL2: { type: String, required: true },

    // Campi per le immagini degli atleti (qui trattati come URL)
    imgAtleta1: { type: String, default: '' },
    imgAtleta2: { type: String, default: '' },

    // Campo per l'ordinamento (già presente)
    sortIndex: { type: Number, default: 0 },
});

module.exports = mongoose.model('Competition', CompetitionSchema);
