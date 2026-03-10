const express = require('express');
const bodyParser = require('body-parser');
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const FAMILY_FILE = path.join(__dirname, 'family.pl');

// Route to handle Prolog queries
app.post('/query', (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    let processedQuery = query.trim();
    if (processedQuery.endsWith('.')) {
        processedQuery = processedQuery.slice(0, -1);
    }

    // Simple spawn: No shell: true, no extra manual quotes in the array
    const familyPlPath = path.join(__dirname, 'family.pl').replace(/\\/g, '/');
    const swipl = spawn('swipl', [
        '-q',
        '-s', familyPlPath,
        '-g', `read_term_from_atom('${processedQuery.replace(/'/g, "''")}', Q, [variable_names(B)]), run_ai_query(Q, B), halt.`,
        '-t', 'halt(1).'
    ]);

    swipl.on('error', (err) => {
        console.error('Failed to start swipl:', err);
        if (!res.headersSent) res.status(500).json({ error: 'Failed to start Prolog engine', details: err.message });
    });

    let stdout = '';
    let stderr = '';

    swipl.stdout.on('data', (data) => stdout += data.toString());
    swipl.stderr.on('data', (data) => stderr += data.toString());

    swipl.on('close', (code) => {
        console.log(`STDOUT: ${stdout}`);
        console.log(`STDERR: ${stderr}`);

        if (code !== 0 && !stdout.includes('X =') && !stdout.includes('true.')) {
            // If it's a legitimate false result
            if (stdout.includes('false.')) return res.json({ result: 'false.' });
            return res.status(500).json({ error: 'Prolog execution failed', details: stderr });
        }

        const result = stdout.trim() || 'true.';
        res.json({ result });
    });
});

// Helper to get results from Prolog without the full custom wrapper if needed
function runProlog(query, callback) {
    const swipl = spawn('swipl', [
        '-q', '-s', FAMILY_FILE.replace(/\\/g, '/'),
        '-g', `${query}, halt.`,
        '-t', 'halt(1).'
    ]);
    let stdout = '';
    swipl.stdout.on('data', (data) => stdout += data.toString());
    swipl.on('close', (code) => callback(stdout.trim()));
}

// API to get all family members with genders
app.get('/api/members', (req, res) => {
    runProlog("findall(m(P, male), male(P), M), findall(m(P, female), female(P), F), append(M, F, L), write(L)", (output) => {
        try {
            const matches = output.match(/m\(([^,]+),([^)]+)\)/g);
            const members = matches ? matches.map(m => {
                const parts = m.match(/m\((.+),(.+)\)/);
                return { name: parts[1], gender: parts[2] };
            }) : [];
            res.json({ members });
        } catch (e) {
            res.status(500).json({ error: 'Failed to parse members' });
        }
    });
});

// API to get family tree structure with genders
app.get('/api/structure', (req, res) => {
    runProlog("setof(p(P, C, G), (parent(P, C), (male(P) -> G = male; G = female)), L), write(L)", (output) => {
        try {
            const matches = output.match(/p\(([^,]+),([^,]+),([^)]+)\)/g);
            const links = matches ? matches.map(m => {
                const parts = m.match(/p\((.+),(.+),(.+)\)/);
                return { source: parts[1], target: parts[2], gender: parts[3] };
            }) : [];
            res.json({ links });
        } catch (e) {
            res.status(500).json({ error: 'Failed to parse structure' });
        }
    });
});

// API to add a new member
app.post('/api/add-member', (req, res) => {
    const { name, gender } = req.body;
    if (!name || !gender) return res.status(400).json({ error: 'Name and gender required' });

    const cleanName = name.toLowerCase().trim();
    const fact = `${gender}(${cleanName}).\n`;

    // Append to family.pl
    fs.appendFile(FAMILY_FILE, fact, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to save member' });
        res.json({ success: true });
    });
});

// API to add a relationship
app.post('/api/add-relationship', (req, res) => {
    const { parent, child } = req.body;
    if (!parent || !child) return res.status(400).json({ error: 'Parent and child required' });

    const fact = `parent(${parent.toLowerCase().trim()}, ${child.toLowerCase().trim()}).\n`;

    fs.appendFile(FAMILY_FILE, fact, (err) => {
        if (err) return res.status(500).json({ error: 'Failed to save relationship' });
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
