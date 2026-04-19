function Sidebar({ markers, onMarkerClick, onDelete }) {
    if (markers.length === 0) {
        return (
            <div className="sidebar__markers-list">
                <div className="empty-state">
                    <div className="empty-state__icon">🗺️</div>
                    <div className="empty-state__title">No markers yet</div>
                    <div className="empty-state__text">
                        Upload a CSV or JSON file to populate the map with intelligence markers.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sidebar__markers-list">
            {markers.map((marker) => (
                <div
                    key={marker._id}
                    className="marker-card animate-fade-in"
                    onClick={() => onMarkerClick(marker)}
                >
                    <div className="marker-card__header">
                        <div className="marker-card__title">{marker.title}</div>
                        <span className="marker-card__category">{marker.category}</span>
                    </div>
                    {marker.description && (
                        <div className="marker-card__description">{marker.description}</div>
                    )}
                    <div className="marker-card__coords">
                        <span>📍 {marker.latitude?.toFixed(4)}, {marker.longitude?.toFixed(4)}</span>
                    </div>
                    <button
                        className="marker-card__delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(marker._id);
                        }}
                        title="Delete marker"
                    >
                        🗑️
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Sidebar;
