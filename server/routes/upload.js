const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');
const { Readable } = require('stream');
const Marker = require('../models/Marker');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedImage = /jpeg|jpg|png|gif|webp|svg/;
        const allowedData = /csv|json/;
        const ext = path.extname(file.originalname).toLowerCase().slice(1);
        const mime = file.mimetype;

        if (allowedImage.test(ext) || mime.startsWith('image/')) {
            cb(null, true);
        } else if (allowedData.test(ext) || mime === 'application/json' || mime === 'text/csv') {
            cb(null, true);
        } else {
            cb(new Error('Only image, CSV, and JSON files are allowed'));
        }
    },
});

// POST upload image — returns the URL
router.post('/image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl, filename: req.file.originalname });
});

// POST upload CSV or JSON data file — bulk insert markers
router.post('/data', upload.single('datafile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No data file provided' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();

    try {
        let records = [];

        if (ext === '.json') {
            const raw = fs.readFileSync(req.file.path, 'utf-8');
            const parsed = JSON.parse(raw);
            records = Array.isArray(parsed) ? parsed : [parsed];
        } else if (ext === '.csv') {
            records = await new Promise((resolve, reject) => {
                const rows = [];
                const stream = Readable.from(fs.readFileSync(req.file.path, 'utf-8'));
                stream
                    .pipe(csvParser())
                    .on('data', (row) => rows.push(row))
                    .on('end', () => resolve(rows))
                    .on('error', reject);
            });
        } else {
            return res.status(400).json({ error: 'Unsupported file type. Use CSV or JSON.' });
        }

        // Normalize and validate records
        const markers = records
            .filter((r) => r.latitude && r.longitude)
            .map((r) => ({
                title: r.title || r.name || 'Untitled',
                description: r.description || r.desc || '',
                latitude: parseFloat(r.latitude || r.lat),
                longitude: parseFloat(r.longitude || r.lng || r.lon),
                category: r.category || r.type || 'General',
                imageUrl: r.imageUrl || r.image || '',
                metadata: r.metadata || {},
            }));

        if (markers.length === 0) {
            return res.status(400).json({ error: 'No valid records found. Ensure latitude and longitude columns exist.' });
        }

        const inserted = await Marker.insertMany(markers);

        // Clean up the uploaded data file
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            message: `Successfully imported ${inserted.length} markers`,
            count: inserted.length,
            markers: inserted,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
