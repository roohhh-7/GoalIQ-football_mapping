"use client";
import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ChevronDown, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Pitch from '@/components/Pitch';

function SearchableSelect({ options, value, onChange, placeholder }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt: string) => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
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
              filteredOptions.map((opt: string) => (
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

function MetricRow({ label, valueA, valueB, format = (v: any) => v, reverseGood = false }: any) {
  const isAGood = reverseGood ? valueA < valueB : valueA > valueB;
  const isBGood = reverseGood ? valueB < valueA : valueB > valueA;
  
  return (
    <div className="flex items-center justify-between py-4 border-b border-border-subtle last:border-0">
      <div className={`flex-1 text-center font-bold text-2xl ${isAGood ? 'text-brand' : 'text-text-main'}`}>{format(valueA)}</div>
      <div className="w-40 text-center text-[11px] font-bold text-text-muted uppercase tracking-widest">{label}</div>
      <div className={`flex-1 text-center font-bold text-2xl ${isBGood ? 'text-brand' : 'text-text-main'}`}>{format(valueB)}</div>
    </div>
  );
}

export default function Compare() {
  const [shots, setShots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'players' | 'teams'>('players');
  
  const [playerA, setPlayerA] = useState('Lionel Andrés Messi Cuccittini');
  const [playerB, setPlayerB] = useState('Kylian Mbappé Lottin');
  
  const [teamA, setTeamA] = useState('Argentina');
  const [teamB, setTeamB] = useState('France');
  
  const [seasonA, setSeasonA] = useState('All World Cups');
  const [seasonB, setSeasonB] = useState('All World Cups');

  useEffect(() => {
    fetch('/shots.json')
      .then(res => res.json())
      .then(data => {
        setShots(data);
        setLoading(false);
      });
  }, []);

  const playersList = useMemo(() => Array.from(new Set(shots.map(s => s.player))).sort(), [shots]);
  const teamsList = useMemo(() => Array.from(new Set(shots.map(s => s.team))).sort(), [shots]);
  const seasonsList = useMemo(() => ['All World Cups', ...Array.from(new Set(shots.map(s => s.season.toString()))).sort().reverse()], [shots]);

  const entityA = mode === 'players' ? playerA : teamA;
  const entityB = mode === 'players' ? playerB : teamB;
  const setEntityA = mode === 'players' ? setPlayerA : setTeamA;
  const setEntityB = mode === 'players' ? setPlayerB : setTeamB;
  const options = mode === 'players' ? playersList : teamsList;

  const getMetrics = (entity: string, season: string) => {
    const filtered = shots.filter(s => {
      const matchEntity = mode === 'players' ? s.player === entity : s.team === entity;
      const matchSeason = season === 'All World Cups' || s.season.toString() === season;
      return matchEntity && matchSeason;
    });
    const goals = filtered.filter(s => s.is_goal === 1).length;
    const xg = filtered.reduce((sum, s) => sum + (s.statsbomb_xg || 0), 0);
    const conversion = filtered.length > 0 ? goals / filtered.length : 0;
    const diff = goals - xg;
    return { goals, xg, shots: filtered.length, conversion, diff, shotData: filtered };
  };

  const metricsA = useMemo(() => getMetrics(entityA, seasonA), [entityA, mode, seasonA, shots]);
  const metricsB = useMemo(() => getMetrics(entityB, seasonB), [entityB, mode, seasonB, shots]);

  if (loading) {
    return <div className="p-10 text-text-sec">Loading Comparison Engine...</div>;
  }

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-main tracking-tight mb-2">Compare</h1>
          <p className="font-cabin text-text-sec font-medium">Head-to-head analysis engine.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
          <div className="flex bg-surface-hover rounded-md p-1 w-fit border border-border-subtle">
            <button
              onClick={() => setMode('players')}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors ${mode === 'players' ? 'bg-surface text-brand shadow-sm' : 'text-text-muted hover:text-text-main'}`}
            >
              Players
            </button>
            <button
              onClick={() => setMode('teams')}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors ${mode === 'teams' ? 'bg-surface text-brand shadow-sm' : 'text-text-muted hover:text-text-main'}`}
            >
              Teams
            </button>
          </div>
        </div>
      </header>

      {/* Selectors */}
      <div className="flex flex-col md:flex-row gap-6 w-full items-center bg-surface border border-border-subtle p-6 rounded-md shadow-sm">
        <div className="flex-1 w-full flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 ml-1">Select {mode === 'players' ? 'Player A' : 'Team A'}</label>
            <SearchableSelect
              options={options as string[]}
              value={entityA}
              onChange={setEntityA}
              placeholder={`Search ${mode === 'players' ? 'Player' : 'Team'}...`}
            />
          </div>
          <div>
            <SearchableSelect 
              options={seasonsList as string[]} 
              value={seasonA} 
              onChange={setSeasonA} 
              placeholder="Year A..." 
            />
          </div>
        </div>
        
        <div className="flex items-center justify-center w-12 h-12 bg-surface-hover rounded-full border border-border-subtle font-black text-text-muted italic shadow-inner shrink-0 my-4 md:my-0">
          VS
        </div>
        
        <div className="flex-1 w-full flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 ml-1">Select {mode === 'players' ? 'Player B' : 'Team B'}</label>
            <SearchableSelect
              options={options as string[]}
              value={entityB}
              onChange={setEntityB}
              placeholder={`Search ${mode === 'players' ? 'Player' : 'Team'}...`}
            />
          </div>
          <div>
            <SearchableSelect 
              options={seasonsList as string[]} 
              value={seasonB} 
              onChange={setSeasonB} 
              placeholder="Year B..." 
            />
          </div>
        </div>
      </div>

      {/* Metrics Board */}
      <div className="bg-surface border border-border-subtle rounded-md p-6 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-2 bg-brand/40" />
        <div className="absolute top-0 right-0 w-1/2 h-2 bg-brand" />
        
        <div className="flex justify-between items-end mb-8 pb-6 border-b border-border-subtle">
          <div className="flex-1 text-center truncate px-4">
            <div className="text-xl md:text-2xl font-black text-text-main truncate">{entityA}</div>
            {seasonA !== 'All World Cups' && <div className="text-sm font-semibold text-brand mt-1">{seasonA}</div>}
          </div>
          <div className="w-40 text-center text-xs font-bold text-brand bg-brand-soft py-1 px-3 rounded-full">MATCHUP</div>
          <div className="flex-1 text-center truncate px-4">
            <div className="text-xl md:text-2xl font-black text-text-main truncate">{entityB}</div>
            {seasonB !== 'All World Cups' && <div className="text-sm font-semibold text-brand mt-1">{seasonB}</div>}
          </div>
        </div>
        
        <MetricRow label="Goals" valueA={metricsA.goals} valueB={metricsB.goals} />
        <MetricRow label="Expected Goals (xG)" valueA={metricsA.xg} valueB={metricsB.xg} format={(v: number) => v.toFixed(2)} />
        <MetricRow label="Total Shots" valueA={metricsA.shots} valueB={metricsB.shots} />
        <MetricRow label="Goal Conversion" valueA={metricsA.conversion} valueB={metricsB.conversion} format={(v: number) => `${(v * 100).toFixed(1)}%`} />
        <MetricRow label="Goals vs xG Diff" valueA={metricsA.diff} valueB={metricsB.diff} format={(v: number) => (v > 0 ? '+' : '') + v.toFixed(2)} />
      </div>

      {/* Side-by-Side Pitches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[450px] lg:h-[400px]">
        <div className="bg-surface border border-border-subtle rounded-md shadow-sm overflow-hidden relative flex flex-col">
          <div className="absolute top-4 left-4 z-10 bg-surface/80 backdrop-blur-md px-4 py-2 rounded-md border border-border-subtle text-sm font-bold shadow-sm max-w-[80%] truncate">
            <span className="text-brand mr-2">A</span> {entityA} {seasonA !== 'All World Cups' && `(${seasonA})`}
          </div>
          <div className="flex-1">
            <Pitch shots={metricsA.shotData} />
          </div>
        </div>
        
        <div className="bg-surface border border-border-subtle rounded-md shadow-sm overflow-hidden relative flex flex-col">
          <div className="absolute top-4 right-4 z-10 bg-surface/80 backdrop-blur-md px-4 py-2 rounded-md border border-border-subtle text-sm font-bold shadow-sm max-w-[80%] truncate">
            {entityB} {seasonB !== 'All World Cups' && `(${seasonB})`} <span className="text-brand ml-2">B</span>
          </div>
          <div className="flex-1">
            <Pitch shots={metricsB.shotData} />
          </div>
        </div>
      </div>

    </div>
  );
}
