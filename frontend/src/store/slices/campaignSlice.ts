import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Campaign {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  currentAmount: number;
  deadline: string;
  imageUrl?: string;
  status: 'active' | 'completed' | 'cancelled';
  beneficiaryType: 'self' | 'someone_else' | 'charity';
  createdAt: string;
  updatedAt: string;
}

interface CampaignsState {
  items: Campaign[];
  currentCampaign: Campaign | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CampaignsState = {
  items: [],
  currentCampaign: null,
  isLoading: false,
  error: null,
};

export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchAll',
  async (filters?: { category?: string; status?: string }) => {
    const response = await api.get('/campaigns', { params: filters });
    return response.data.campaigns;
  }
);

export const fetchCampaignById = createAsyncThunk(
  'campaigns/fetchById',
  async (id: number) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data.campaign;
  }
);

export const createCampaign = createAsyncThunk(
  'campaigns/create',
  async (campaignData: Partial<Campaign>) => {
    const response = await api.post('/campaigns', campaignData);
    return response.data.campaign;
  }
);

export const updateCampaign = createAsyncThunk(
  'campaigns/update',
  async ({ id, data }: { id: number; data: Partial<Campaign> }) => {
    const response = await api.put(`/campaigns/${id}`, data);
    return response.data.campaign;
  }
);

export const deleteCampaign = createAsyncThunk(
  'campaigns/delete',
  async (id: number) => {
    await api.delete(`/campaigns/${id}`);
    return id;
  }
);

const campaignSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCampaign: (state) => {
      state.currentCampaign = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Campaigns
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch campaigns';
      });

    // Fetch Campaign by ID
    builder
      .addCase(fetchCampaignById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCampaign = action.payload;
      })
      .addCase(fetchCampaignById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch campaign';
      });

    // Create Campaign
    builder
      .addCase(createCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
        state.currentCampaign = action.payload;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create campaign';
      });

    // Update Campaign
    builder
      .addCase(updateCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
        state.currentCampaign = action.payload;
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update campaign';
      });

    // Delete Campaign
    builder
      .addCase(deleteCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.currentCampaign?.id === action.payload) {
          state.currentCampaign = null;
        }
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete campaign';
      });
  },
});

export const { clearError, clearCurrentCampaign } = campaignSlice.actions;
export default campaignSlice.reducer; 