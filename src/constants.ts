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

// Demo territories around Fuglevikveien 55, Dilling (59.388991 N, 10.653878 E)
export const MOCK_TERRITORIES: Territory[] = [
  // Sarah — 3 captured areas
  {
    id: 't1',
    ownerId: 'user-2',
    ownerName: 'Sarah',
    area: 0.42,
    color: COLORS.opponent1,
    strokeColor: '#EF4444',
    createdAt: Date.now() - 172800000,
    polygon: [
      { lat: 59.3820, lng: 10.6390 },
      { lat: 59.3850, lng: 10.6420 },
      { lat: 59.3835, lng: 10.6460 },
      { lat: 59.3805, lng: 10.6430 },
    ]
  },
  {
    id: 't2',
    ownerId: 'user-2',
    ownerName: 'Sarah',
    area: 0.58,
    color: COLORS.opponent1,
    strokeColor: '#EF4444',
    createdAt: Date.now() - 259200000,
    polygon: [
      { lat: 59.3880, lng: 10.6510 },
      { lat: 59.3915, lng: 10.6545 },
      { lat: 59.3895, lng: 10.6580 },
      { lat: 59.3865, lng: 10.6555 },
    ]
  },
  {
    id: 't3',
    ownerId: 'user-2',
    ownerName: 'Sarah',
    area: 0.35,
    color: COLORS.opponent1,
    strokeColor: '#EF4444',
    createdAt: Date.now() - 345600000,
    polygon: [
      { lat: 59.3935, lng: 10.6630 },
      { lat: 59.3960, lng: 10.6655 },
      { lat: 59.3945, lng: 10.6690 },
      { lat: 59.3920, lng: 10.6665 },
    ]
  },

  // Jonas — 3 captured areas
  {
    id: 't4',
    ownerId: 'user-3',
    ownerName: 'Jonas',
    area: 0.48,
    color: COLORS.opponent2,
    strokeColor: '#8B5CF6',
    createdAt: Date.now() - 216000000,
    polygon: [
      { lat: 59.3805, lng: 10.6570 },
      { lat: 59.3835, lng: 10.6600 },
      { lat: 59.3815, lng: 10.6640 },
      { lat: 59.3785, lng: 10.6610 },
    ]
  },
  {
    id: 't5',
    ownerId: 'user-3',
    ownerName: 'Jonas',
    area: 0.39,
    color: COLORS.opponent2,
    strokeColor: '#8B5CF6',
    createdAt: Date.now() - 302400000,
    polygon: [
      { lat: 59.3870, lng: 10.6400 },
      { lat: 59.3895, lng: 10.6425 },
      { lat: 59.3880, lng: 10.6455 },
      { lat: 59.3855, lng: 10.6430 },
    ]
  },
  {
    id: 't6',
    ownerId: 'user-3',
    ownerName: 'Jonas',
    area: 0.6,
    color: COLORS.opponent2,
    strokeColor: '#8B5CF6',
    createdAt: Date.now() - 388800000,
    polygon: [
      { lat: 59.3950, lng: 10.6470 },
      { lat: 59.3980, lng: 10.6500 },
      { lat: 59.3960, lng: 10.6540 },
      { lat: 59.3930, lng: 10.6510 },
    ]
  },

  // Elena — 3 captured areas
  {
    id: 't7',
    ownerId: 'user-4',
    ownerName: 'Elena',
    area: 0.33,
    color: COLORS.opponent3,
    strokeColor: '#F97316',
    createdAt: Date.now() - 259200000,
    polygon: [
      { lat: 59.3900, lng: 10.6610 },
      { lat: 59.3925, lng: 10.6635 },
      { lat: 59.3910, lng: 10.6665 },
      { lat: 59.3885, lng: 10.6640 },
    ]
  },
  {
    id: 't8',
    ownerId: 'user-4',
    ownerName: 'Elena',
    area: 0.51,
    color: COLORS.opponent3,
    strokeColor: '#F97316',
    createdAt: Date.now() - 345600000,
    polygon: [
      { lat: 59.3945, lng: 10.6560 },
      { lat: 59.3975, lng: 10.6590 },
      { lat: 59.3955, lng: 10.6625 },
      { lat: 59.3925, lng: 10.6595 },
    ]
  },
  {
    id: 't9',
    ownerId: 'user-4',
    ownerName: 'Elena',
    area: 0.4,
    color: COLORS.opponent3,
    strokeColor: '#F97316',
    createdAt: Date.now() - 432000000,
    polygon: [
      { lat: 59.3830, lng: 10.6480 },
      { lat: 59.3855, lng: 10.6505 },
      { lat: 59.3840, lng: 10.6535 },
      { lat: 59.3815, lng: 10.6510 },
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
