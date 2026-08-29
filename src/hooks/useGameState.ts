import { useState, useEffect } from 'react';
import * as turf from '@turf/turf';
import { User, Activity, Territory, LatLng, Challenge } from '../types';
import { MOCK_USER, MOCK_TERRITORIES, MOCK_CHALLENGES, COLORS, DEMO_DATA_VERSION } from '../constants';

// Discard locally-saved state left over from an older demo dataset so
// everyone picks up new mock territories instead of a stale cached copy.
function clearStaleDemoData() {
  if (localStorage.getItem('terrain_demo_version') !== String(DEMO_DATA_VERSION)) {
    localStorage.removeItem('terrain_user');
    localStorage.removeItem('terrain_territories');
    localStorage.removeItem('terrain_challenges');
    localStorage.setItem('terrain_demo_version', String(DEMO_DATA_VERSION));
  }
}

function toClosedRing(polygon: LatLng[]): number[][] {
  const ring = polygon.map(p => [p.lng, p.lat]);
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) ring.push(first);
  return ring;
}

// A difference can leave a MultiPolygon behind (e.g. a run splits a territory in two).
// We only store a single ring per territory, so keep the largest remaining piece.
function largestRing(feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>): LatLng[] {
  const rings = feature.geometry.type === 'Polygon'
    ? [feature.geometry.coordinates[0]]
    : feature.geometry.coordinates.map(poly => poly[0]);

  let best = rings[0];
  let bestArea = 0;
  for (const ring of rings) {
    const area = turf.area(turf.polygon([ring]));
    if (area > bestArea) {
      bestArea = area;
      best = ring;
    }
  }
  return best.map(([lng, lat]) => ({ lat, lng }));
}

export function useGameState() {
  clearStaleDemoData();

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('terrain_user');
    return saved ? JSON.parse(saved) : MOCK_USER;
  });

  const [territories, setTerritories] = useState<Territory[]>(() => {
    const saved = localStorage.getItem('terrain_territories');
    return saved ? JSON.parse(saved) : MOCK_TERRITORIES;
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('terrain_challenges');
    return saved ? JSON.parse(saved) : MOCK_CHALLENGES;
  });

  const [completedActivity, setCompletedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    localStorage.setItem('terrain_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('terrain_territories', JSON.stringify(territories));
  }, [territories]);

  useEffect(() => {
    localStorage.setItem('terrain_challenges', JSON.stringify(challenges));
  }, [challenges]);

  const addActivity = (activity: Activity) => {
    const newActivities = [activity, ...user.activities];
    const newTotalDistance = user.totalDistance + activity.distance;
    const newTotalTerritory = user.territoryArea + activity.territoryClaimed;
    const newXp = user.xp + (activity.territoryClaimed > 0 ? 500 : 100);

    // Level up logic
    let newLevel = user.level;
    if (newXp >= user.nextLevelXp) {
        newLevel++;
    }

    setUser(prev => ({
      ...prev,
      activities: newActivities,
      totalDistance: newTotalDistance,
      territoryArea: newTotalTerritory,
      xp: newXp,
      level: newLevel
    }));

    if (activity.territoryClaimed > 0) {
        const newTerritory: Territory = {
            id: `t-${Date.now()}`,
            ownerId: user.id,
            ownerName: user.name,
            polygon: activity.route,
            area: activity.territoryClaimed,
            color: COLORS.territory,
            strokeColor: '#3B82F6',
            createdAt: Date.now()
        };

        // Claim any overlap with other players' territory: whatever the new
        // loop covers is cut out of their polygon and becomes ours.
        const newPolygon = turf.polygon([toClosedRing(activity.route)]);

        setTerritories(prev => {
          const remaining: Territory[] = [];
          for (const t of prev) {
            if (t.ownerId === user.id) {
              remaining.push(t);
              continue;
            }
            const existingPolygon = turf.polygon([toClosedRing(t.polygon)]);
            if (!turf.booleanIntersects(newPolygon, existingPolygon)) {
              remaining.push(t);
              continue;
            }
            const remainder = turf.difference(turf.featureCollection([existingPolygon, newPolygon]));
            if (!remainder) continue; // fully captured, drop it

            const ring = largestRing(remainder);
            const area = turf.area(remainder) / 1_000_000;
            if (area < 0.001 || ring.length < 3) continue; // sliver left over, drop it

            remaining.push({ ...t, polygon: ring, area });
          }
          return [...remaining, newTerritory];
        });
    }
  };

  return {
    user,
    territories,
    challenges,
    addActivity,
    setUser,
    completedActivity,
    setCompletedActivity,
  };
}