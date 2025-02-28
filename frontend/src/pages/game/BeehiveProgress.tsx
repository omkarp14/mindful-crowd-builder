import React from 'react';

interface BeehiveProgressProps {
  totalDonations: number;
  totalPlayers: number;
  targetDonations: number;
}

const BeehiveProgress: React.FC<BeehiveProgressProps> = ({
  totalDonations,
  totalPlayers,
  targetDonations,
}) => {
  const progress = Math.min((totalDonations / targetDonations) * 100, 100);
  const cells = 19; // Total hexagonal cells in the beehive
  const filledCells = Math.ceil((progress / 100) * cells);
  
  // Generate hexagon positions in a beehive pattern
  const hexPositions = [
    // Center column
    { x: 50, y: 50 }, // Center cell
    { x: 50, y: 25 }, // Top
    { x: 50, y: 75 }, // Bottom
    // Left column
    { x: 25, y: 37.5 },
    { x: 25, y: 62.5 },
    // Far left column
    { x: 0, y: 50 },
    // Right column
    { x: 75, y: 37.5 },
    { x: 75, y: 62.5 },
    // Far right column
    { x: 100, y: 50 },
    // Top row extras
    { x: 37.5, y: 12.5 },
    { x: 62.5, y: 12.5 },
    // Bottom row extras
    { x: 37.5, y: 87.5 },
    { x: 62.5, y: 87.5 },
    // Middle extras
    { x: 12.5, y: 25 },
    { x: 87.5, y: 25 },
    { x: 12.5, y: 75 },
    { x: 87.5, y: 75 },
    // Outer corners
    { x: 25, y: 12.5 },
    { x: 75, y: 87.5 },
  ];

  return (
    <div className="bg-amber-50 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-amber-800 mb-4 text-center">Community Beehive 🐝</h3>
      <div className="relative aspect-square w-full max-w-md mx-auto mb-4">
        {hexPositions.map((pos, index) => {
          const isFilled = index < filledCells;
          const isNext = index === filledCells;
          
          return (
            <div
              key={index}
              className={`absolute w-[20%] aspect-square transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                isNext ? 'animate-pulse' : ''
              }`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
            >
              <div
                className={`w-full h-full relative ${
                  isFilled ? 'opacity-100' : 'opacity-30'
                }`}
                style={{
                  clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                  backgroundColor: isFilled ? '#F59E0B' : '#FCD34D',
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                {isFilled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {index === 0 ? '👑' : '🍯'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center space-y-2">
        <div className="text-amber-800">
          <span className="font-bold">{Math.round(progress)}%</span> Complete
        </div>
        <div className="h-4 bg-amber-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm text-amber-700">
          ${totalDonations.toLocaleString()} raised of ${targetDonations.toLocaleString()} goal
        </div>
        <div className="text-sm text-amber-600">
          {totalPlayers} players contributing
        </div>
      </div>

      <div className="mt-6 text-center">
        <h4 className="font-semibold text-amber-800 mb-2">Hive Milestones 🎯</h4>
        <div className="space-y-2 text-sm text-amber-700">
          <div>25% - Worker Bee Colony</div>
          <div>50% - Thriving Community</div>
          <div>75% - Royal Chamber</div>
          <div>100% - Golden Hive Achievement</div>
        </div>
      </div>
    </div>
  );
};

export default BeehiveProgress; 