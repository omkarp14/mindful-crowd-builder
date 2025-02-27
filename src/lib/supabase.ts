import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for type-safe database operations

// Users
export const getUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

// Campaigns
export const getCampaigns = async () => {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      users (
        name,
        image
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getCampaign = async (campaignId: string) => {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      users (
        name,
        image
      ),
      donations (
        amount,
        donor_name,
        message,
        created_at,
        is_anonymous
      )
    `)
    .eq('id', campaignId)
    .single();
  
  if (error) throw error;
  return data;
};

export const createCampaign = async (campaign: Omit<Database['public']['Tables']['campaigns']['Insert'], 'id' | 'current_amount' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('campaigns')
    .insert(campaign)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Donations
export const createDonation = async (donation: Omit<Database['public']['Tables']['donations']['Insert'], 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('donations')
    .insert(donation)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getDonations = async (campaignId: string) => {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Campaign Suggestions
export const createCampaignSuggestion = async (suggestion: Omit<Database['public']['Tables']['campaign_suggestions']['Insert'], 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('campaign_suggestions')
    .insert(suggestion)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getCampaignSuggestions = async (campaignId: string) => {
  const { data, error } = await supabase
    .from('campaign_suggestions')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}; 