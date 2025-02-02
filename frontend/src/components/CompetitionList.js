import React, { useState, useEffect } from 'react';
import {
    Button,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Box,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import axios from 'axios';
import CodeSnippet from './CodeSnippet';
import CompetitionWizard from './CompetitionWizard';

// Funzione di utilità per spostare l'elemento da fromIndex a toIndex
function moveItem(list, fromIndex, toIndex) {
    const updated = [...list];
    const [removed] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, removed);
    return updated;
}

const CompetitionList = () => {
    const [competitions, setCompetitions] = useState([]);
    const [editing, setEditing] = useState(null); // gara in modifica
    const [jsonOutput, setJsonOutput] = useState('');
    const [showSnippet, setShowSnippet] = useState(false);

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const fetchCompetitions = async () => {
        try {
            // GET con sort({ sortIndex: 1 }) lato server
            const res = await axios.get('/api/competitions');
            setCompetitions(res.data);
            generateOutput(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const generateOutput = (data) => {
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
        setEditing(null);
        fetchCompetitions();
    };

    // Funzione per salvare il nuovo ordine al server
    const saveNewOrder = async (newOrder) => {
        try {
            // Prepara l'array di { _id, sortIndex }
            const orderData = newOrder.map((comp, idx) => ({
                _id: comp._id,
                sortIndex: idx,
            }));
            // Chiamata POST a /api/competitions/reorder
            await axios.post('/api/competitions/reorder', orderData);
            setCompetitions(newOrder);
            generateOutput(newOrder);
        } catch (error) {
            console.error('Errore nel salvataggio dell\'ordine:', error);
        }
    };

    const moveUp = (index) => {
        if (index === 0) return; // non possiamo andare più su
        const newOrder = moveItem(competitions, index, index - 1);
        saveNewOrder(newOrder);
    };

    const moveDown = (index) => {
        if (index === competitions.length - 1) return; // ultimo elemento, non può scendere
        const newOrder = moveItem(competitions, index, index + 1);
        saveNewOrder(newOrder);
    };

    return (
        <div>
            {editing ? (
                <CompetitionWizard competition={editing} onSave={handleSave} />
            ) : (
                <Paper style={{ padding: 20, marginBottom: 20 }}>
                    <List>
                        {competitions.map((comp, index) => (
                            <ListItem
                                key={comp._id}
                                button
                                onClick={() => setEditing(comp)}
                                sx={{ display: 'flex', justifyContent: 'space-between' }}
                            >
                                <ListItemText primary={comp.nome} secondary={comp.tipoGara} />
                                <div>
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            moveUp(index);
                                        }}
                                        size="small"
                                        disabled={index === 0}
                                    >
                                        <ArrowUpward />
                                    </IconButton>
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            moveDown(index);
                                        }}
                                        size="small"
                                        disabled={index === competitions.length - 1}
                                    >
                                        <ArrowDownward />
                                    </IconButton>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                    <Button variant="contained" onClick={() => setEditing({})}>
                        Nuovo Match
                    </Button>
                </Paper>
            )}

            {/* Sezione per il JSON snippet: pulsanti e output */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Output JSON
                </Typography>
                <Box sx={{ mb: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setShowSnippet(!showSnippet)}
                        sx={{ mr: 2 }}
                    >
                        {showSnippet ? 'Nascondi Snippet JSON' : 'Mostra Snippet JSON'}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigator.clipboard.writeText(jsonOutput)}
                    >
                        Copia in clipboard
                    </Button>
                </Box>
                {showSnippet && <CodeSnippet code={jsonOutput} />}
            </Box>
        </div>
    );
};

export default CompetitionList;
