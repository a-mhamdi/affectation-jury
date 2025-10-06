const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const HOSTNAME = process.env.APP_HOSTNAME;
const PORT = process.env.JURY_PORT;

const NODE_ENV = process.env.NODE_ENV || 'development';

// MongoDB connection
// const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;
// MongoDB connection
const MONGO_URI = NODE_ENV === 'production'? process.env.DB_URI: process.env.MONGO_URI_DEV;

// const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI);

// Define a schema and model
const DataSchema = new mongoose.Schema({
    juryinit: JSON,
    juryperf: JSON,
});

const EnseignantSchema = new mongoose.Schema({
    name: String,
});

// Create models
const DataModel = mongoose.model('students', DataSchema);
const Teachers = mongoose.model('teachers', EnseignantSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Search for a student by id
app.get('/api/data', async (req, res) => {
    const identifiant = req.query.identifiant;

    if (!identifiant) {
        return res.status(400).json({ error: 'Identifiant query parameter is required.' });
    }

    try {
        const results = await DataModel.find({ identifiant: identifiant });
        res.json(results);
    } catch (error) {
        console.error('Error searching for student:', error);
        res.status(500).json({ error: 'Error searching for student.' });
    }
});

// API to get jury members
app.get('/api/getJury', async (req, res) => {
    try {
        const enseignants = await Teachers.find().sort({ name: 1 });
        res.json(enseignants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update the candidate's data
app.put('/api/data/:id', async (req, res) => {
    const studentId = req.params.id;
    const updates = req.body;

    try {
        await DataModel.findByIdAndUpdate(studentId, { $set: updates }, { new: true });
        return res.json({ msg: 'Data saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating data.' });
    }
});

app.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
});
