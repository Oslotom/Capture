import { MapContainer, TileLayer, Polygon, Polyline, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Territory, LatLng } from '../../types';
import { COLORS } from '../../constants';
import { useEffect } from 'react';

interface MapViewProps {
  center: LatLng;
  territories: Territory[];
  activeRoute?: LatLng[];
  currentPosition?: LatLng;
  onTerritoryClick?: (t: Territory) => void;
}

// Helper to keep map in sync with state
function ChangeView({ center }: { center: LatLng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center, map]);
  return null;
}

export const MapView = ({ center, territories, activeRoute, currentPosition, onTerritoryClick }: MapViewProps) => {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={15}
      className="w-full h-full"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView center={center} />

      {territories.map((t) => (
        <Polygon
          key={t.id}
          positions={t.polygon.map(p => [p.lat, p.lng])}
          pathOptions={{
            fillColor: t.color,
            fillOpacity: 0.3,
            color: '#3B82F6', // Solid Blue stroke
            weight: 3
          }}
          eventHandlers={{
            click: () => onTerritoryClick?.(t)
          }}
        />
      ))}

      {activeRoute && activeRoute.length > 1 && (
        <Polyline
          positions={activeRoute.map(p => [p.lat, p.lng])}
          pathOptions={{
            color: COLORS.accent,
            weight: 6,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      )}

      {currentPosition && (
        <CircleMarker
          center={[currentPosition.lat, currentPosition.lng]}
          radius={8}
          pathOptions={{
            fillColor: COLORS.accent,
            fillOpacity: 1,
            color: 'white',
            weight: 2
          }}
        />
      )}
    </MapContainer>
  );
};
