"use client";
import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ChevronDown, Crosshair, BarChart3, Goal, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Pitch from '@/components/Pitch';

function SearchableSelect({ options, value, onChange, placeholder }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full md:w-[400px]">
      <div 
        className="relative flex items-center bg-surface border-0 text-text-sec rounded-md py-3 px-4 shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] cursor-pointer hover:bg-surface-hover transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Search className="w-5 h-5 text-text-muted mr-3" />
        <span className="flex-1 truncate font-medium">{value || placeholder}</span>
        <ChevronDown className="w-5 h-5 text-text-muted ml-2" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 mt-2 w-full bg-surface border-0 rounded-md shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] max-h-80 overflow-y-auto overflow-hidden"
          >
            <div className="sticky top-0 bg-surface p-2 border-b border-border-subtle">
              <input
                type="text"
                autoFocus
                placeholder="Type to search..."
                className="w-full bg-surface-hover text-text-main px-3 py-2 rounded-md outline-none border-0 shadow-inner dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
            </div>
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-text-muted text-center text-sm">No results found</div>
            ) : (
              filteredOptions.map(opt => (
                <div 
                  key={opt}
                  className="px-4 py-3 hover:bg-surface-hover cursor-pointer text-text-sec text-sm font-medium transition-colors"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {opt}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Players() {
  const [shots, setShots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerSearch, setPlayerSearch] = useState('Lionel Andrés Messi Cuccittini');
  const [seasonSearch, setSeasonSearch] = useState('All World Cups');

  useEffect(() => {
    fetch('/shots.json')
      .then(res => res.json())
      .then(data => {
        setShots(data);
        setLoading(false);
        
        // Handle incoming search query
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        if (q) {
          const lowerQ = q.toLowerCase();
          // Find first player that includes the search term
          const counts = {};
          data.forEach(s => counts[s.player] = (counts[s.player] || 0) + 1);
          const validPlayers = Object.entries(counts).filter(([_, count]) => count >= 3).map(([name]) => name);
          const match = validPlayers.find(p => p.toLowerCase().includes(lowerQ));
          if (match) setPlayerSearch(match);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const players = useMemo(() => {
    if (!shots.length) return [];
    const counts = {};
    shots.forEach(s => counts[s.player] = (counts[s.player] || 0) + 1);
    return Object.entries(counts).filter(([_, count]) => count >= 3).map(([name]) => name).sort();
  }, [shots]);

  const availableSeasons = useMemo(() => {
    if (!shots.length) return [];
    const playerShots = shots.filter(s => s.player === playerSearch);
    return ['All World Cups', ...Array.from(new Set(playerShots.map(s => s.season.toString()))).sort().reverse()];
  }, [shots, playerSearch]);

  useEffect(() => {
    setSeasonSearch('All World Cups');
  }, [playerSearch]);

  const filteredShots = useMemo(() => {
    return shots.filter(s => {
      const matchPlayer = s.player === playerSearch;
      const matchSeason = seasonSearch === 'All World Cups' || s.season.toString() === seasonSearch;
      return matchPlayer && matchSeason;
    });
  }, [shots, playerSearch, seasonSearch]);

  const metrics = useMemo(() => {
    if (!filteredShots.length) return { goals: 0, xg: 0, shots: 0 };
    const goals = filteredShots.filter(s => s.is_goal === 1).length;
    const xg = filteredShots.reduce((sum, s) => sum + s.statsbomb_xg, 0);
    return { goals, xg, shots: filteredShots.length };
  }, [filteredShots]);

  const diff = metrics.goals - metrics.xg;
  const isPositive = diff > 0;

  if (loading) {
    return (
      <div className="p-10 text-text-sec">Loading Intelligence...</div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-main tracking-tight mb-2">Player Intelligence</h1>
          <p className="font-cabin text-text-sec font-medium">Analyze individual finishing performance across the World Cup.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <SearchableSelect options={players} value={playerSearch} onChange={setPlayerSearch} placeholder="Search player..." />
          <SearchableSelect 
            options={availableSeasons} 
            value={seasonSearch} 
            onChange={setSeasonSearch} 
            placeholder="Select World Cup..." 
          />
        </div>
      </header>

      {/* Metrics Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-border-subtle rounded-md p-6 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-surface-hover rounded-md border border-border-subtle">
            <Crosshair className="w-8 h-8 text-brand" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Total Shots</p>
            <p className="text-3xl font-black text-text-main">{metrics.shots}</p>
          </div>
        </div>
        
        <div className="bg-surface border border-border-subtle rounded-md p-6 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-surface-hover rounded-md border border-border-subtle">
            <BarChart3 className="w-8 h-8 text-brand" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Expected Goals (xG)</p>
            <p className="text-3xl font-black text-text-main">{metrics.xg.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-surface border border-border-subtle rounded-md p-6 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-surface-hover rounded-md border border-border-subtle">
            <Goal className="w-8 h-8 text-brand" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Actual Goals</p>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-black text-text-main">{metrics.goals}</p>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${isPositive ? 'text-pitch-success bg-brand-soft' : 'text-pitch-blocked bg-surface-hover'}`}>
                {isPositive ? '+' : ''}{diff.toFixed(2)} vs xG
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-main">Intelligence Map</h2>
            <div className="flex items-center gap-2 text-xs font-medium text-text-sec bg-surface border border-border-subtle px-3 py-1.5 rounded-md shadow-sm">
              <Info className="w-4 h-4" /> Hover dots for details
            </div>
          </div>
          <Pitch shots={filteredShots} />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-text-main">Analytics</h2>
          
          <div className="bg-surface border border-border-subtle rounded-md p-6 shadow-sm">
            <h3 className="text-xs font-bold text-text-muted mb-6 uppercase tracking-widest border-b border-border-subtle pb-3">Body Part</h3>
            <div className="space-y-5">
              {['Right Foot', 'Left Foot', 'Head', 'Other'].map(part => {
                const count = filteredShots.filter(s => s.shot_body_part === part).length;
                if (count === 0) return null;
                const pct = (count / metrics.shots) * 100;
                return (
                  <div key={part}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-text-sec text-sm font-medium">{part}</span>
                      <span className="text-text-main font-bold text-sm">{count} <span className="text-text-muted font-normal">({pct.toFixed(0)}%)</span></span>
                    </div>
                    <div className="w-full bg-surface-hover rounded-full h-2 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="bg-brand h-full rounded-full" />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <h3 className="text-xs font-bold text-text-muted mt-8 mb-4 uppercase tracking-widest border-b border-border-subtle pb-3">Contexts</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(filteredShots.map(s => s.play_pattern)))
                .map(pattern => ({ pattern, count: filteredShots.filter(s => s.play_pattern === pattern).length }))
                .sort((a, b) => b.count - a.count).slice(0, 4)
                .map(({ pattern, count }) => (
                  <div key={pattern} className="bg-surface-hover border border-border-subtle px-3 py-1.5 rounded-md flex items-center gap-2">
                    <span className="text-text-sec text-xs font-medium">{pattern}</span>
                    <span className="bg-surface text-text-main text-[10px] px-1.5 font-bold rounded-md border border-border-subtle">{count}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
