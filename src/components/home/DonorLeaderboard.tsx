
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { Crown, Medal, Trophy } from 'lucide-react';

const DonorLeaderboard = () => {
  const [topDonors, setTopDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDonors = async () => {
      try {
        // Get top donors by summing up their donations
        const { data, error } = await supabase
          .from('donations')
          .select(`
            id,
            donor_name,
            user_id,
            amount,
            is_anonymous
          `)
          .order('amount', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        // Group by user_id or donor_name and sum amounts
        const donorMap = new Map();
        
        data?.forEach(donation => {
          const donorId = donation.user_id || donation.donor_name || 'anonymous';
          const displayName = donation.is_anonymous ? 'Anonymous Donor' : (donation.donor_name || 'Unknown Donor');
          
          if (donorMap.has(donorId)) {
            const existing = donorMap.get(donorId);
            donorMap.set(donorId, {
              ...existing,
              totalAmount: existing.totalAmount + donation.amount
            });
          } else {
            donorMap.set(donorId, {
              id: donorId,
              name: displayName,
              totalAmount: donation.amount,
              isAnonymous: donation.is_anonymous
            });
          }
        });
        
        // Convert map to array and sort by total amount
        const sortedDonors = Array.from(donorMap.values())
          .sort((a, b) => b.totalAmount - a.totalAmount)
          .slice(0, 3); // Get top 3
        
        setTopDonors(sortedDonors);
      } catch (error) {
        console.error('Error fetching top donors:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopDonors();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Donors</CardTitle>
          <CardDescription>Our most generous supporters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-center h-64 gap-4">
            <div className="animate-pulse bg-muted h-32 w-20 rounded-t-lg"></div>
            <div className="animate-pulse bg-muted h-40 w-20 rounded-t-lg"></div>
            <div className="animate-pulse bg-muted h-24 w-20 rounded-t-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ensure we have 3 podium spots
  while (topDonors.length < 3) {
    topDonors.push({ id: `empty-${topDonors.length}`, name: 'Be the next donor!', totalAmount: 0, isAnonymous: false });
  }

  // Reorder for podium display: 2nd, 1st, 3rd place
  const podiumOrder = [
    topDonors[1] || { name: 'Be the next donor!', totalAmount: 0 },
    topDonors[0] || { name: 'Be the next donor!', totalAmount: 0 },
    topDonors[2] || { name: 'Be the next donor!', totalAmount: 0 }
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-center">Top Donors</CardTitle>
        <CardDescription className="text-center">Our most generous supporters</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative h-80">
          {/* 3D Podium */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center">
            {/* Second Place */}
            <div className="flex flex-col items-center mx-2 z-10">
              <div className="mb-1">
                <Medal className="h-6 w-6 text-gray-400" />
              </div>
              <div className="w-24 h-32 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg shadow-lg flex flex-col items-center justify-end p-2 transform hover:scale-105 transition-transform relative">
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-100 rounded-full border-4 border-gray-300 flex items-center justify-center overflow-hidden">
                  <span className="text-xl font-bold">{podiumOrder[0].name.charAt(0)}</span>
                </div>
                <div className="text-center mt-8">
                  <p className="font-semibold text-xs truncate max-w-full">{podiumOrder[0].name}</p>
                  <p className="text-sm font-bold">${podiumOrder[0].totalAmount}</p>
                </div>
              </div>
              <div className="w-28 h-4 bg-gradient-to-t from-gray-400 to-gray-300 transform skew-x-12 -ml-2 z-0"></div>
            </div>
            
            {/* First Place */}
            <div className="flex flex-col items-center mx-2 z-20">
              <div className="mb-1">
                <Crown className="h-7 w-7 text-yellow-500" />
              </div>
              <div className="w-24 h-40 bg-gradient-to-t from-yellow-300 to-yellow-200 rounded-t-lg shadow-lg flex flex-col items-center justify-end p-2 transform hover:scale-105 transition-transform relative">
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-yellow-100 rounded-full border-4 border-yellow-300 flex items-center justify-center overflow-hidden">
                  <span className="text-xl font-bold">{podiumOrder[1].name.charAt(0)}</span>
                </div>
                <div className="text-center mt-8">
                  <p className="font-semibold text-xs truncate max-w-full">{podiumOrder[1].name}</p>
                  <p className="text-sm font-bold">${podiumOrder[1].totalAmount}</p>
                </div>
              </div>
              <div className="w-28 h-4 bg-gradient-to-t from-yellow-400 to-yellow-300 transform skew-x-12 -ml-2 z-0"></div>
            </div>
            
            {/* Third Place */}
            <div className="flex flex-col items-center mx-2 z-10">
              <div className="mb-1">
                <Trophy className="h-6 w-6 text-amber-700" />
              </div>
              <div className="w-24 h-24 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-lg shadow-lg flex flex-col items-center justify-end p-2 transform hover:scale-105 transition-transform relative">
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-amber-100 rounded-full border-4 border-amber-500 flex items-center justify-center overflow-hidden">
                  <span className="text-xl font-bold">{podiumOrder[2].name.charAt(0)}</span>
                </div>
                <div className="text-center mt-8">
                  <p className="font-semibold text-xs truncate max-w-full">{podiumOrder[2].name}</p>
                  <p className="text-sm font-bold">${podiumOrder[2].totalAmount}</p>
                </div>
              </div>
              <div className="w-28 h-4 bg-gradient-to-t from-amber-700 to-amber-600 transform skew-x-12 -ml-2 z-0"></div>
            </div>
          </div>
          
          {/* Podium Base */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonorLeaderboard;
