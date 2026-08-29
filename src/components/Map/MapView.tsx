import { MapContainer, TileLayer, Polygon, Polyline, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Territory, LatLng } from '../../types';
import { COLORS } from '../../constants';
import { useEffect } from 'react';
import { cn } from '../../lib/utils';

interface MapViewProps {
  center: LatLng;
  territories: Territory[];
  activeRoute?: LatLng[];
  currentPosition?: LatLng;
  onTerritoryClick?: (t: Territory) => void;
  className?: string;
}

// Helper to keep map in sync with state
function ChangeView({ center }: { center: LatLng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center, map]);
  return null;
}

export const MapView = ({ center, territories, activeRoute, currentPosition, onTerritoryClick, className }: MapViewProps) => {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={15}
      className={cn('w-full h-full z-0', className)}
      zoomControl={false}
      attributionControl={true}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ChangeView center={center} />

      {territories.map((t) => (
        <Polygon
          key={t.id}
          positions={t.polygon.map(p => [p.lat, p.lng])}
          pathOptions={{
            fillColor: t.color,
            fillOpacity: 0.3,
            color: t.strokeColor,
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
