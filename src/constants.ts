import { Activity, Challenge, FeedItem, Territory, User } from "./types";

// Bump whenever MOCK_TERRITORIES/MOCK_USER/MOCK_CHALLENGES change so
// devices with stale locally-saved state pick up the new demo data.
export const DEMO_DATA_VERSION = 3;

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

// Demo territories around Fuglevikveien, 1570 Dilling (59.391757 N, 10.666610 E)
// Each is a ~500 m2 plot (roughly 22m x 22m)
export const MOCK_TERRITORIES: Territory[] = [
  // Sarah — 3 captured areas
  {
    id: 't1',
    ownerId: 'user-2',
    ownerName: 'Sarah',
    area: 0.0005,
    color: COLORS.opponent1,
    strokeColor: '#EF4444',
    createdAt: Date.now() - 172800000,
    polygon: [
      { lat: 59.392757, lng: 10.664410 },
      { lat: 59.392757, lng: 10.664810 },
      { lat: 59.392557, lng: 10.664810 },
      { lat: 59.392557, lng: 10.664410 },
    ]
  },
  {
    id: 't2',
    ownerId: 'user-2',
    ownerName: 'Sarah',
    area: 0.0005,
    color: COLORS.opponent1,
    strokeColor: '#EF4444',
    createdAt: Date.now() - 259200000,
    polygon: [
      { lat: 59.391857, lng: 10.666410 },
      { lat: 59.391857, lng: 10.666810 },
      { lat: 59.391657, lng: 10.666810 },
      { lat: 59.391657, lng: 10.666410 },
    ]
  },
  {
    id: 't3',
    ownerId: 'user-2',
    ownerName: 'Sarah',
    area: 0.0005,
    color: COLORS.opponent1,
    strokeColor: '#EF4444',
    createdAt: Date.now() - 345600000,
    polygon: [
      { lat: 59.390657, lng: 10.668610 },
      { lat: 59.390657, lng: 10.669010 },
      { lat: 59.390457, lng: 10.669010 },
      { lat: 59.390457, lng: 10.668610 },
    ]
  },

  // Jonas — 3 captured areas
  {
    id: 't4',
    ownerId: 'user-3',
    ownerName: 'Jonas',
    area: 0.0005,
    color: COLORS.opponent2,
    strokeColor: '#8B5CF6',
    createdAt: Date.now() - 216000000,
    polygon: [
      { lat: 59.393657, lng: 10.667410 },
      { lat: 59.393657, lng: 10.667810 },
      { lat: 59.393457, lng: 10.667810 },
      { lat: 59.393457, lng: 10.667410 },
    ]
  },
  {
    id: 't5',
    ownerId: 'user-3',
    ownerName: 'Jonas',
    area: 0.0005,
    color: COLORS.opponent2,
    strokeColor: '#8B5CF6',
    createdAt: Date.now() - 302400000,
    polygon: [
      { lat: 59.391257, lng: 10.663810 },
      { lat: 59.391257, lng: 10.664210 },
      { lat: 59.391057, lng: 10.664210 },
      { lat: 59.391057, lng: 10.663810 },
    ]
  },
  {
    id: 't6',
    ownerId: 'user-3',
    ownerName: 'Jonas',
    area: 0.0005,
    color: COLORS.opponent2,
    strokeColor: '#8B5CF6',
    createdAt: Date.now() - 388800000,
    polygon: [
      { lat: 59.392257, lng: 10.669610 },
      { lat: 59.392257, lng: 10.670010 },
      { lat: 59.392057, lng: 10.670010 },
      { lat: 59.392057, lng: 10.669610 },
    ]
  },

  // Elena — 3 captured areas
  {
    id: 't7',
    ownerId: 'user-4',
    ownerName: 'Elena',
    area: 0.0005,
    color: COLORS.opponent3,
    strokeColor: '#F97316',
    createdAt: Date.now() - 259200000,
    polygon: [
      { lat: 59.389857, lng: 10.667010 },
      { lat: 59.389857, lng: 10.667410 },
      { lat: 59.389657, lng: 10.667410 },
      { lat: 59.389657, lng: 10.667010 },
    ]
  },
  {
    id: 't8',
    ownerId: 'user-4',
    ownerName: 'Elena',
    area: 0.0005,
    color: COLORS.opponent3,
    strokeColor: '#F97316',
    createdAt: Date.now() - 345600000,
    polygon: [
      { lat: 59.394057, lng: 10.663010 },
      { lat: 59.394057, lng: 10.663410 },
      { lat: 59.393857, lng: 10.663410 },
      { lat: 59.393857, lng: 10.663010 },
    ]
  },
  {
    id: 't9',
    ownerId: 'user-4',
    ownerName: 'Elena',
    area: 0.0005,
    color: COLORS.opponent3,
    strokeColor: '#F97316',
    createdAt: Date.now() - 432000000,
    polygon: [
      { lat: 59.389257, lng: 10.665210 },
      { lat: 59.389257, lng: 10.665610 },
      { lat: 59.389057, lng: 10.665610 },
      { lat: 59.389057, lng: 10.665210 },
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
