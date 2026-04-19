const express = require('express');
const router = express.Router();
const Marker = require('../models/Marker');

// GET all markers
router.get('/', async (req, res) => {
    try {
        const markers = await Marker.find().sort({ createdAt: -1 });
        res.json(markers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a marker
router.post('/', async (req, res) => {
    try {
        const { title, description, latitude, longitude, category, imageUrl, metadata } = req.body;
        const marker = await Marker.create({
            title,
            description,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            category,
            imageUrl,
            metadata,
        });
        res.status(201).json(marker);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a marker
router.delete('/:id', async (req, res) => {
    try {
        await Marker.findByIdAndDelete(req.params.id);
        res.json({ message: 'Marker deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
