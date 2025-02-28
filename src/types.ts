// Campaign Types
export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  goal: number;
  current_amount: number;
  created_at: string;
  deadline: string;
  image_url: string;
  created_by: string;
  beneficiary_type: string;
  tags: string[];
  status: string;
  donor_count: number;
}

// Donation Types
export interface Donation {
  id: string;
  campaign_id: string;
  amount: number;
  donor_name: string;
  donor_email: string;
  message?: string;
  created_at: string;
  is_anonymous: boolean;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  created_at: string;
  campaigns: Campaign[];
  donations: Donation[];
}

// UI Types
export interface NavItem {
  title: string;
  path: string;
  icon?: React.ComponentType<any>;
}

// Suggestion Types
export interface CampaignSuggestion {
  id: string;
  campaign_id: string;
  title: string;
  description: string;
  type: 'content' | 'promotion' | 'audience';
  created_at: string;
}
