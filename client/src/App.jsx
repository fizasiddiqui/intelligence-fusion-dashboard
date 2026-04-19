import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import FileUpload from './components/FileUpload';
import { getMarkers, deleteMarker } from './services/api';

function Dashboard() {
    const { user, logout } = useAuth();
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fetchMarkers = useCallback(async () => {
        try {
            const { data } = await getMarkers();
            setMarkers(data);
        } catch (err) {
            console.error('Failed to fetch markers:', err);
        }
    }, []);

    useEffect(() => {
        fetchMarkers();
    }, [fetchMarkers]);

    const handleUploadSuccess = useCallback((newMarkers) => {
        if (Array.isArray(newMarkers)) {
            setMarkers((prev) => [...newMarkers, ...prev]);
        } else {
            fetchMarkers();
        }
    }, [fetchMarkers]);

    const handleDelete = useCallback(async (id) => {
        try {
            await deleteMarker(id);
            setMarkers((prev) => prev.filter((m) => m._id !== id));
        } catch (err) {
            console.error('Failed to delete marker:', err);
        }
    }, []);

    const handleMarkerClick = useCallback((marker) => {
        setSelectedMarker(marker);
    }, []);

    const categories = [...new Set(markers.map((m) => m.category))];

    return (
        <>
            {/* Header */}
            <header className="app-header">
                <div className="app-header__logo">
                    <div className="app-header__icon">🛰️</div>
                    <div>
                        <div className="app-header__title">Intelligence Fusion Dashboard</div>
                        <div className="app-header__subtitle">Multi-Source Geospatial Intelligence Platform</div>
                    </div>
                </div>
                <div className="app-header__stats">
                    <div className="stat-badge">
                        📍 Markers <span className="stat-badge__value">{markers.length}</span>
                    </div>
                    <div className="stat-badge">
                        🏷️ Categories <span className="stat-badge__value">{categories.length}</span>
                    </div>
                    <div className="user-badge">
                        <span className="user-badge__name">👤 {user?.name}</span>
                        <button className="logout-btn" onClick={logout}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="app-container">
                {/* Sidebar */}
                <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
                    <div className="sidebar__section">
                        <div className="sidebar__section-title">📤 Upload Data</div>
                        <FileUpload onUploadSuccess={handleUploadSuccess} />
                    </div>
                    <div className="sidebar__section">
                        <div className="sidebar__section-title">
                            📋 Intel Reports ({markers.length})
                        </div>
                    </div>
                    <Sidebar
                        markers={markers}
                        onMarkerClick={handleMarkerClick}
                        onDelete={handleDelete}
                    />
                </aside>

                {/* Map */}
                <main className="map-container">
                    <MapView
                        markers={markers}
                        selectedMarker={selectedMarker}
                    />
                </main>
            </div>

            {/* Mobile toggle */}
            <button
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? '✕' : '☰'}
            </button>
        </>
    );
}

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="login-page">
                <div className="spinner" style={{ width: 32, height: 32 }} />
            </div>
        );
    }

    return user ? <Dashboard /> : <LoginPage />;
}

export default function AppWrapper() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}
