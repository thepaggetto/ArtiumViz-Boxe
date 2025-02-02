// frontend/src/components/CodeSnippet.js
import React, { useState } from 'react';
import { Button, Paper, TextField } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CodeSnippet = ({ code }) => {
    const [copied, setCopied] = useState(false);

    return (
        <Paper style={{ position: 'relative', padding: 20, backgroundColor: '#f5f5f5' }}>
            <TextField
                multiline
                fullWidth
                value={code}
                InputProps={{ readOnly: true }}
                variant="outlined"
                rows={10}
            />
            <CopyToClipboard text={code} onCopy={() => setCopied(true)}>
                <Button variant="contained" color="primary" style={{ position: 'absolute', top: 10, right: 10 }}>
                    {copied ? 'Copiato!' : 'Copia in Clipboard'}
                </Button>
            </CopyToClipboard>
        </Paper>
    );
};

export default CodeSnippet;
