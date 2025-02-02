import { createTheme } from '@mui/material/styles';

// Colore di accento rosso
const ACCENT_RED = '#D7263D';

const theme = createTheme({
    palette: {
        mode: 'light', // Tema chiaro
        primary: {
            main: ACCENT_RED,         // Rosso di accento per pulsanti, highlight
            contrastText: '#fff',     // Testo bianco su pulsanti rossi
        },
        background: {
            default: '#fafafa',       // Sfondo generale molto chiaro
            paper: '#ffffff',         // Sfondo dei contenitori (card, modali, ecc.)
        },
        text: {
            primary: '#2F2F2F',       // Testo principale in grigio scuro
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        // Esempio di stili personalizzati per i titoli
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
            color: '#2F2F2F',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    components: {
        // AppBar con sfondo bianco e testo scuro
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    boxShadow: 'none',
                    color: '#2F2F2F',
                    borderBottom: '1px solid #eee',
                },
            },
        },
        // Stile per Drawer, Card, Bottoni, ecc.
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    padding: '10px 20px',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                },
            },
        },
    },
});

export default theme;
