// frontend/src/components/CompetitionWizard.js
import React, { useState } from 'react';
import {
    TextField,
    Button,
    Grid,
    MenuItem,
    Typography,
    Paper,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    FormControlLabel,
    Switch,
} from '@mui/material';
import InputMask from 'react-input-mask';
import axios from 'axios';
import countries from '../utils/countries';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.artiumviz.com';

const CompetitionWizard = ({ competition, onSave }) => {
    // Stati per i dialog
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [missingFieldsDialogOpen, setMissingFieldsDialogOpen] = useState(false);

    // Stato del form
    const [formData, setFormData] = useState({
        nome: competition?.nome || '',
        tipoGara: competition?.tipoGara || '',
        nomeCampionato: competition?.nomeCampionato || '',

        // Nuovi campi
        arbitro: competition?.arbitro || '',
        giudice1: competition?.giudice1 || '',
        giudice2: competition?.giudice2 || '',
        giudice3: competition?.giudice3 || '',
        // Flag per mostrare i giudici (non obbligatorio)
        inserisciGiudici: competition?.inserisciGiudici || false,

        // Dati Partecipante 1
        nomePL1: competition?.nomePL1 || '',
        recordPL1: competition?.recordPL1 || '0W-0L-0D',
        cittaPL1: competition?.cittaPL1 || '',
        nazionalitaPL1: competition?.nazionalitaPL1 || '',
        svgPL1: competition?.svgPL1 || '',
        etaPL1: competition?.etaPL1 || '',
        pesoPL1: competition?.pesoPL1 || '000,000KG',
        altezzaPL1: competition?.altezzaPL1 || '000,000cm',

        // Dati Partecipante 2
        nomePL2: competition?.nomePL2 || '',
        recordPL2: competition?.recordPL2 || '0W-0L-0D',
        cittaPL2: competition?.cittaPL2 || '',
        nazionalitaPL2: competition?.nazionalitaPL2 || '',
        svgPL2: competition?.svgPL2 || '',
        etaPL2: competition?.etaPL2 || '',
        pesoPL2: competition?.pesoPL2 || '000,000KG',
        altezzaPL2: competition?.altezzaPL2 || '000,000cm',

        // Campi per upload immagine (URL)
        imgAtleta1: competition?.imgAtleta1 || '',
        imgAtleta2: competition?.imgAtleta2 || '',
    });

    const [errors, setErrors] = useState({
        recordPL1: '',
        recordPL2: '',
    });

    // Regex per validare il formato record: numW-numL-numD
    const recordRegex = /^\d+W-\d+L-\d+D$/;
    const validateRecord = (record) => recordRegex.test(record);

    const handleCountryChange = (field, svgField) => (event) => {
        const countryCode = event.target.value;
        setFormData({
            ...formData,
            [field]: countries.find((c) => c.code === countryCode)?.name || '',
            [svgField]: `https://flagcdn.com/${countryCode.toLowerCase()}.svg`,
        });
    };

    // Funzione per gestire l'upload
    const handleImageUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;
        // Crea un oggetto FormData
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
            // Effettua la richiesta di upload
            const res = await axios.post(`${API_URL}/api/uploads/image`, formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Aggiorna il campo immagine con l'URL ricevuto
            setFormData((prev) => ({ ...prev, [fieldName]: res.data.url }));
        } catch (error) {
            console.error('Errore durante l\'upload:', error);
            alert('Errore durante l\'upload dell\'immagine');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Se il campo record viene modificato, rimuovo eventuali errori
        if (name === 'recordPL1' && errors.recordPL1) {
            setErrors((prev) => ({ ...prev, recordPL1: '' }));
        }
        if (name === 'recordPL2' && errors.recordPL2) {
            setErrors((prev) => ({ ...prev, recordPL2: '' }));
        }
    };

    // Gestione del toggle per mostrare i campi dei giudici
    const handleToggleGiudici = (e) => {
        setFormData({ ...formData, inserisciGiudici: e.target.checked });
    };

    const validateRequiredFields = () => {
        // I campi giudici non sono obbligatori
        const requiredFields = [
            'nome',
            'tipoGara',
            'nomeCampionato',
            'arbitro',
            'nomePL1',
            'recordPL1',
            'cittaPL1',
            'nazionalitaPL1',
            'svgPL1',
            'etaPL1',
            'pesoPL1',
            'altezzaPL1',
            'nomePL2',
            'recordPL2',
            'cittaPL2',
            'nazionalitaPL2',
            'svgPL2',
            'etaPL2',
            'pesoPL2',
            'altezzaPL2',

        ];
        for (const field of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateRequiredFields()) {
            setMissingFieldsDialogOpen(true);
            return;
        }

        let hasError = false;
        if (!validateRecord(formData.recordPL1)) {
            setErrors((prev) => ({
                ...prev,
                recordPL1: 'Formato non valido. Usa numW-numL-numD (es. 0W-0L-0D)',
            }));
            hasError = true;
        }
        if (!validateRecord(formData.recordPL2)) {
            setErrors((prev) => ({
                ...prev,
                recordPL2: 'Formato non valido. Usa numW-numL-numD (es. 0W-0L-0D)',
            }));
            hasError = true;
        }
        if (hasError) return;

        try {
            if (competition && competition._id) {
                const res = await axios.put(`${API_URL}/api/competitions/${competition._id}`, formData);
                onSave(res.data);
            } else {
                const res = await axios.post(`${API_URL}/api/competitions`, formData);
                onSave(res.data);
            }
        } catch (error) {
            console.error('Errore nel salvataggio:', error);
        }
    };

    const handleDelete = async () => {
        // Apri il dialog per confermare l'eliminazione
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        setDeleteDialogOpen(false);
        try {
            await axios.delete(`/api/competitions/${competition._id}`);
            onSave(null);
        } catch (error) {
            console.error('Errore durante l\'eliminazione:', error);
        }
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    // Gestione annullamento/indietro
    const handleCancel = () => {
        setCancelDialogOpen(true);
    };

    const handleConfirmDiscard = () => {
        setCancelDialogOpen(false);
        onSave(null); // Chiude il wizard
    };

    const handleCloseDialog = () => {
        setCancelDialogOpen(false);
        setMissingFieldsDialogOpen(false);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                {competition && competition._id ? 'Modifica Match' : 'Crea Match'}
            </Typography>

            {/* Sezione 1: Nome Match, Tipo, Titolo Campionato, Arbitro */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Nome Match (es. Match1)"
                        name="nome"
                        required
                        fullWidth
                        value={formData.nome}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Tipo Match (es. Pesi Super Leggeri 10x2)"
                        name="tipoGara"
                        required
                        fullWidth
                        value={formData.tipoGara}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Titolo Campionato (es. National Contest)"
                        name="nomeCampionato"
                        required
                        fullWidth
                        value={formData.nomeCampionato}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Arbitro"
                        name="arbitro"
                        required
                        fullWidth
                        value={formData.arbitro}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Sezione 2: Flag per mostrare i campi dei giudici */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.inserisciGiudici}
                                onChange={handleToggleGiudici}
                                name="inserisciGiudici"
                                color="primary"
                            />
                        }
                        label="Inserisci Giudici"
                    />
                </Grid>
            </Grid>

            {/* Sezione 2 (condizionale): Dati Giudici */}
            {formData.inserisciGiudici && (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Giudice 1"
                            name="giudice1"
                            fullWidth
                            value={formData.giudice1}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Giudice 2"
                            name="giudice2"
                            fullWidth
                            value={formData.giudice2}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Giudice 3"
                            name="giudice3"
                            fullWidth
                            value={formData.giudice3}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Sezione 3: Dati Partecipante 1 */}
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Dati Partecipante 1
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Nome Atleta 1"
                        name="nomePL1"
                        required
                        fullWidth
                        value={formData.nomePL1}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Record PL1 (es. 0W-0L-0D)"
                        name="recordPL1"
                        required
                        fullWidth
                        value={formData.recordPL1}
                        onChange={handleChange}
                        error={!!errors.recordPL1}
                        helperText={errors.recordPL1}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Città PL1"
                        name="cittaPL1"
                        required
                        fullWidth
                        value={formData.cittaPL1}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        select
                        label="Nazionalità PL1"
                        name="nazionalitaPL1"
                        required
                        fullWidth
                        value={
                            countries.find((c) => c.name === formData.nazionalitaPL1)?.code ||
                            ''
                        }
                        onChange={handleCountryChange('nazionalitaPL1', 'svgPL1')}
                    >
                        {countries.map((country) => (
                            <MenuItem key={country.code} value={country.code}>
                                {country.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                    {formData.svgPL1 && (
                        <img src={formData.svgPL1} alt="flag" width="30" />
                    )}
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        type="number"
                        label="Età PL1"
                        name="etaPL1"
                        required
                        fullWidth
                        value={formData.etaPL1}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputMask
                        mask="999,999KG"
                        value={formData.pesoPL1}
                        onChange={(e) =>
                            setFormData({ ...formData, pesoPL1: e.target.value })
                        }
                    >
                        {(inputProps) => (
                            <TextField
                                {...inputProps}
                                label="Peso PL1 (000,000KG)"
                                required
                                fullWidth
                            />
                        )}
                    </InputMask>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputMask
                        mask="999,999cm"
                        value={formData.altezzaPL1}
                        onChange={(e) =>
                            setFormData({ ...formData, altezzaPL1: e.target.value })
                        }
                    >
                        {(inputProps) => (
                            <TextField
                                {...inputProps}
                                label="Altezza PL1 (000,000cm)"
                                required
                                fullWidth
                            />
                        )}
                    </InputMask>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Sezione 4: Dati Partecipante 2 */}
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Dati Partecipante 2
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Nome Atleta 2"
                        name="nomePL2"
                        required
                        fullWidth
                        value={formData.nomePL2}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Record PL2 (es. 0W-0L-0D)"
                        name="recordPL2"
                        required
                        fullWidth
                        value={formData.recordPL2}
                        onChange={handleChange}
                        error={!!errors.recordPL2}
                        helperText={errors.recordPL2}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Città PL2"
                        name="cittaPL2"
                        required
                        fullWidth
                        value={formData.cittaPL2}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        select
                        label="Nazionalità PL2"
                        name="nazionalitaPL2"
                        required
                        fullWidth
                        value={
                            countries.find((c) => c.name === formData.nazionalitaPL2)?.code ||
                            ''
                        }
                        onChange={handleCountryChange('nazionalitaPL2', 'svgPL2')}
                    >
                        {countries.map((country) => (
                            <MenuItem key={country.code} value={country.code}>
                                {country.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                    {formData.svgPL2 && (
                        <img src={formData.svgPL2} alt="flag" width="30" />
                    )}
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        type="number"
                        label="Età PL2"
                        name="etaPL2"
                        required
                        fullWidth
                        value={formData.etaPL2}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputMask
                        mask="999,999KG"
                        value={formData.pesoPL2}
                        onChange={(e) =>
                            setFormData({ ...formData, pesoPL2: e.target.value })
                        }
                    >
                        {(inputProps) => (
                            <TextField
                                {...inputProps}
                                label="Peso PL2 (000,000KG)"
                                required
                                fullWidth
                            />
                        )}
                    </InputMask>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <InputMask
                        mask="999,999cm"
                        value={formData.altezzaPL2}
                        onChange={(e) =>
                            setFormData({ ...formData, altezzaPL2: e.target.value })
                        }
                    >
                        {(inputProps) => (
                            <TextField
                                {...inputProps}
                                label="Altezza PL2 (000,000cm)"
                                required
                                fullWidth
                            />
                        )}
                    </InputMask>
                </Grid>
            </Grid>

            {/* Sezione per l'upload delle immagini degli atleti */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Immagini Atleti
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                {/* Immagine Atleta 1 */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Immagine Atleta 1 (URL)"
                        name="imgAtleta1"
                        fullWidth
                        value={formData.imgAtleta1}
                        onChange={(e) =>
                            setFormData({ ...formData, imgAtleta1: e.target.value })
                        }
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'imgAtleta1')}
                        style={{ marginTop: 8 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={() => navigator.clipboard.writeText(formData.imgAtleta1)}
                    >
                        Copia link immagine 1
                    </Button>
                </Grid>
                {/* Immagine Atleta 2 */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Immagine Atleta 2 (URL)"
                        name="imgAtleta2"
                        fullWidth
                        value={formData.imgAtleta2}
                        onChange={(e) =>
                            setFormData({ ...formData, imgAtleta2: e.target.value })
                        }
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'imgAtleta2')}
                        style={{ marginTop: 8 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={() => navigator.clipboard.writeText(formData.imgAtleta2)}
                    >
                        Copia link immagine 2
                    </Button>
                </Grid>
            </Grid>

            {/* Pulsanti: Salva / Elimina / Indietro */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {competition && competition._id ? (
                    <>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Aggiorna Gara
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="secondary" onClick={handleDelete}>
                                Elimina Gara
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="text"
                                color="inherit"
                                onClick={() => setCancelDialogOpen(true)}
                            >
                                Indietro
                            </Button>
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Crea Gara
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="text"
                                color="inherit"
                                onClick={() => setCancelDialogOpen(true)}
                            >
                                Indietro
                            </Button>
                        </Grid>
                    </>
                )}
            </Grid>

            {/* Dialog per annullare l'inserimento */}
            <Dialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
                aria-labelledby="cancel-dialog-title"
            >
                <DialogTitle id="cancel-dialog-title">
                    Annullare l'inserimento?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Sei sicuro di voler uscire senza salvare i dati?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)}>Annulla</Button>
                    <Button
                        onClick={() => {
                            setCancelDialogOpen(false);
                            onSave(null);
                        }}
                        color="error"
                    >
                        Sì, esci
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog per eliminazione */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
            >
                <DialogTitle id="delete-dialog-title">Eliminare Gara?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Questa operazione rimuoverà la gara in modo definitivo.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Annulla</Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Sì, elimina
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog per campi mancanti */}
            <Dialog
                open={missingFieldsDialogOpen}
                onClose={() => setMissingFieldsDialogOpen(false)}
                aria-labelledby="missing-fields-dialog-title"
            >
                <DialogTitle id="missing-fields-dialog-title">
                    Campi Obbligatori
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Non hai compilato tutti i campi obbligatori. Inserisci tutte le informazioni richieste per continuare.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMissingFieldsDialogOpen(false)} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default CompetitionWizard;