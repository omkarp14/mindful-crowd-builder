
import { Campaign, Donation, User, CampaignSuggestion } from '../types';

// Mock campaigns data
export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Clean Water Initiative',
    description: 'Providing clean water to communities in need around the world.',
    category: 'Environment',
    goal: 50000,
    currentAmount: 27500,
    createdAt: '2023-06-15T08:00:00Z',
    deadline: '2023-12-31T23:59:59Z',
    image: '/images/campaign1.jpg',
    createdBy: 'user1',
    isActive: true,
  },
  {
    id: '2',
    title: 'Education for All',
    description: 'Ensuring every child has access to quality education regardless of their background.',
    category: 'Education',
    goal: 35000,
    currentAmount: 12000,
    createdAt: '2023-07-01T10:15:00Z',
    deadline: '2023-11-30T23:59:59Z',
    image: '/images/campaign2.jpg',
    createdBy: 'user2',
    isActive: true,
  },
  {
    id: '3',
    title: 'Wildlife Protection Fund',
    description: 'Preserving endangered species and their habitats across the globe.',
    category: 'Wildlife',
    goal: 75000,
    currentAmount: 45000,
    createdAt: '2023-05-20T09:30:00Z',
    deadline: '2024-01-15T23:59:59Z',
    image: '/images/campaign3.jpg',
    createdBy: 'user3',
    isActive: true,
  },
  {
    id: '4',
    title: 'Tech for Seniors',
    description: 'Bridging the digital divide by providing technology education to seniors.',
    category: 'Technology',
    goal: 25000,
    currentAmount: 8000,
    createdAt: '2023-08-10T11:45:00Z',
    deadline: '2024-02-28T23:59:59Z',
    image: '/images/campaign4.jpg',
    createdBy: 'user1',
    isActive: true,
  },
];

// Mock donations data
export const mockDonations: Donation[] = [
  {
    id: 'd1',
    campaignId: '1',
    amount: 250,
    donorName: 'John Doe',
    donorEmail: 'john@example.com',
    message: 'Keep up the great work!',
    createdAt: '2023-09-01T14:25:00Z',
    isAnonymous: false,
  },
  {
    id: 'd2',
    campaignId: '1',
    amount: 1000,
    donorName: 'Anonymous',
    donorEmail: 'anonymous@example.com',
    createdAt: '2023-09-03T10:15:00Z',
    isAnonymous: true,
  },
  {
    id: 'd3',
    campaignId: '2',
    amount: 500,
    donorName: 'Sarah Smith',
    donorEmail: 'sarah@example.com',
    message: 'Education matters!',
    createdAt: '2023-08-29T16:40:00Z',
    isAnonymous: false,
  },
  {
    id: 'd4',
    campaignId: '3',
    amount: 750,
    donorName: 'Michael Johnson',
    donorEmail: 'michael@example.com',
    message: 'Supporting wildlife conservation',
    createdAt: '2023-09-05T09:20:00Z',
    isAnonymous: false,
  },
];

// Mock users data
export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    image: '/images/user1.jpg',
    createdAt: '2023-01-15T08:30:00Z',
    campaigns: [mockCampaigns[0], mockCampaigns[3]],
    donations: [mockDonations[0]],
  },
  {
    id: 'user2',
    name: 'Jamie Taylor',
    email: 'jamie@example.com',
    image: '/images/user2.jpg',
    createdAt: '2023-02-20T10:15:00Z',
    campaigns: [mockCampaigns[1]],
    donations: [mockDonations[2]],
  },
  {
    id: 'user3',
    name: 'Sam Wilson',
    email: 'sam@example.com',
    image: '/images/user3.jpg',
    createdAt: '2023-03-10T14:45:00Z',
    campaigns: [mockCampaigns[2]],
    donations: [mockDonations[3]],
  },
];

// Mock suggestions data
export const mockSuggestions: CampaignSuggestion[] = [
  {
    id: 's1',
    campaignId: '1',
    title: 'Engage with Video',
    description: 'Create a short video showcasing the impact of clean water in communities you\'ve helped so far.',
    type: 'content',
    createdAt: '2023-09-01T08:00:00Z',
  },
  {
    id: 's2',
    campaignId: '1',
    title: 'Facebook Promotion',
    description: 'Your campaign theme resonates well with 25-40 year old professionals. Consider a targeted Facebook promotion.',
    type: 'promotion',
    createdAt: '2023-09-02T09:15:00Z',
  },
  {
    id: 's3',
    campaignId: '2',
    title: 'Partner with Schools',
    description: 'Reach out to local schools for potential partnerships - they may share your campaign with parents.',
    type: 'audience',
    createdAt: '2023-08-28T11:30:00Z',
  },
];

// Helper functions
export const getCampaignById = (id: string): Campaign | undefined => {
  return mockCampaigns.find(campaign => campaign.id === id);
};

export const getDonationsByCampaignId = (campaignId: string): Donation[] => {
  return mockDonations.filter(donation => donation.campaignId === campaignId);
};

export const getSuggestionsByCampaignId = (campaignId: string): CampaignSuggestion[] => {
  return mockSuggestions.filter(suggestion => suggestion.campaignId === campaignId);
};


// Add these missing functions
export const getUserData = (): User => {
  // Return the first mock user for demonstration
  return mockUsers[0];
};

export const getAllCampaigns = (): Campaign[] => {
  return mockCampaigns;
};
