
// Campaign Types
export interface Campaign {
  location: React.ReactNode;
  imageUrl: string;
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
