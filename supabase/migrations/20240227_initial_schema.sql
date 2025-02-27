-- Create custom types
CREATE TYPE suggestion_type AS ENUM ('content', 'promotion', 'audience');

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    goal DECIMAL(12,2) NOT NULL CHECK (goal > 0),
    current_amount DECIMAL(12,2) DEFAULT 0 CHECK (current_amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    image TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT valid_amount CHECK (current_amount <= goal)
);

-- Create donations table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    is_anonymous BOOLEAN DEFAULT false,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create campaign suggestions table
CREATE TABLE campaign_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type suggestion_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX idx_donations_campaign_id ON donations(campaign_id);
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_campaign_suggestions_campaign_id ON campaign_suggestions(campaign_id);

-- Set up Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_suggestions ENABLE ROW LEVEL SECURITY;

-- Create security policies
-- Users can read all users
CREATE POLICY "Users are viewable by everyone" ON users
    FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = auth_id);

-- Campaigns are viewable by everyone
CREATE POLICY "Campaigns are viewable by everyone" ON campaigns
    FOR SELECT USING (true);

-- Users can create campaigns
CREATE POLICY "Users can create campaigns" ON campaigns
    FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth_id FROM users));

-- Campaign creators can update their campaigns
CREATE POLICY "Users can update own campaigns" ON campaigns
    FOR UPDATE USING (auth.uid() IN (
        SELECT auth_id FROM users WHERE id = campaigns.created_by
    ));

-- Donations are viewable by everyone
CREATE POLICY "Donations are viewable by everyone" ON donations
    FOR SELECT USING (true);

-- Authenticated users can create donations
CREATE POLICY "Authenticated users can create donations" ON donations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Campaign suggestions are viewable by campaign creators
CREATE POLICY "Campaign suggestions viewable by campaign creators" ON campaign_suggestions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM campaigns c
            JOIN users u ON c.created_by = u.id
            WHERE c.id = campaign_suggestions.campaign_id
            AND u.auth_id = auth.uid()
        )
    );

-- Create function to update campaign amount after donation
CREATE OR REPLACE FUNCTION update_campaign_amount()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE campaigns
    SET current_amount = current_amount + NEW.amount
    WHERE id = NEW.campaign_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update campaign amount
CREATE TRIGGER update_campaign_amount_after_donation
    AFTER INSERT ON donations
    FOR EACH ROW
    EXECUTE FUNCTION update_campaign_amount(); 