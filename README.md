# Intelligence Fusion Dashboard

A full-stack MERN application for uploading and visualizing geospatial intelligence data on an interactive map.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen) ![Leaflet](https://img.shields.io/badge/Leaflet-Map-orange)

## Features

- 🗺️ **Interactive Map** — Leaflet-powered map with OpenStreetMap tiles
- 📍 **Geospatial Markers** — Color-coded by category with rich popups
- 📤 **Drag & Drop Upload** — CSV, JSON, and image file support
- 🖼️ **Image Popups** — Hover over markers to see metadata + images
- 🔍 **Sidebar Panel** — Browse, search, and click-to-fly to markers
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile

## Prerequisites

- **Node.js** 18+ — [Download](https://nodejs.org/)
- **MongoDB** — Running locally on `mongodb://localhost:27017` or [MongoDB Atlas](https://www.mongodb.com/atlas)

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd intelligence-fusion-dashboard/server
npm install

# Frontend
cd ../client
npm install
```

### 2. Start MongoDB

Make sure MongoDB is running locally:
```bash
mongod
```

### 3. Start Backend Server

```bash
cd server
npm run dev
```
Server starts on **http://localhost:5000**

### 4. Start Frontend

```bash
cd client
npm run dev
```
Frontend starts on **http://localhost:5173**

### 5. Open the App

Visit **http://localhost:5173** in your browser.

## Sample Data

Use the included `sample-data.csv` or `sample-data.json` files to test:

1. Open the app
2. Drag and drop a sample file onto the upload area
3. Markers will appear on the map

### CSV Format
```csv
title,latitude,longitude,description,category
Location Alpha,28.6139,77.2090,Intelligence hub in New Delhi,HUMINT
```

### JSON Format
```json
[
  {
    "title": "Location Alpha",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "description": "Intelligence hub in New Delhi",
    "category": "HUMINT"
  }
]
```

## Folder Structure

```
intelligence-fusion-dashboard/
├── server/                  # Backend API
│   ├── config/db.js         # MongoDB connection
│   ├── models/Marker.js     # Mongoose schema
│   ├── routes/markers.js    # CRUD endpoints
│   ├── routes/upload.js     # File upload endpoints
│   ├── uploads/             # Stored images
│   ├── index.js             # Express server
│   └── .env                 # Environment variables
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapView.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── vite.config.js
│   └── index.html
├── sample-data.csv
├── sample-data.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/markers` | Get all markers |
| POST | `/api/markers` | Create a marker |
| DELETE | `/api/markers/:id` | Delete a marker |
| POST | `/api/upload/data` | Upload CSV/JSON file |
| POST | `/api/upload/image` | Upload an image |
| GET | `/api/health` | Health check |

## Environment Variables

Create `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/intel_fusion
PORT=5000
```
