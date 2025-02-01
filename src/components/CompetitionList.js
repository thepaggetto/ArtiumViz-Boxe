// frontend/src/components/CompetitionList.js
import React, { useState, useEffect } from 'react';
import { Button, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import CodeSnippet from './CodeSnippet';
import CompetitionWizard from './CompetitionWizard';

const CompetitionList = () => {
    const [competitions, setCompetitions] = useState([]);
    const [editing, setEditing] = useState(null); // gara in modifica
    const [jsonOutput, setJsonOutput] = useState('');

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const fetchCompetitions = async () => {
        try {
            const res = await axios.get('/api/competitions');
            setCompetitions(res.data);
            generateOutput(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const generateOutput = (data) => {
        // Creiamo un oggetto che mappa "Gara1", "Gara2", ... ai dati
        const output = {};
        data.forEach((comp) => {
            output[comp.nome] = {
                tipoGara: comp.tipoGara,
                nomeCampionato: comp.nomeCampionato,
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
            };
        });
        setJsonOutput(JSON.stringify(output, null, 2));
    };

    const handleSave = (updatedCompetition) => {
        // Aggiorna la lista dopo salvataggio/modifica
        setEditing(null);
        fetchCompetitions();
    };

    return (
        <div>
            {editing ? (
                <CompetitionWizard competition={editing} onSave={handleSave} />
            ) : (
                <Paper style={{ padding: 20, marginBottom: 20 }}>
                    <Typography variant="h5">Lista Gare</Typography>
                    <List>
                        {competitions.map((comp) => (
                            <ListItem key={comp._id} button onClick={() => setEditing(comp)}>
                                <ListItemText primary={comp.nome} secondary={comp.tipoGara} />
                            </ListItem>
                        ))}
                    </List>
                    <Button variant="contained" onClick={() => setEditing({})}>
                        Crea Nuova Gara
                    </Button>
                </Paper>
            )}

            <Typography variant="h6">Output JSON per Singular.Live</Typography>
            <CodeSnippet code={jsonOutput} />
        </div>
    );
};

export default CompetitionList;
