"use client";
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, Flame, Search, X, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type GridCriteria = {
  id: string;
  type: string;
  name: string;
};

type GridData = {
  rows: GridCriteria[];
  cols: GridCriteria[];
  answers: Record<string, string[]>;
};

type CellState = {
  player: string;
  imageUrl: string;
};

export default function FootballGrid() {
  const [data, setData] = useState<GridData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [guessesLeft, setGuessesLeft] = useState(9);
  const [gridState, setGridState] = useState<Record<string, CellState>>({});
  
  const [selectedCell, setSelectedCell] = useState<{row: string, col: string, rowName: string, colName: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/grid-data.json')
      .then(res => res.json())
      .then((json: GridData) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedCell && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [selectedCell]);

  // Derived list of all possible players for search autocomplete
  const allPlayers = useMemo(() => Array.from(new Set(
    data ? Object.values(data.answers).flat() : []
  )).sort(), [data]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = allPlayers.filter(p => 
        p.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allPlayers]);

  const handleCellClick = (rowId: string, colId: string, rowName: string, colName: string) => {
    if (gameState !== 'playing') return;
    const cellKey = `${rowId}-${colId}`;
    if (gridState[cellKey]) return; // already solved
    
    setSelectedCell({ row: rowId, col: colId, rowName, colName });
    setSearchQuery('');
  };

  const handleGuess = (playerName: string) => {
    if (!selectedCell || gameState !== 'playing') return;
    
    const cellKey = `${selectedCell.row}-${selectedCell.col}`;
    const validAnswers = data?.answers[cellKey] || [];
    
    // Check if correct
    const isCorrect = validAnswers.some(a => a.toLowerCase() === playerName.toLowerCase());
    
    if (isCorrect) {
      // Check if already guessed elsewhere
      const alreadyGuessed = Object.values(gridState).some(state => state.player.toLowerCase() === playerName.toLowerCase());
      
      if (!alreadyGuessed) {
        const newGridState = {
          ...gridState,
          [cellKey]: {
            player: playerName,
            imageUrl: '/player.png' // Generic placeholder for grid
          }
        };
        setGridState(newGridState);
        
        // Check win condition
        if (Object.keys(newGridState).length === 9) {
          setGameState('won');
        }
      } else {
        // Technically correct for the cell, but already used. Treat as wrong.
        setGuessesLeft(prev => Math.max(0, prev - 1));
      }
    } else {
      setGuessesLeft(prev => Math.max(0, prev - 1));
    }
    
    setSelectedCell(null);
    setSearchQuery('');
    
    if (guessesLeft <= 1 && !isCorrect) {
      setGameState('lost');
    }
  };

  if (loading || !data) {
    return <div className="flex items-center justify-center h-screen bg-app text-text-sec">Loading Grid...</div>;
  }

  return (
    <div className="min-h-screen bg-app text-text-main font-sans selection:bg-brand/30 pb-20 relative">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 py-3 px-6 md:px-10 border-b border-border-subtle bg-surface">
        <Link href="/games" className="flex items-center text-text-sec hover:text-text-main font-semibold transition-colors w-full md:w-48 text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Gamehub
        </Link>
        
        <div className="flex items-center gap-2 font-black tracking-widest text-base shrink-0 uppercase">
          <div className="w-6 h-6 rounded-sm border-[2px] border-brand text-brand flex items-center justify-center">
             <div className="w-2 h-2 bg-brand rounded-sm"></div>
          </div>
          Football <span className="text-brand">Grid</span>
        </div>
        
        <div className="flex items-center justify-end gap-2 w-full md:w-48">
          <div className="flex items-center gap-2 bg-surface-hover border border-border-subtle rounded-full px-3 py-1 font-bold shadow-sm text-sm">
            <span className="text-text-muted">Guesses: </span>
            <span className={`text-brand ${guessesLeft <= 3 ? 'text-red-500' : ''}`}>{guessesLeft}</span>
          </div>
        </div>
      </header>

      {/* Game Container */}
      <div className="max-w-3xl mx-auto py-10 px-4 flex flex-col items-center animate-in fade-in duration-500">
        
        {/* The Grid */}
        <div className="w-full max-w-2xl bg-surface border border-border-subtle rounded-xl p-4 md:p-8 shadow-sm">
           
           <div className="grid grid-cols-4 gap-2 md:gap-4">
              {/* Top Left Empty Cell */}
              <div className="flex items-center justify-center text-center p-2"></div>
              
              {/* Column Headers */}
              {data.cols.map(col => (
                <div key={col.id} className="flex flex-col items-center justify-end text-center p-2">
                   <span className="text-xs md:text-sm font-bold text-text-main leading-tight">{col.name}</span>
                </div>
              ))}

              {/* Rows */}
              {data.rows.map(row => (
                <div key={row.id} className="contents">
                  {/* Row Header */}
                  <div className="flex flex-col items-end justify-center text-right p-2 border-r border-border-subtle">
                     <span className="text-xs md:text-sm font-bold text-text-main leading-tight pr-2 md:pr-4">{row.name}</span>
                  </div>
                  
                  {/* Row Cells */}
                  {data.cols.map(col => {
                    const cellKey = `${row.id}-${col.id}`;
                    const cellData = gridState[cellKey];
                    
                    return (
                      <div 
                        key={cellKey}
                        onClick={() => handleCellClick(row.id, col.id, row.name, col.name)}
                        className={`
                          aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2 relative overflow-hidden transition-all duration-300
                          ${cellData 
                            ? 'border-brand bg-brand/10' 
                            : 'border-border-subtle bg-surface-hover hover:border-brand/50 hover:bg-brand/5 cursor-pointer'}
                          ${selectedCell?.row === row.id && selectedCell?.col === col.id ? 'ring-4 ring-brand/30 border-brand' : ''}
                        `}
                      >
                        {cellData ? (
                          <>
                             <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden mb-2 border-2 border-brand/20 bg-surface">
                                <Image src={cellData.imageUrl} alt={cellData.player} width={64} height={64} className="w-full h-full object-cover" />
                             </div>
                             <span className="text-[10px] md:text-xs font-bold text-text-main text-center leading-tight line-clamp-2">{cellData.player}</span>
                          </>
                        ) : (
                           <Search className="w-6 h-6 text-text-muted/30" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
           </div>
           
        </div>
      </div>

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {selectedCell && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 bg-app/80 backdrop-blur-sm flex items-start justify-center pt-32 px-4"
          >
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-surface border border-border-subtle rounded-xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-hover">
                <div className="text-sm font-bold text-text-main">
                  {selectedCell.rowName} <span className="text-brand mx-2">+</span> {selectedCell.colName}
                </div>
                <button onClick={() => setSelectedCell(null)} className="text-text-muted hover:text-text-main transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a player..."
                    className="w-full bg-app border border-border-subtle rounded-lg py-4 pl-12 pr-4 text-text-main focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
                  />
                </div>
                
                {searchQuery.trim().length > 1 && (
                  <div className="mt-2 border border-border-subtle rounded-lg overflow-hidden bg-surface max-h-60 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map(player => (
                        <button
                          key={player}
                          onClick={() => handleGuess(player)}
                          className="w-full text-left px-4 py-3 hover:bg-surface-hover border-b border-border-subtle last:border-b-0 text-sm font-bold text-text-main transition-colors"
                        >
                          {player}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-center text-text-muted text-sm">No players found matching "{searchQuery}"</div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <h2 className="text-3xl font-black text-text-main mb-2">Immaculate Grid!</h2>
                  <p className="text-text-sec mb-8 font-medium">You filled out the entire grid with {guessesLeft} guess{guessesLeft !== 1 ? 'es' : ''} remaining.</p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
                    <span className="text-5xl font-black">X</span>
                  </div>
                  <h2 className="text-3xl font-black text-text-main mb-2">Out of Guesses</h2>
                  <p className="text-text-sec mb-8 font-medium">You managed to fill {Object.keys(gridState).length} out of 9 cells.</p>
                </>
              )}
              
              <button 
                onClick={() => window.location.reload()} 
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
