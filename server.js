"use strict";
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./models/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const shiftRoutes = require('./routes/shiftRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

app.use('/api/users', userRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/analytics', analyticsRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'TrackIt is running' });
});

app.listen(PORT, function () {
    console.log("Server listening on port: " + PORT + "!");
});