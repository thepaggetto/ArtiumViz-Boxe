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
} from '@mui/material';
import InputMask from 'react-input-mask';
import axios from 'axios';
import countries from '../utils/countries';

const CompetitionWizard = ({ competition, onSave }) => {
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [missingFieldsDialogOpen, setMissingFieldsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        nome: competition?.nome || '',
        tipoGara: competition?.tipoGara || '',
        nomeCampionato: competition?.nomeCampionato || '',

        // Partecipante 1
        nomePL1: competition?.nomePL1 || '',
        recordPL1: competition?.recordPL1 || '0W-0L-0D',
        cittaPL1: competition?.cittaPL1 || '',
        nazionalitaPL1: competition?.nazionalitaPL1 || '',
        svgPL1: competition?.svgPL1 || '',
        etaPL1: competition?.etaPL1 || '',
        pesoPL1: competition?.pesoPL1 || '000,000KG',
        altezzaPL1: competition?.altezzaPL1 || '000,000cm',

        // Partecipante 2
        nomePL2: competition?.nomePL2 || '',
        recordPL2: competition?.recordPL2 || '0W-0L-0D',
        cittaPL2: competition?.cittaPL2 || '',
        nazionalitaPL2: competition?.nazionalitaPL2 || '',
        svgPL2: competition?.svgPL2 || '',
        etaPL2: competition?.etaPL2 || '',
        pesoPL2: competition?.pesoPL2 || '000,000KG',
        altezzaPL2: competition?.altezzaPL2 || '000,000cm',
    });

    const [errors, setErrors] = useState({
        recordPL1: '',
        recordPL2: '',
    });

    // Regex per validare il formato record (numW-numL-numD)
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        // Rimuovo errori di validazione se l'utente modifica i campi record
        if (e.target.name === 'recordPL1' && errors.recordPL1) {
            setErrors((prev) => ({ ...prev, recordPL1: '' }));
        }
        if (e.target.name === 'recordPL2' && errors.recordPL2) {
            setErrors((prev) => ({ ...prev, recordPL2: '' }));
        }
    };

    const validateRequiredFields = () => {
        const requiredFields = [
            'nome',
            'tipoGara',
            'nomeCampionato',
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
        // 1) Controlla campi obbligatori
        if (!validateRequiredFields()) {
            setMissingFieldsDialogOpen(true);
            return;
        }

        // 2) Validazione record
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

        // 3) Salvataggio effettivo
        try {
            if (competition && competition._id) {
                const res = await axios.put(`/api/competitions/${competition._id}`, formData);
                onSave(res.data);
            } else {
                const res = await axios.post('/api/competitions', formData);
                onSave(res.data);
            }
        } catch (error) {
            console.error('Errore nel salvataggio:', error);
        }
    };

    // Mostra la dialog per eliminare la gara
    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    // Conferma eliminazione
    const handleConfirmDelete = async () => {
        setDeleteDialogOpen(false);
        try {
            await axios.delete(`/api/competitions/${competition._id}`);
            onSave(null);
        } catch (error) {
            console.error('Errore durante l\'eliminazione:', error);
        }
    };

    // Annulla eliminazione
    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    // Indietro: chiedi conferma di scartare i dati
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

            {/* Sezione 1: Nome Match, Tipo, Titolo Campionato */}
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
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Sezione 2: Dati PL1 */}
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Dati Pugile 1
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Nome e Cognome | Pugile 1"
                        name="nomePL1"
                        required
                        fullWidth
                        value={formData.nomePL1}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Record (es. 0W-0L-0D)"
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
                        label="Città"
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
                        label="Nazionalità"
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

                {/* Età: campo numerico */}
                <Grid item xs={12} sm={4}>
                    <TextField
                        type="number"
                        label="Età"
                        name="etaPL1"
                        required
                        fullWidth
                        value={formData.etaPL1}
                        onChange={handleChange}
                    />
                </Grid>

                {/* Peso con InputMask per 000,000KG */}
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
                                label="Peso (000,000KG)"
                                required
                                fullWidth
                            />
                        )}
                    </InputMask>
                </Grid>

                {/* Altezza con InputMask per 000,000cm */}
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
                                label="Altezza (000,000cm)"
                                required
                                fullWidth
                            />
                        )}
                    </InputMask>
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Sezione 3: Dati PL2 */}
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Dati Pugile 2
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Nome Nome e Cognome | Pugile 2"
                        name="nomePL2"
                        required
                        fullWidth
                        value={formData.nomePL2}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Record (es. 0W-0L-0D)"
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
                        label="Città"
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
                        label="Nazionalità"
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

                {/* Età: campo numerico */}
                <Grid item xs={12} sm={4}>
                    <TextField
                        type="number"
                        label="Età"
                        name="etaPL2"
                        required
                        fullWidth
                        value={formData.etaPL2}
                        onChange={handleChange}
                    />
                </Grid>

                {/* Peso con InputMask per 000,999KG */}
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
                                label="Peso (000,000KG)"
                                required
                                fullWidth
                            />
                        )}
                    </InputMask>
                </Grid>

                {/* Altezza con InputMask per 000,999cm */}
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
                                label="Altezza (000,000cm)"
                                required
                                fullWidth
                            />
                        )}
                    </InputMask>
                </Grid>
            </Grid>

            {/* Pulsanti Crea/Aggiorna + Indietro + Elimina */}
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
                            <Button variant="text" color="inherit" onClick={() => setCancelDialogOpen(true)}>
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
                            <Button variant="text" color="inherit" onClick={() => setCancelDialogOpen(true)}>
                                Indietro
                            </Button>
                        </Grid>
                    </>
                )}
            </Grid>

            {/* Dialog per Annullare l’inserimento o l’editing */}
            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
                <DialogTitle>Annullare l'inserimento?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Sei sicuro di voler uscire senza salvare i dati?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)}>Annulla</Button>
                    <Button onClick={() => { setCancelDialogOpen(false); onSave(null); }} color="error">
                        Sì, esci
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog per confermare l'eliminazione */}
            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Eliminare Gara?</DialogTitle>
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
            >
                <DialogTitle>Campi Obbligatori</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Non hai compilato tutti i campi obbligatori.
                        Per continuare, inserisci tutte le informazioni richieste.
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