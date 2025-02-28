import React, { useEffect, useState, useCallback } from 'react';
import { GameState, HoneyDrop } from '../types';

const GAME_DURATION = 60; // 60 seconds
const HONEY_SPAWN_INTERVAL = 1000; // 1 second
const GAME_TICK = 16; // ~60 FPS

const BeeGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    timeRemaining: GAME_DURATION,
    honeyDrops: [],
    isGameActive: false,
    playerPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  });

  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      isGameActive: true,
      score: 0,
      timeRemaining: GAME_DURATION,
      honeyDrops: [],
    }));
  };

  const spawnHoneyDrop = useCallback(() => {
    if (!gameState.isGameActive) return;

    const newDrop: HoneyDrop = {
      id: Math.random().toString(),
      x: Math.random() * (window.innerWidth - 40),
      y: Math.random() * (window.innerHeight - 40),
      value: Math.floor(Math.random() * 10) + 1,
    };

    setGameState((prev) => ({
      ...prev,
      honeyDrops: [...prev.honeyDrops, newDrop],
    }));
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
          return { ...prev, isGameActive: false };
        }

        // Check for collisions with honey drops
        const collectedDrops: string[] = [];
        let scoreIncrease = 0;

        prev.honeyDrops.forEach((drop) => {
          const distance = Math.sqrt(
            Math.pow(prev.playerPosition.x - drop.x, 2) +
            Math.pow(prev.playerPosition.y - drop.y, 2)
          );

          if (distance < 30) { // Collection radius
            collectedDrops.push(drop.id);
            scoreIncrease += drop.value;
          }
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
  }, [gameState.isGameActive]);

  // Spawn honey drops
  useEffect(() => {
    if (!gameState.isGameActive) return;

    const spawnInterval = setInterval(spawnHoneyDrop, HONEY_SPAWN_INTERVAL);
    return () => clearInterval(spawnInterval);
  }, [gameState.isGameActive, spawnHoneyDrop]);

  // Mouse movement listener
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="relative w-full h-screen bg-sky-100 overflow-hidden">
      {!gameState.isGameActive ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={startGame}
            className="px-6 py-3 bg-amber-500 text-white rounded-lg shadow-lg hover:bg-amber-600 transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
            <div className="text-lg font-bold">Score: {Math.floor(gameState.score)}</div>
            <div className="text-md">Time: {Math.ceil(gameState.timeRemaining)}s</div>
          </div>

          {/* Player Bee */}
          <div
            className="absolute w-10 h-10 transition-transform duration-100"
            style={{
              transform: `translate(${gameState.playerPosition.x - 20}px, ${
                gameState.playerPosition.y - 20
              }px)`,
            }}
          >
            🐝
          </div>

          {/* Honey Drops */}
          {gameState.honeyDrops.map((drop) => (
            <div
              key={drop.id}
              className="absolute w-8 h-8 transition-opacity"
              style={{
                left: drop.x,
                top: drop.y,
              }}
            >
              🍯
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default BeeGame; 