const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 13579;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/dept-ge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
app.use(express.static('public')); // Serve static files from the public folder

// API endpoint to search for a student by id
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

// API endpoint to update a student's data
app.put('/api/data/:id', async (req, res) => {
  const studentId = req.params.id;
  const updates = req.body;

  try {

    await DataModel.findByIdAndUpdate(studentId, updates, { upsert: true });
    return res.json({ msg: 'Données enregistrées avec succès !' });

  } catch (error) {
    res.status(500).json({ error: 'Error updating data.' });
  }
});

/* ----- END ----- */
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
