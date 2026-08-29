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
  opponent4: 'rgba(236, 72, 153, 0.2)',
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

// Moss, Norway (59.4370 N, 10.6605 E)
export const MOCK_TERRITORIES: Territory[] = [
  {
    id: 't1',
    ownerId: 'user-1',
    ownerName: 'Alex',
    area: 2.5,
    color: COLORS.territory,
    strokeColor: '#3B82F6',
    createdAt: Date.now() - 86400000,
    polygon: [
      { lat: 59.4370, lng: 10.6605 },
      { lat: 59.4405, lng: 10.6660 },
      { lat: 59.4425, lng: 10.6580 },
      { lat: 59.4380, lng: 10.6540 },
    ]
  },
  {
    id: 't2',
    ownerId: 'user-2',
    ownerName: 'Sarah',
    area: 1.8,
    color: COLORS.opponent1,
    strokeColor: '#EF4444',
    createdAt: Date.now() - 172800000,
    polygon: [
      { lat: 59.4450, lng: 10.6520 },
      { lat: 59.4480, lng: 10.6570 },
      { lat: 59.4460, lng: 10.6480 },
    ]
  },
  {
    id: 't3',
    ownerId: 'user-3',
    ownerName: 'Jonas',
    area: 1.4,
    color: COLORS.opponent2,
    strokeColor: '#8B5CF6',
    createdAt: Date.now() - 259200000,
    polygon: [
      { lat: 59.4310, lng: 10.6650 },
      { lat: 59.4335, lng: 10.6710 },
      { lat: 59.4290, lng: 10.6730 },
      { lat: 59.4275, lng: 10.6660 },
    ]
  },
  {
    id: 't4',
    ownerId: 'user-4',
    ownerName: 'Elena',
    area: 1.1,
    color: COLORS.opponent3,
    strokeColor: '#F97316',
    createdAt: Date.now() - 345600000,
    polygon: [
      { lat: 59.4400, lng: 10.6720 },
      { lat: 59.4425, lng: 10.6790 },
      { lat: 59.4380, lng: 10.6780 },
    ]
  },
  {
    id: 't5',
    ownerId: 'user-5',
    ownerName: 'Kristian',
    area: 0.9,
    color: COLORS.opponent4,
    strokeColor: '#EC4899',
    createdAt: Date.now() - 432000000,
    polygon: [
      { lat: 59.4330, lng: 10.6480 },
      { lat: 59.4355, lng: 10.6530 },
      { lat: 59.4310, lng: 10.6540 },
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
