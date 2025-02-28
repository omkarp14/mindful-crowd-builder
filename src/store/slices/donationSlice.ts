import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Donation {
  id: number;
  campaignId: number;
  userId: number;
  amount: number;
  paymentStatus: string;
  anonymous: boolean;
  message?: string;
  createdAt: string;
}

interface HoneyMatch {
  id: number;
  campaignId: number;
  matcherId: number;
  matchAmount: number;
  matchDeadline: string;
  status: 'active' | 'completed' | 'expired';
  createdAt: string;
  updatedAt: string;
}

interface LeaderboardEntry {
  donorName: string;
  totalDonated: number;
  donationCount: number;
}

interface DonationsState {
  userDonations: Donation[];
  campaignDonations: Donation[];
  honeyMatches: HoneyMatch[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DonationsState = {
  userDonations: [],
  campaignDonations: [],
  honeyMatches: [],
  leaderboard: [],
  isLoading: false,
  error: null,
};

export const createDonation = createAsyncThunk(
  'donations/create',
  async (donationData: {
    campaignId: number;
    amount: number;
    anonymous?: boolean;
    message?: string;
  }) => {
    const response = await api.post('/donations', donationData);
    return response.data.donation;
  }
);

export const fetchUserDonations = createAsyncThunk(
  'donations/fetchUserDonations',
  async () => {
    const response = await api.get('/donations/user');
    return response.data.donations;
  }
);

export const fetchCampaignDonations = createAsyncThunk(
  'donations/fetchCampaignDonations',
  async (campaignId: number) => {
    const response = await api.get(`/donations/campaign/${campaignId}`);
    return response.data.donations;
  }
);

export const createHoneyMatch = createAsyncThunk(
  'donations/createHoneyMatch',
  async (matchData: {
    campaignId: number;
    matchAmount: number;
    matchDeadline: string;
  }) => {
    const response = await api.post('/donations/honey-match', matchData);
    return response.data.match;
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'donations/fetchLeaderboard',
  async (params?: { timeframe?: string; category?: string }) => {
    const response = await api.get('/donations/leaderboard', { params });
    return response.data.leaderboard;
  }
);

const donationSlice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Donation
    builder
      .addCase(createDonation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDonation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDonations.unshift(action.payload);
        state.campaignDonations.unshift(action.payload);
      })
      .addCase(createDonation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create donation';
      });

    // Fetch User Donations
    builder
      .addCase(fetchUserDonations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserDonations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDonations = action.payload;
      })
      .addCase(fetchUserDonations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user donations';
      });

    // Fetch Campaign Donations
    builder
      .addCase(fetchCampaignDonations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaignDonations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaignDonations = action.payload;
      })
      .addCase(fetchCampaignDonations.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Failed to fetch campaign donations';
      });

    // Create Honey Match
    builder
      .addCase(createHoneyMatch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createHoneyMatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.honeyMatches.unshift(action.payload);
      })
      .addCase(createHoneyMatch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create honey match';
      });

    // Fetch Leaderboard
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch leaderboard';
      });
  },
});

export const { clearError } = donationSlice.actions;
export default donationSlice.reducer; 