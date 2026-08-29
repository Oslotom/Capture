import { Activity, Challenge, FeedItem, Territory, User } from "./types";

// Bump whenever MOCK_TERRITORIES/MOCK_USER/MOCK_CHALLENGES change so
// devices with stale locally-saved state pick up the new demo data.
export const DEMO_DATA_VERSION = 5;

export const COLORS = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F3F5',
  textPrimary: '#090A0C',
  textSecondary: '#6C757D',
  accent: '#32E03F', // Vibrant Lime
  territory: 'rgba(59, 130, 246, 0.25)', // Blue as in image
  opponent1: 'rgba(244, 63, 94, 0.22)', // Rose
  opponent2: 'rgba(20, 184, 166, 0.22)', // Teal
  opponent3: 'rgba(139, 92, 246, 0.22)', // Violet
  opponent4: 'rgba(234, 179, 8, 0.22)', // Yellow
  opponent5: 'rgba(239, 68, 68, 0.22)', // Red
  opponent6: 'rgba(59, 130, 246, 0.22)', // Blue
  opponent7: 'rgba(34, 197, 94, 0.22)', // Green
  opponent8: 'rgba(249, 115, 22, 0.22)', // Orange
};

export const LEVELS = [
  "Utforsker",
  "Speider",
  "Løper",
  "Erobrer",
  "Områdemester"
];

// Mock Data
export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop',
  level: 3,
  levelName: 'Løper',
  xp: 2450,
  nextLevelXp: 5000,
  territoryArea: 8.7,
  totalDistance: 124,
  activities: [],
  rank: 3,
};

// Demo territories around the wider Moss/Dilling area — organic multi-sided
// polygons (not squares), ~7.6 km2 total, with a few areas overlapping
// between owners to show contested ground.
export const MOCK_TERRITORIES: Territory[] = [
  {
    id: 't1',
    ownerId: 'user-2',
    ownerName: 'Sarah',
    area: 1.709,
    color: COLORS.opponent1,
    strokeColor: '#F43F5E',
    createdAt: Date.now() - 172800000,
    polygon: [
      { lat: 59.411695, lng: 10.649829 },
      { lat: 59.409729, lng: 10.667013 },
      { lat: 59.403753, lng: 10.661894 },
      { lat: 59.399589, lng: 10.656302 },
      { lat: 59.398162, lng: 10.646372 },
      { lat: 59.403753, lng: 10.634323 },
      { lat: 59.409314, lng: 10.642186 },
    ]
  },
  {
    id: 't2',
    ownerId: 'user-2',
    ownerName: 'Sarah',
    area: 0.967,
    color: COLORS.opponent1,
    strokeColor: '#F43F5E',
    createdAt: Date.now() - 259200000,
    polygon: [
      { lat: 59.38929, lng: 10.673341 },
      { lat: 59.386028, lng: 10.681997 },
      { lat: 59.382799, lng: 10.685933 },
      { lat: 59.379508, lng: 10.675029 },
      { lat: 59.381093, lng: 10.663664 },
      { lat: 59.387746, lng: 10.662815 },
    ]
  },
  {
    id: 't3',
    ownerId: 'user-3',
    ownerName: 'Jonas',
    area: 1.63,
    color: COLORS.opponent2,
    strokeColor: '#14B8A6',
    createdAt: Date.now() - 216000000,
    polygon: [
      { lat: 59.409664, lng: 10.664578 },
      { lat: 59.405956, lng: 10.671891 },
      { lat: 59.402467, lng: 10.677283 },
      { lat: 59.396242, lng: 10.673208 },
      { lat: 59.397443, lng: 10.662501 },
      { lat: 59.397599, lng: 10.652228 },
      { lat: 59.401459, lng: 10.647096 },
      { lat: 59.406173, lng: 10.652834 },
    ]
  },
  {
    id: 't4',
    ownerId: 'user-3',
    ownerName: 'Jonas',
    area: 0.985,
    color: COLORS.opponent2,
    strokeColor: '#14B8A6',
    createdAt: Date.now() - 302400000,
    polygon: [
      { lat: 59.426748, lng: 10.640979 },
      { lat: 59.421833, lng: 10.653038 },
      { lat: 59.418144, lng: 10.652361 },
      { lat: 59.416143, lng: 10.643397 },
      { lat: 59.417507, lng: 10.633595 },
      { lat: 59.42358, lng: 10.631416 },
    ]
  },
  {
    id: 't5',
    ownerId: 'user-4',
    ownerName: 'Elena',
    area: 1.139,
    color: COLORS.opponent3,
    strokeColor: '#8B5CF6',
    createdAt: Date.now() - 388800000,
    polygon: [
      { lat: 59.427698, lng: 10.643072 },
      { lat: 59.424912, lng: 10.651779 },
      { lat: 59.421214, lng: 10.659702 },
      { lat: 59.4185, lng: 10.651414 },
      { lat: 59.416635, lng: 10.63612 },
      { lat: 59.421115, lng: 10.632342 },
      { lat: 59.42629, lng: 10.637115 },
    ]
  },
  {
    id: 't6',
    ownerId: 'user-4',
    ownerName: 'Elena',
    area: 1.189,
    color: COLORS.opponent3,
    strokeColor: '#8B5CF6',
    createdAt: Date.now() - 432000000,
    polygon: [
      { lat: 59.396531, lng: 10.693391 },
      { lat: 59.392219, lng: 10.698333 },
      { lat: 59.384804, lng: 10.701399 },
      { lat: 59.384841, lng: 10.692284 },
      { lat: 59.386146, lng: 10.677627 },
      { lat: 59.392122, lng: 10.679496 },
    ]
  },
  {
    id: 't7',
    ownerId: 'user-5',
    ownerName: 'Liam',
    area: 1.5,
    color: COLORS.opponent4,
    strokeColor: '#EAB308',
    createdAt: Date.now() - 500000000,
    polygon: [
      { lat: 59.43, lng: 10.65 },
      { lat: 59.425, lng: 10.66 },
      { lat: 59.42, lng: 10.655 },
      { lat: 59.425, lng: 10.645 },
    ]
  },
  {
    id: 't8',
    ownerId: 'user-6',
    ownerName: 'Olivia',
    area: 2.0,
    color: COLORS.opponent5,
    strokeColor: '#EF4444',
    createdAt: Date.now() - 550000000,
    polygon: [
      { lat: 59.4, lng: 10.7 },
      { lat: 59.395, lng: 10.71 },
      { lat: 59.39, lng: 10.705 },
      { lat: 59.395, lng: 10.695 },
    ]
  },
  {
    id: 't9',
    ownerId: 'user-7',
    ownerName: 'Noah',
    area: 1.2,
    color: COLORS.opponent6,
    strokeColor: '#3B82F6',
    createdAt: Date.now() - 600000000,
    polygon: [
      { lat: 59.41, lng: 10.6 },
      { lat: 59.405, lng: 10.61 },
      { lat: 59.4, lng: 10.605 },
      { lat: 59.405, lng: 10.595 },
    ]
  },
  {
    id: 't10',
    ownerId: 'user-8',
    ownerName: 'Emma',
    area: 1.8,
    color: COLORS.opponent7,
    strokeColor: '#22C55E',
    createdAt: Date.now() - 650000000,
    polygon: [
      { lat: 59.44, lng: 10.62 },
      { lat: 59.435, lng: 10.63 },
      { lat: 59.43, lng: 10.625 },
      { lat: 59.435, lng: 10.615 },
    ]
  },
  {
    id: 't11',
    ownerId: 'user-9',
    ownerName: 'Ava',
    area: 2.2,
    color: COLORS.opponent8,
    strokeColor: '#F97316',
    createdAt: Date.now() - 700000000,
    polygon: [
      { lat: 59.38, lng: 10.65 },
      { lat: 59.375, lng: 10.66 },
      { lat: 59.37, lng: 10.655 },
      { lat: 59.375, lng: 10.645 },
    ]
  }
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'EROBRE 5 KM²',
    description: 'Inneslutt mer territorium for å nå målet.',
    progress: 3.7,
    target: 5.0,
    unit: 'km²',
    reward: 500,
    icon: 'Map'
  },
  {
    id: 'c2',
    title: 'UKENTLIG DISTANSE',
    description: 'Løp 20 km denne uken.',
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
    content: 'erobret 1.2 km²',
    stats: { area: 1.2 }
  },
  {
    id: 'f2',
    userId: 'user-3',
    userName: 'Jonas',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    type: 'ACTIVITY',
    timestamp: Date.now() - 14400000,
    content: 'fullførte en 10.4 km løpetur',
    stats: { distance: 10.4, time: '52:10' }
  }
];