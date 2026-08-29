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
  opponent3: 'rgba(249, 115, 22, 0.2)',
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

// Demo territories around 59.388991, 10.653878 (Moss, Norway)
export const MOCK_TERRITORIES: Territory[] = [
  {
    id: 't1',
    ownerId: 'user-2',
    ownerName: 'Sarah',
    area: 1.8,
    color: COLORS.opponent1,
    strokeColor: '#EF4444',
    createdAt: Date.now() - 172800000,
    polygon: [
      { lat: 59.3905, lng: 10.6500 },
      { lat: 59.3935, lng: 10.6550 },
      { lat: 59.3915, lng: 10.6460 },
    ]
  },
  {
    id: 't2',
    ownerId: 'user-3',
    ownerName: 'Jonas',
    area: 1.4,
    color: COLORS.opponent2,
    strokeColor: '#8B5CF6',
    createdAt: Date.now() - 259200000,
    polygon: [
      { lat: 59.3870, lng: 10.6580 },
      { lat: 59.3895, lng: 10.6640 },
      { lat: 59.3850, lng: 10.6660 },
      { lat: 59.3835, lng: 10.6590 },
    ]
  },
  {
    id: 't3',
    ownerId: 'user-4',
    ownerName: 'Elena',
    area: 1.1,
    color: COLORS.opponent3,
    strokeColor: '#F97316',
    createdAt: Date.now() - 345600000,
    polygon: [
      { lat: 59.3925, lng: 10.6600 },
      { lat: 59.3950, lng: 10.6670 },
      { lat: 59.3905, lng: 10.6660 },
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
