export interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  goal: number;
  currentAmount: number;
  deadline: string;
  location: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  donationAmount: number;
  gameScore: number;
  rank: number;
  title: string;
  createdAt: string;
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

export interface HoneyDrop {
  id: string;
  x: number;
  y: number;
  value: number;
  type: 'regular' | 'golden' | 'rainbow';
} 