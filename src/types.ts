/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActivityType = 'RUN' | 'WALK' | 'BIKE';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Territory {
  id: string;
  ownerId: string;
  ownerName: string;
  polygon: LatLng[];
  area: number; // in km2
  color: string;
  strokeColor: string;
  createdAt: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  date: number;
  distance: number; // km
  duration: number; // seconds
  pace: string; // "5:58 /km"
  route: LatLng[];
  territoryClaimed: number; // area in km2
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  levelName: string;
  xp: number;
  nextLevelXp: number;
  territoryArea: number;
  totalDistance: number;
  activities: Activity[];
  rank: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  reward: number; // XP
  icon: string;
}

export interface FeedItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'CLAIM' | 'ACTIVITY' | 'CLUB';
  timestamp: number;
  content: string;
  stats: {
    area?: number;
    distance?: number;
    time?: string;
  };
}
