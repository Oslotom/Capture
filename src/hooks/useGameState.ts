import { useState, useEffect } from 'react';
import { User, Activity, Territory, Challenge } from '../types';
import { MOCK_USER, MOCK_TERRITORIES, MOCK_CHALLENGES } from '../constants';

export function useGameState() {
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
            polygon: activity.route,
            area: activity.territoryClaimed,
            color: 'rgba(0, 229, 255, 0.3)',
            createdAt: Date.now()
        };
        setTerritories(prev => [...prev, newTerritory]);
    }
  };

  return {
    user,
    territories,
    challenges,
    addActivity,
    setUser
  };
}
