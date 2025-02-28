import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import { fetchCampaigns } from '../../store/slices/campaignSlice';
import { HexagonProgress } from '../ui/HexagonProgress';

export const CampaignList = () => {
  const dispatch = useAppDispatch();
  const { items: campaigns, isLoading, error } = useAppSelector((state) => state.campaigns);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Campaigns' },
    { id: 'medical', label: 'Medical' },
    { id: 'education', label: 'Education' },
    { id: 'community', label: 'Community' },
    { id: 'emergency', label: 'Emergency' },
    { id: 'creative', label: 'Creative' },
    { id: 'nonprofit', label: 'Nonprofit' },
  ];

  useEffect(() => {
    const filters = selectedCategory === 'all' ? {} : { category: selectedCategory };
    dispatch(fetchCampaigns(filters));
  }, [dispatch, selectedCategory]);

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-honeyGold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full transition-colors duration-300 ${
              selectedCategory === category.id
                ? 'bg-honeyGold text-white'
                : 'bg-softCream text-deepNavy hover:bg-honeyLight'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {campaign.imageUrl && (
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-secondary font-bold text-deepNavy mb-2">
                    {campaign.title}
                  </h3>
                  <span className="inline-block bg-softCream text-charcoal text-sm px-3 py-1 rounded-full">
                    {campaign.category}
                  </span>
                </div>
                <div className="w-16">
                  <HexagonProgress
                    progress={calculateProgress(campaign.currentAmount, campaign.goalAmount)}
                    size="sm"
                  />
                </div>
              </div>

              <p className="text-charcoal mb-4 line-clamp-3">
                {campaign.description}
              </p>

              <div className="flex justify-between items-center text-sm text-charcoal">
                <div>
                  <span className="font-bold">${campaign.currentAmount.toLocaleString()}</span>
                  <span className="text-gray-500"> of ${campaign.goalAmount.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-forestGreen">
                    {new Date(campaign.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center text-charcoal py-8">
          No campaigns found for this category.
        </div>
      )}
    </div>
  );
}; 