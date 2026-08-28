import { Activity, Challenge, FeedItem, Territory, User } from "./types";

export const COLORS = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F3F5',
  textPrimary: '#090A0C',
  textSecondary: '#6C757D',
  accent: '#32E03F', // Vibrant Lime
  territory: 'rgba(59, 130, 246, 0.25)', // Blue as in image
  opponent1: 'rgba(239, 68, 68, 0.2)',
  opponent2: 'rgba(139, 92, 246, 0.2)',
};

export const LEVELS = [
  "Explorer",
  "Scout",
  "Runner",
  "Conqueror",
  "Territory Master"
];

// Mock Data
export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop',
  level: 3,
  levelName: 'Runner',
  xp: 2450,
  nextLevelXp: 5000,
  territoryArea: 8.7,
  totalDistance: 124,
  activities: [],
  rank: 3,
};

export const MOCK_TERRITORIES: Territory[] = [
  {
    id: 't1',
    ownerId: 'user-1',
    area: 2.5,
    color: COLORS.territory,
    createdAt: Date.now() - 86400000,
    polygon: [
      { lat: 51.505, lng: -0.09 },
      { lat: 51.51, lng: -0.08 },
      { lat: 51.515, lng: -0.1 },
      { lat: 51.505, lng: -0.11 },
    ]
  },
  {
    id: 't2',
    ownerId: 'user-2',
    area: 1.8,
    color: COLORS.opponent1,
    createdAt: Date.now() - 172800000,
    polygon: [
      { lat: 51.52, lng: -0.07 },
      { lat: 51.525, lng: -0.06 },
      { lat: 51.53, lng: -0.08 },
    ]
  }
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'CLAIM 5 KM²',
    description: 'Enclose more territory to reach the goal.',
    progress: 3.7,
    target: 5.0,
    unit: 'km²',
    reward: 500,
    icon: 'Map'
  },
  {
    id: 'c2',
    title: 'WEEKLY DISTANCE',
    description: 'Run 20 km this week.',
    progress: 12.4,
    target: 20.0,
    unit: 'km',
    reward: 750,
    icon: 'Activity'
  }
];

export const MOCK_FEED: FeedItem[] = [
  {
    id: 'f1',
    userId: 'user-2',
    userName: 'Sarah',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    type: 'CLAIM',
    timestamp: Date.now() - 7200000,
    content: 'claimed 1.2 km²',
    stats: { area: 1.2 }
  },
  {
    id: 'f2',
    userId: 'user-3',
    userName: 'Jonas',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    type: 'ACTIVITY',
    timestamp: Date.now() - 14400000,
    content: 'completed a 10.4 km run',
    stats: { distance: 10.4, time: '52:10' }
  }
];
