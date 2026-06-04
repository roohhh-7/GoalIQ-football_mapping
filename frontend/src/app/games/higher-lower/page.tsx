"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, Flame, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Player = {
  id: number;
  name: string;
  country: string;
  careerGoals: number;
  worldCupGoals: number;
  internationalGoals: number;
  imageUrl?: string;
};

type StatType = 'careerGoals' | 'worldCupGoals' | 'internationalGoals';

const statLabels: Record<StatType, string> = {
  careerGoals: 'Career Goals',
  worldCupGoals: 'World Cup Goals',
  internationalGoals: 'International Goals'
};

const MAX_ROUNDS = 10;

export default function HigherLower() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [playerA, setPlayerA] = useState<Player | null>(null);
  const [playerB, setPlayerB] = useState<Player | null>(null);
  
  const [currentStat, setCurrentStat] = useState<StatType>('careerGoals');
  
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'revealed' | 'won' | 'lost'>('playing');
  const [guessResult, setGuessResult] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    fetch('/higher-lower-data.json')
      .then(res => res.json())
      .then((data: Player[]) => {
        setPlayers(data);
        startNewGame(data);
        setLoading(false);
      });
  }, []);

  const getRandomStat = (): StatType => {
    const stats: StatType[] = ['careerGoals', 'worldCupGoals', 'internationalGoals'];
    return stats[Math.floor(Math.random() * stats.length)];
  };

  const startNewGame = (playerList = players) => {
    if (playerList.length < 2) return;
    
    let idxA = Math.floor(Math.random() * playerList.length);
    let idxB = Math.floor(Math.random() * playerList.length);
    while (idxA === idxB) {
      idxB = Math.floor(Math.random() * playerList.length);
    }
    
    setPlayerA(playerList[idxA]);
    setPlayerB(playerList[idxB]);
    setCurrentStat(getRandomStat());
    setRound(1);
    setScore(0);
    setGameState('playing');
    setGuessResult(null);
  };

  const nextRound = () => {
    if (round >= MAX_ROUNDS) {
      setGameState('won');
      return;
    }
    
    setPlayerA(playerB);
    
    let newIdx = Math.floor(Math.random() * players.length);
    while (players[newIdx].id === playerB?.id) {
      newIdx = Math.floor(Math.random() * players.length);
    }
    
    setPlayerB(players[newIdx]);
    setCurrentStat(getRandomStat());
    setRound(r => r + 1);
    setGameState('playing');
    setGuessResult(null);
  };

  const handleGuess = (guess: 'higher' | 'lower') => {
    if (gameState !== 'playing' || !playerA || !playerB) return;
    
    const valA = playerA[currentStat];
    const valB = playerB[currentStat];
    
    const isCorrect = 
      (guess === 'higher' && valB >= valA) || 
      (guess === 'lower' && valB <= valA);
      
    if (isCorrect) {
      setScore(s => s + 1);
      setGuessResult('correct');
      setGameState('revealed');
      
      setTimeout(() => {
        nextRound();
      }, 1500);
    } else {
      setGuessResult('incorrect');
      setGameState('lost');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-app text-text-sec">Loading Challenge...</div>;
  }

  if (!playerA || !playerB) return null;

  const defaultImg = "/player.png";

  return (
    <div className="min-h-screen bg-app text-text-main font-sans selection:bg-brand/30 pb-20">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 py-3 px-6 md:px-10 border-b border-border-subtle bg-surface">
        <Link href="/games" className="flex items-center text-text-sec hover:text-text-main font-semibold transition-colors w-full md:w-48 text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Gamehub
        </Link>
        
        <div className="flex items-center gap-2 font-black tracking-widest text-base shrink-0">
          <div className="w-6 h-6 rounded-full border-[2px] border-brand text-brand flex items-center justify-center">
            <div className="w-2 h-2 bg-brand rounded-full"></div>
          </div>
          HIGHER <span className="text-brand">OR</span> LOWER
        </div>
        
        <div className="flex items-center justify-end gap-2 w-full md:w-48">
          <div className="flex items-center gap-2 bg-surface-hover border border-border-subtle rounded-full px-3 py-1 font-bold shadow-sm text-sm">
            <Flame className="w-3.5 h-3.5 text-orange-500" fill="currentColor" />
            <span>Streak <span className="text-brand">{score}</span></span>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-surface-hover border border-border-subtle rounded-full px-3 py-1 font-bold shadow-sm text-sm">
            <Star className="w-3.5 h-3.5 text-text-muted" fill="currentColor" />
            <span className="text-brand">1,250 XP</span>
          </div>
        </div>
      </header>

      {/* Game Container */}
      <div className="max-w-2xl mx-auto py-6 px-4 flex flex-col items-center relative animate-in fade-in duration-500">
        
        {/* Progress Bar */}
        <div className="flex flex-col items-center w-full mb-8">
          <div className="text-[10px] font-bold text-text-muted tracking-[0.2em] mb-3 uppercase">
            Round {round} of {MAX_ROUNDS}
          </div>
          <div className="flex gap-2 w-full max-w-sm justify-center">
            {Array.from({ length: MAX_ROUNDS }).map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                  i < round - (gameState === 'playing' ? 1 : 0) 
                    ? 'bg-brand' 
                    : (i === round - 1 && gameState !== 'lost' ? 'bg-brand/40' : 'bg-surface-hover border border-border-subtle')
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Player A */}
        <div className="flex items-center justify-center gap-6 w-full">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-surface overflow-hidden shadow-sm shrink-0 flex items-center justify-center">
            <Image 
              src={playerA.imageUrl || defaultImg} 
              alt={playerA.name} 
              width={128} 
              height={128} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col flex-1">
            <h2 className="text-xl md:text-2xl font-black text-text-main mb-1">{playerA.name}</h2>
            <div className="text-5xl md:text-6xl font-black text-brand tracking-tighter leading-none mb-1">
              {playerA[currentStat]}
            </div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              {statLabels[currentStat]}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full max-w-md relative my-8 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-subtle"></div>
          </div>
          <div className="relative bg-app px-4">
            <div className="w-10 h-10 bg-surface border border-border-subtle rounded-full flex items-center justify-center font-bold text-text-muted text-xs shadow-sm">
              VS
            </div>
          </div>
        </div>

        {/* Player B */}
        <div className="flex items-center justify-center gap-6 w-full mb-10">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-surface overflow-hidden shadow-sm shrink-0 flex items-center justify-center">
            <Image 
              src={playerB.imageUrl || defaultImg} 
              alt={playerB.name} 
              width={128} 
              height={128} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col flex-1 relative">
            <h2 className="text-xl md:text-2xl font-black text-text-main mb-1">{playerB.name}</h2>
            
            <AnimatePresence mode="wait">
              {gameState === 'playing' ? (
                <motion.div 
                  key="unknown" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="text-5xl md:text-6xl font-black text-brand/40 tracking-tighter leading-none mb-1"
                >
                  ?
                </motion.div>
              ) : (
                <motion.div 
                  key="revealed" 
                  initial={{ opacity: 0, scale: 0.5 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className={`text-5xl md:text-6xl font-black tracking-tighter leading-none mb-1 ${
                    guessResult === 'correct' ? 'text-brand' : 'text-red-500'
                  }`}
                >
                  {playerB[currentStat]}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              {statLabels[currentStat]}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 w-full max-w-sm gap-4">
          <button 
            onClick={() => handleGuess('higher')}
            disabled={gameState !== 'playing'}
            className="py-3 md:py-4 rounded-md border-2 border-brand/50 text-brand font-bold text-base hover:border-brand hover:bg-brand/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
          >
            Higher
          </button>
          <button 
            onClick={() => handleGuess('lower')}
            disabled={gameState !== 'playing'}
            className="py-3 md:py-4 rounded-md border-2 border-brand/50 text-brand font-bold text-base hover:border-brand hover:bg-brand/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
          >
            Lower
          </button>
        </div>
        
      </div>

      {/* Win/Loss Modal */}
      <AnimatePresence>
        {(gameState === 'won' || gameState === 'lost') && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="fixed inset-0 z-50 bg-app/80 backdrop-blur-sm flex flex-col items-center justify-center p-6"
          >
            <div className="bg-surface border border-border-subtle p-10 rounded-md max-w-sm w-full text-center shadow-2xl">
              {gameState === 'won' ? (
                <>
                  <div className="w-24 h-24 bg-brand/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-brand" />
                  </div>
                  <h2 className="text-3xl font-black text-text-main mb-2">You Won!</h2>
                  <p className="text-text-sec mb-8 font-medium">Perfect streak of 10 rounds.</p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
                    <span className="text-5xl font-black">X</span>
                  </div>
                  <h2 className="text-3xl font-black text-text-main mb-2">Game Over</h2>
                  <p className="text-text-sec mb-8 font-medium">You made it to round <span className="font-bold text-text-main">{round}</span>.</p>
                </>
              )}
              
              <button 
                onClick={() => startNewGame()} 
                className="w-full py-4 bg-brand text-white font-bold text-lg rounded-md hover:bg-brand-hover transition-colors shadow-sm"
              >
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
