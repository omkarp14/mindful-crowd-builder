import React from 'react';

// Campaign Types
export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  goal: number;
  currentAmount: number;
  createdAt: string;
  deadline: string;
  image: string;
  createdBy: string;
  isActive: boolean;
  location?: string;
}

// Donation Types
export interface Donation {
  id: string;
  campaignId: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  message?: string;
  createdAt: string;
  isAnonymous: boolean;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
  campaigns: Campaign[];
  donations: Donation[];
}

// UI Types
export interface NavItem {
  title: string;
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ComponentType<any>;
}

// Suggestion Types
export interface CampaignSuggestion {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  type: 'content' | 'promotion' | 'audience';
  createdAt: string;
}

// Leaderboard Types
export interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  donationAmount: number;
  gameScore: number;
  rank: number;
  title: string; // e.g., "Queen Bee", "Worker Bee", etc.
  createdAt: string;
}

// Bee Game Types
export interface GameScore {
  id: string;
  userId: string;
  score: number;
  honeyCollected: number;
  timeSpent: number;
  createdAt: string;
}

export interface HoneyDrop {
  id: string;
  x: number;
  y: number;
  value: number;
  type: 'regular' | 'golden' | 'rainbow';
}

export interface GameState {
  score: number;
  timeRemaining: number;
  honeyDrops: HoneyDrop[];
  isGameActive: boolean;
  playerPosition: {
    x: number;
    y: number;
  };
}
