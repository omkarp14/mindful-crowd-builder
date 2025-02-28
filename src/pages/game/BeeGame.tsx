import React, { useEffect, useState, useCallback } from 'react';
import { GameState, HoneyDrop } from '../../types';

const GAME_DURATION = 60; // 60 seconds
const HONEY_SPAWN_INTERVAL = 1000; // 1 second
const POWER_UP_SPAWN_INTERVAL = 10000; // 10 seconds
const GAME_TICK = 16; // ~60 FPS
const MAX_SCORE = 1000; // Score needed for full honeycomb background

interface PowerUp {
  id: string;
  type: 'magnet' | 'multiplier' | 'time';
  x: number;
  y: number;
  duration: number;
}

interface BeeGameProps {
  onExit?: () => void;
}

const BeeGame: React.FC<BeeGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    timeRemaining: GAME_DURATION,
    honeyDrops: [],
    isGameActive: false,
    playerPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  });
  const [gameEnded, setGameEnded] = useState(false);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<{
    magnet: boolean;
    multiplier: boolean;
    time: boolean;
  }>({
    magnet: false,
    multiplier: false,
    time: false,
  });
  const [combo, setCombo] = useState(0);
  const [lastCollectionTime, setLastCollectionTime] = useState(Date.now());

  // Calculate honeycomb fill percentage based on score
  const getHoneycombFill = () => {
    return Math.min((gameState.score / MAX_SCORE) * 100, 100);
  };

  // Generate honeycomb background pattern
  const generateHoneycombPattern = () => {
    const fillPercentage = getHoneycombFill();
    const opacity = (fillPercentage / 100) * 0.6;
    
    return {
      backgroundColor: '#f7e9d7',
      backgroundImage: `
        linear-gradient(30deg, ${`rgba(247, 183, 51, ${opacity})`} 12%, transparent 12.5%, transparent 87%, ${`rgba(247, 183, 51, ${opacity})`} 87.5%, ${`rgba(247, 183, 51, ${opacity})`}),
        linear-gradient(150deg, ${`rgba(247, 183, 51, ${opacity})`} 12%, transparent 12.5%, transparent 87%, ${`rgba(247, 183, 51, ${opacity})`} 87.5%, ${`rgba(247, 183, 51, ${opacity})`}),
        linear-gradient(30deg, ${`rgba(247, 183, 51, ${opacity})`} 12%, transparent 12.5%, transparent 87%, ${`rgba(247, 183, 51, ${opacity})`} 87.5%, ${`rgba(247, 183, 51, ${opacity})`}),
        linear-gradient(150deg, ${`rgba(247, 183, 51, ${opacity})`} 12%, transparent 12.5%, transparent 87%, ${`rgba(247, 183, 51, ${opacity})`} 87.5%, ${`rgba(247, 183, 51, ${opacity})`}),
        linear-gradient(60deg, ${`rgba(247, 183, 51, ${opacity * 0.7})`} 25%, transparent 25.5%, transparent 75%, ${`rgba(247, 183, 51, ${opacity * 0.7})`} 75%, ${`rgba(247, 183, 51, ${opacity * 0.7})`}),
        linear-gradient(60deg, ${`rgba(247, 183, 51, ${opacity * 0.7})`} 25%, transparent 25.5%, transparent 75%, ${`rgba(247, 183, 51, ${opacity * 0.7})`} 75%, ${`rgba(247, 183, 51, ${opacity * 0.7})`})`
      ,
      backgroundSize: '80px 140px',
      backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px',
      transition: 'all 0.3s ease-in-out',
    };
  };

  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      isGameActive: true,
      score: 0,
      timeRemaining: GAME_DURATION,
      honeyDrops: [],
    }));
    setPowerUps([]);
    setActivePowerUps({ magnet: false, multiplier: false, time: false });
    setCombo(0);
    setGameEnded(false);
    setLastCollectionTime(Date.now());
  };

  const handleExit = () => {
    if (onExit) {
      onExit();
    }
  };

  const spawnHoneyDrop = useCallback(() => {
    if (!gameState.isGameActive) return;

    const types = ['regular', 'golden', 'rainbow'] as const;
    const weights = [0.7, 0.2, 0.1];
    const random = Math.random();
    let selectedType: typeof types[number] = 'regular';
    let accWeight = 0;
    
    for (let i = 0; i < types.length; i++) {
      accWeight += weights[i];
      if (random <= accWeight) {
        selectedType = types[i];
        break;
      }
    }

    const value = selectedType === 'regular' ? 10 :
                 selectedType === 'golden' ? 25 :
                 selectedType === 'rainbow' ? 50 : 10;

    const newDrop: HoneyDrop = {
      id: Math.random().toString(),
      x: Math.random() * (window.innerWidth - 80),
      y: Math.random() * (window.innerHeight - 80),
      value,
      type: selectedType,
    };

    setGameState((prev) => ({
      ...prev,
      honeyDrops: [...prev.honeyDrops, newDrop],
    }));
  }, [gameState.isGameActive]);

  const spawnPowerUp = useCallback(() => {
    if (!gameState.isGameActive) return;

    const types: ('magnet' | 'multiplier' | 'time')[] = ['magnet', 'multiplier', 'time'];
    const type = types[Math.floor(Math.random() * types.length)];

    const newPowerUp: PowerUp = {
      id: Math.random().toString(),
      type,
      x: Math.random() * (window.innerWidth - 80),
      y: Math.random() * (window.innerHeight - 80),
      duration: 5000, // 5 seconds
    };

    setPowerUps(prev => [...prev, newPowerUp]);
  }, [gameState.isGameActive]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!gameState.isGameActive) return;

    setGameState((prev) => ({
      ...prev,
      playerPosition: { x: e.clientX, y: e.clientY },
    }));
  }, [gameState.isGameActive]);

  // Game loop
  useEffect(() => {
    if (!gameState.isGameActive) return;

    const gameLoop = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeRemaining <= 0) {
          clearInterval(gameLoop);
          setGameEnded(true);
          return { ...prev, isGameActive: false };
        }

        // Check for collisions with honey drops
        const collectedDrops: string[] = [];
        let scoreIncrease = 0;

        prev.honeyDrops.forEach((drop) => {
          let collectionRadius = activePowerUps.magnet ? 100 : 48;
          const distance = Math.sqrt(
            Math.pow(prev.playerPosition.x - drop.x, 2) +
            Math.pow(prev.playerPosition.y - drop.y, 2)
          );

          if (distance < collectionRadius) {
            collectedDrops.push(drop.id);
            let dropValue = drop.value;
            
            // Apply combo multiplier
            if (Date.now() - lastCollectionTime < 1000) {
              setCombo(c => Math.min(c + 1, 5));
              dropValue *= (1 + combo * 0.2); // Up to 2x multiplier for 5x combo
            } else {
              setCombo(0);
            }
            
            // Apply power-up multiplier
            if (activePowerUps.multiplier) {
              dropValue *= 2;
            }
            
            scoreIncrease += dropValue;
            setLastCollectionTime(Date.now());
          }
        });

        // Check for power-up collisions
        setPowerUps(prevPowerUps => {
          const collectedPowerUps: string[] = [];
          prevPowerUps.forEach(powerUp => {
            const distance = Math.sqrt(
              Math.pow(prev.playerPosition.x - powerUp.x, 2) +
              Math.pow(prev.playerPosition.y - powerUp.y, 2)
            );

            if (distance < 48) {
              collectedPowerUps.push(powerUp.id);
              setActivePowerUps(prev => ({ ...prev, [powerUp.type]: true }));
              
              // Set timeout to deactivate power-up
              setTimeout(() => {
                setActivePowerUps(prev => ({ ...prev, [powerUp.type]: false }));
              }, powerUp.duration);

              // Add time if it's a time power-up
              if (powerUp.type === 'time') {
                prev.timeRemaining += 5; // Add 5 seconds
              }
            }
          });
          return prevPowerUps.filter(powerUp => !collectedPowerUps.includes(powerUp.id));
        });

        return {
          ...prev,
          score: prev.score + scoreIncrease,
          honeyDrops: prev.honeyDrops.filter((drop) => !collectedDrops.includes(drop.id)),
          timeRemaining: prev.timeRemaining - GAME_TICK / 1000,
        };
      });
    }, GAME_TICK);

    return () => clearInterval(gameLoop);
  }, [gameState.isGameActive, activePowerUps, combo, lastCollectionTime]);

  // Spawn honey drops and power-ups
  useEffect(() => {
    if (!gameState.isGameActive) return;

    const spawnInterval = setInterval(spawnHoneyDrop, HONEY_SPAWN_INTERVAL);
    const powerUpInterval = setInterval(spawnPowerUp, POWER_UP_SPAWN_INTERVAL);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(powerUpInterval);
    };
  }, [gameState.isGameActive, spawnHoneyDrop, spawnPowerUp]);

  // Mouse movement listener and cursor style
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    
    if (gameState.isGameActive) {
      document.body.classList.add('cursor-none');
    } else {
      document.body.classList.remove('cursor-none');
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.classList.remove('cursor-none');
    };
  }, [handleMouseMove, gameState.isGameActive]);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
      style={generateHoneycombPattern()}
    >
      {!gameState.isGameActive && !gameEnded ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white bg-opacity-90 p-8 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-amber-800 mb-4">Bee Game</h2>
            <p className="text-lg text-amber-700 mb-6">
              Move your mouse to control the bee and collect honey! 🍯
              <br />
              Watch the honeycomb grow as you collect more honey!
              <br />
              <span className="text-sm mt-2 block">
                🌈 Rainbow Honey: 50pts | ✨ Golden Honey: 25pts | 🍯 Regular Honey: 10pts
                <br />
                🧲 Magnet: Larger collection range | ⭐️ Multiplier: 2x points | ⏰ Time: +5 seconds
              </span>
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-amber-500 text-white rounded-lg shadow-lg hover:bg-amber-600 transition-colors"
            >
              Start Game
            </button>
          </div>
        </div>
      ) : gameEnded ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-3xl font-bold text-amber-800 mb-4">Game Over! 🎉</h2>
            <p className="text-xl text-amber-700 mb-4">
              Your Score: {Math.floor(gameState.score)}
            </p>
            <p className="text-lg text-amber-600 mb-6">
              Honeycomb filled: {Math.floor(getHoneycombFill())}%
            </p>
            <div className="space-x-4">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-amber-500 text-white rounded-lg shadow-lg hover:bg-amber-600 transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={handleExit}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Game Stats and Exit Button */}
          <div className="fixed top-4 right-4 flex items-start gap-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <div className="text-lg font-bold text-amber-800">
                    Score: {Math.floor(gameState.score)}
                  </div>
                  <div className="text-md text-amber-600">
                    Time: {Math.ceil(gameState.timeRemaining)}s
                  </div>
                  <div className="text-sm text-amber-500">
                    Honeycomb: {Math.floor(getHoneycombFill())}%
                  </div>
                  {combo > 1 && (
                    <div className="text-sm font-bold text-amber-600 animate-pulse">
                      {combo}x Combo!
                    </div>
                  )}
                  {Object.entries(activePowerUps).map(([type, active]) => 
                    active && (
                      <div key={type} className="text-xs text-amber-500 animate-pulse">
                        {type === 'magnet' && '🧲 Magnet Active!'}
                        {type === 'multiplier' && '⭐️ 2x Points!'}
                        {type === 'time' && '⏰ Time Bonus!'}
                      </div>
                    )
                  )}
                </div>
                <button
                  onClick={handleExit}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                >
                  Exit Game
                </button>
              </div>
            </div>
          </div>

          {/* Player Bee */}
          <div
            className={`absolute w-16 h-16 transition-transform duration-100 pointer-events-none text-4xl ${
              activePowerUps.magnet ? 'animate-pulse' : ''
            }`}
            style={{
              transform: `translate(${gameState.playerPosition.x - 32}px, ${
                gameState.playerPosition.y - 32
              }px)`,
            }}
          >
            🐝
          </div>

          {/* Honey Drops */}
          {gameState.honeyDrops.map((drop) => (
            <div
              key={drop.id}
              className="absolute w-12 h-12 transition-opacity pointer-events-none text-3xl"
              style={{
                left: drop.x,
                top: drop.y,
                animation: 'float 2s ease-in-out infinite',
              }}
            >
              {drop.type === 'regular' ? '🍯' : drop.type === 'golden' ? '✨' : '🌈'}
            </div>
          ))}

          {/* Power-ups */}
          {powerUps.map((powerUp) => (
            <div
              key={powerUp.id}
              className="absolute w-12 h-12 transition-opacity pointer-events-none text-3xl animate-bounce"
              style={{
                left: powerUp.x,
                top: powerUp.y,
              }}
            >
              {powerUp.type === 'magnet' ? '🧲' : powerUp.type === 'multiplier' ? '⭐️' : '⏰'}
            </div>
          ))}
        </>
      )}

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
};

export default BeeGame; 