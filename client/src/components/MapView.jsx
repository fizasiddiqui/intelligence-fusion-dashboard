import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { API_BASE } from '../services/api';

// Fix default marker icon issue in webpack/vite builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Category-based marker colors
const categoryColors = {
    Military: '#ef4444',
    Cyber: '#06b6d4',
    Surveillance: '#f59e0b',
    HUMINT: '#10b981',
    SIGINT: '#8b5cf6',
    OSINT: '#ec4899',
    General: '#6366f1',
};

function getMarkerIcon(category) {
    const color = categoryColors[category] || categoryColors.General;
    return L.divIcon({
        className: '',
        html: `
      <div style="
        width: 28px; height: 28px;
        background: ${color};
        border: 2px solid rgba(255,255,255,0.4);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 3px 12px ${color}66;
        display: flex; align-items: center; justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 12px; color: white;">📍</span>
      </div>
    `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -30],
    });
}

// Component to fly to a selected marker
function FlyToMarker({ marker }) {
    const map = useMap();
    useEffect(() => {
        if (marker) {
            map.flyTo([marker.latitude, marker.longitude], 14, {
                duration: 1.5,
            });
        }
    }, [marker, map]);
    return null;
}

function MapView({ markers, selectedMarker }) {
    const defaultCenter = [20.5937, 78.9629]; // India center
    const defaultZoom = 5;

    return (
        <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FlyToMarker marker={selectedMarker} />

            {markers.map((marker) => (
                <Marker
                    key={marker._id}
                    position={[marker.latitude, marker.longitude]}
                    icon={getMarkerIcon(marker.category)}
                >
                    <Popup maxWidth={300} minWidth={260}>
                        <div className="popup-content">
                            {marker.imageUrl && (
                                <img
                                    src={marker.imageUrl.startsWith('http') ? marker.imageUrl : `${API_BASE}${marker.imageUrl}`}
                                    alt={marker.title}
                                    className="popup-content__image"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            )}
                            <div className="popup-content__body">
                                <div className="popup-content__title">{marker.title}</div>
                                <span className="popup-content__category">{marker.category}</span>
                                {marker.description && (
                                    <p className="popup-content__description">{marker.description}</p>
                                )}
                                <div className="popup-content__meta">
                                    <span className="popup-content__meta-label">Latitude</span>
                                    <span>{marker.latitude?.toFixed(4)}</span>
                                    <span className="popup-content__meta-label">Longitude</span>
                                    <span>{marker.longitude?.toFixed(4)}</span>
                                    {marker.createdAt && (
                                        <>
                                            <span className="popup-content__meta-label">Added</span>
                                            <span>{new Date(marker.createdAt).toLocaleDateString()}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default MapView;
