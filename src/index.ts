import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const dbFilePath = path.join(__dirname, 'db.json');

app.use(bodyParser.json());

const readDatabase = () => {
    try {
        const data = fs.readFileSync(dbFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading database file:', err);
        return [];
    }
};

const writeDatabase = (data: any) => {
    try {
        fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing database file:', err);
    }
};

app.get('/ping', (req, res) => {
    res.json({ success: true });
});

app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const submissions = readDatabase();
    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    submissions.push(newSubmission);
    writeDatabase(submissions);

    res.json({ success: true, submission: newSubmission });
});

app.get('/read', (req, res) => {
    const index = parseInt(req.query.index as string, 10);
    if (isNaN(index) || index < 0) {
        return res.status(400).json({ error: 'Invalid index' });
    }

    const submissions = readDatabase();
    if (index >= submissions.length) {
        return res.status(404).json({ error: 'Submission not found' });
    }

    res.json(submissions[index]);
});

app.get('/readAll', (req, res) => {
    const submissions = readDatabase();
    res.json(submissions);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
