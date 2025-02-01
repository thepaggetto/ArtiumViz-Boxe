// frontend/src/components/CompetitionWizard.js
import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem, Typography, Paper } from '@mui/material';
import axios from 'axios';
import countries from '../utils/countries';

const CompetitionWizard = ({ competition, onSave }) => {
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
        pesoPL1: competition?.pesoPL1 || '',
        altezzaPL1: competition?.altezzaPL1 || '',

        // Partecipante 2
        nomePL2: competition?.nomePL2 || '',
        recordPL2: competition?.recordPL2 || '0W-0L-0D',
        cittaPL2: competition?.cittaPL2 || '',
        nazionalitaPL2: competition?.nazionalitaPL2 || '',
        svgPL2: competition?.svgPL2 || '',
        etaPL2: competition?.etaPL2 || '',
        pesoPL2: competition?.pesoPL2 || '',
        altezzaPL2: competition?.altezzaPL2 || '',
    });

    // Stato per gestire eventuali messaggi di errore per la validazione
    const [errors, setErrors] = useState({
        recordPL1: '',
        recordPL2: '',
    });

    // Regex per validare il formato: numeri seguiti da "W", poi "-" e numeri seguiti da "L", poi "-" e numeri seguiti da "D"
    const recordRegex = /^\d+W-\d+L-\d+D$/;

    const validateRecord = (record) => recordRegex.test(record);

    const handleCountryChange = (field, svgField) => (event) => {
        const countryCode = event.target.value;
        setFormData({
            ...formData,
            [field]: countries.find(c => c.code === countryCode)?.name || '',
            [svgField]: `https://flagcdn.com/${countryCode.toLowerCase()}.svg`,
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Rimuovo il messaggio di errore se l'utente modifica il campo record
        if (e.target.name === 'recordPL1' && errors.recordPL1) {
            setErrors(prev => ({ ...prev, recordPL1: '' }));
        }
        if (e.target.name === 'recordPL2' && errors.recordPL2) {
            setErrors(prev => ({ ...prev, recordPL2: '' }));
        }
    };

    // Funzione per validare che nessun campo obbligatorio sia vuoto
    const validateRequiredFields = () => {
        const requiredFields = [
            'nome', 'tipoGara', 'nomeCampionato',
            'nomePL1', 'recordPL1', 'cittaPL1', 'nazionalitaPL1', 'svgPL1', 'etaPL1', 'pesoPL1', 'altezzaPL1',
            'nomePL2', 'recordPL2', 'cittaPL2', 'nazionalitaPL2', 'svgPL2', 'etaPL2', 'pesoPL2', 'altezzaPL2'
        ];
        for (const field of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        // Controllo che tutti i campi siano compilati
        if (!validateRequiredFields()) {
            alert("Tutti i campi sono obbligatori.");
            return;
        }

        let hasError = false;
        // Validazione dei campi record per entrambi i partecipanti
        if (!validateRecord(formData.recordPL1)) {
            setErrors(prev => ({
                ...prev,
                recordPL1: 'Formato non valido. Usa il formato numW-numL-numD (es. 0W-0L-0D)',
            }));
            hasError = true;
        }
        if (!validateRecord(formData.recordPL2)) {
            setErrors(prev => ({
                ...prev,
                recordPL2: 'Formato non valido. Usa il formato numW-numL-numD (es. 0W-0L-0D)',
            }));
            hasError = true;
        }
        if (hasError) return;

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

    const handleDelete = async () => {
        if (window.confirm("Sei sicuro di voler eliminare questa Gara?")) {
            try {
                await axios.delete(`/api/competitions/${competition._id}`);
                onSave(null); // Puoi gestire il refresh della lista nel componente padre
            } catch (error) {
                console.error("Errore durante l'eliminazione:", error);
            }
        }
    };

    return (
        <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
            <Typography variant="h6">
                {competition && competition._id ? 'Modifica Gara' : 'Crea Gara'}
            </Typography>
            <Grid container spacing={2}>
                {/* Esempio di campi obbligatori: aggiungendo "required" per evidenziare l'obbligatorietà */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Nome Gara (es. Gara1)"
                        name="nome"
                        required
                        fullWidth
                        value={formData.nome}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Tipo Gara"
                        name="tipoGara"
                        required
                        fullWidth
                        value={formData.tipoGara}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Nome Campionato"
                        name="nomeCampionato"
                        required
                        fullWidth
                        value={formData.nomeCampionato}
                        onChange={handleChange}
                    />
                </Grid>

                {/* Campi del Partecipante 1 */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Nome PL1"
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
                        value={countries.find(c => c.name === formData.nazionalitaPL1)?.code || ''}
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
                    {formData.svgPL1 && <img src={formData.svgPL1} alt="flag" width="30" />}
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Età PL1"
                        name="etaPL1"
                        required
                        fullWidth
                        value={formData.etaPL1}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Peso PL1"
                        name="pesoPL1"
                        required
                        fullWidth
                        value={formData.pesoPL1}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Altezza PL1"
                        name="altezzaPL1"
                        required
                        fullWidth
                        value={formData.altezzaPL1}
                        onChange={handleChange}
                    />
                </Grid>

                {/* Campi del Partecipante 2 */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Nome PL2"
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
                        value={countries.find(c => c.name === formData.nazionalitaPL2)?.code || ''}
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
                    {formData.svgPL2 && <img src={formData.svgPL2} alt="flag" width="30" />}
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Età PL2"
                        name="etaPL2"
                        required
                        fullWidth
                        value={formData.etaPL2}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Peso PL2"
                        name="pesoPL2"
                        required
                        fullWidth
                        value={formData.pesoPL2}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        label="Altezza PL2"
                        name="altezzaPL2"
                        required
                        fullWidth
                        value={formData.altezzaPL2}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>

            {/* Renderizzazione condizionale dei bottoni in base alla modalità */}
            <Grid container spacing={2} style={{ marginTop: 20 }}>
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
                    </>
                ) : (
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Crea Gara
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
};

export default CompetitionWizard;
