import { Campaign, Donation, User, CampaignSuggestion } from '../types';

// Mock campaigns data
export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Clean Water Initiative',
    description: 'Providing clean water to communities in need around the world.',
    category: 'Environment',
    goal: 50000,
    current_amount: 27500,
    created_at: '2023-06-15T08:00:00Z',
    deadline: '2023-12-31T23:59:59Z',
    image_url: '/images/campaign1.jpg',
    created_by: 'user1',
    beneficiary_type: 'Community',
    tags: ['water', 'environment', 'community'],
    status: 'active',
    donor_count: 150
  },
  {
    id: '2',
    title: 'Education for All',
    description: 'Ensuring every child has access to quality education regardless of their background.',
    category: 'Education',
    goal: 35000,
    current_amount: 12000,
    created_at: '2023-07-01T10:15:00Z',
    deadline: '2023-11-30T23:59:59Z',
    image_url: '/images/campaign2.jpg',
    created_by: 'user2',
    beneficiary_type: 'Individual',
    tags: ['education', 'children', 'community'],
    status: 'active',
    donor_count: 85
  },
  {
    id: '3',
    title: 'Wildlife Protection Fund',
    description: 'Preserving endangered species and their habitats across the globe.',
    category: 'Wildlife',
    goal: 75000,
    current_amount: 45000,
    created_at: '2023-05-20T09:30:00Z',
    deadline: '2024-01-15T23:59:59Z',
    image_url: '/images/campaign3.jpg',
    created_by: 'user3',
    beneficiary_type: 'Organization',
    tags: ['wildlife', 'environment', 'conservation'],
    status: 'active',
    donor_count: 230
  },
  {
    id: '4',
    title: 'Tech for Seniors',
    description: 'Bridging the digital divide by providing technology education to seniors.',
    category: 'Technology',
    goal: 25000,
    current_amount: 8000,
    created_at: '2023-08-10T11:45:00Z',
    deadline: '2024-02-28T23:59:59Z',
    image_url: '/images/campaign4.jpg',
    created_by: 'user1',
    beneficiary_type: 'Community',
    tags: ['technology', 'education', 'seniors'],
    status: 'active',
    donor_count: 45
  },
];

// Mock donations data
export const mockDonations: Donation[] = [
  {
    id: 'd1',
    campaign_id: '1',
    amount: 250,
    donor_name: 'John Doe',
    donor_email: 'john@example.com',
    message: 'Keep up the great work!',
    created_at: '2023-09-01T14:25:00Z',
    is_anonymous: false,
  },
  {
    id: 'd2',
    campaign_id: '1',
    amount: 1000,
    donor_name: 'Anonymous',
    donor_email: 'anonymous@example.com',
    created_at: '2023-09-03T10:15:00Z',
    is_anonymous: true,
  },
  {
    id: 'd3',
    campaign_id: '2',
    amount: 500,
    donor_name: 'Sarah Smith',
    donor_email: 'sarah@example.com',
    message: 'Education matters!',
    created_at: '2023-08-29T16:40:00Z',
    is_anonymous: false,
  },
  {
    id: 'd4',
    campaign_id: '3',
    amount: 750,
    donor_name: 'Michael Johnson',
    donor_email: 'michael@example.com',
    message: 'Supporting wildlife conservation',
    created_at: '2023-09-05T09:20:00Z',
    is_anonymous: false,
  },
];

// Mock users data
export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    image: '/images/user1.jpg',
    created_at: '2023-01-15T08:30:00Z',
    campaigns: [mockCampaigns[0], mockCampaigns[3]],
    donations: [mockDonations[0]],
  },
  {
    id: 'user2',
    name: 'Jamie Taylor',
    email: 'jamie@example.com',
    image: '/images/user2.jpg',
    created_at: '2023-02-20T10:15:00Z',
    campaigns: [mockCampaigns[1]],
    donations: [mockDonations[2]],
  },
  {
    id: 'user3',
    name: 'Sam Wilson',
    email: 'sam@example.com',
    image: '/images/user3.jpg',
    created_at: '2023-03-10T14:45:00Z',
    campaigns: [mockCampaigns[2]],
    donations: [mockDonations[3]],
  },
];

// Mock suggestions data
export const mockSuggestions: CampaignSuggestion[] = [
  {
    id: 's1',
    campaign_id: '1',
    title: 'Engage with Video',
    description: 'Create a short video showcasing the impact of clean water in communities you\'ve helped so far.',
    type: 'content',
    created_at: '2023-09-01T08:00:00Z',
  },
  {
    id: 's2',
    campaign_id: '1',
    title: 'Facebook Promotion',
    description: 'Your campaign theme resonates well with 25-40 year old professionals. Consider a targeted Facebook promotion.',
    type: 'promotion',
    created_at: '2023-09-02T09:15:00Z',
  },
  {
    id: 's3',
    campaign_id: '2',
    title: 'Partner with Schools',
    description: 'Reach out to local schools for potential partnerships - they may share your campaign with parents.',
    type: 'audience',
    created_at: '2023-08-28T11:30:00Z',
  },
];

// Helper functions
export const getCampaignById = (id: string): Campaign | undefined => {
  return mockCampaigns.find(campaign => campaign.id === id);
};

export const getDonationsByCampaignId = (campaignId: string): Donation[] => {
  return mockDonations.filter(donation => donation.campaign_id === campaignId);
};

export const getSuggestionsByCampaignId = (campaignId: string): CampaignSuggestion[] => {
  return mockSuggestions.filter(suggestion => suggestion.campaign_id === campaignId);
};

// Add these missing functions
export const getUserData = (): User => {
  // Return the first mock user for demonstration
  return mockUsers[0];
};

export const getAllCampaigns = (): Campaign[] => {
  return mockCampaigns;
};
