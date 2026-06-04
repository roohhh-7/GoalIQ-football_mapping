"use client";
import { useState, useEffect, useRef, useMemo } from 'react';
import { Globe2, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

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
    <div ref={wrapperRef} className="relative w-full md:w-[300px]">
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
                  className="px-4 py-3 hover:bg-surface-hover text-text-main cursor-pointer transition-colors"
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

export default function Heatmap() {
  const [shots, setShots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seasonSearch, setSeasonSearch] = useState('All World Cups');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    fetch('/shots.json')
      .then(res => res.json())
      .then(data => {
        setShots(data);
        setLoading(false);

        const params = new URLSearchParams(window.location.search);
        const year = params.get('year');
        if (year) {
          setSeasonSearch(year);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const availableSeasons = useMemo(() => {
    if (!shots.length) return [];
    return ['All World Cups', ...Array.from(new Set<string>(shots.map(s => s.season.toString()))).sort().reverse()];
  }, [shots]);

  const filteredShots = useMemo(() => {
    if (seasonSearch === 'All World Cups') return shots;
    return shots.filter(s => s.season.toString() === seasonSearch);
  }, [shots, seasonSearch]);

  useEffect(() => {
    if (!loading && filteredShots.length > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const width = canvas.width;
      const height = canvas.height;
      const pitchWidth = 120;
      const pitchHeight = 80;

      ctx.clearRect(0, 0, width, height);

      const currentTheme = theme === 'system' ? systemTheme : theme;
      // Using GoalIQ Semantic Colors
      const goalColor = currentTheme === 'dark' ? 'rgba(95, 174, 99, 0.9)' : 'rgba(78, 154, 84, 0.9)'; 
      const missColor = currentTheme === 'dark' ? 'rgba(112, 123, 114, 0.2)' : 'rgba(139, 146, 141, 0.3)';

      filteredShots.forEach(shot => {
        const x = (shot.x / pitchWidth) * width;
        const y = (shot.y / pitchHeight) * height;
        const isGoal = shot.is_goal === 1;

        ctx.beginPath();
        ctx.arc(x, y, isGoal ? 3 : 1.5, 0, 2 * Math.PI, false);
        ctx.fillStyle = isGoal ? goalColor : missColor;
        ctx.fill();
      });
    }
  }, [loading, filteredShots, theme, systemTheme]);

  if (loading) {
    return (
      <div className="p-10 text-text-sec">Loading Intelligence...</div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 h-screen flex flex-col">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-main tracking-tight mb-2">Global Heatmap</h1>
          <p className="font-cabin text-text-sec font-medium">Explore the density of every single shot taken across the World Cup dataset.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <SearchableSelect 
            options={availableSeasons} 
            value={seasonSearch} 
            onChange={setSeasonSearch} 
            placeholder="Select World Cup..." 
          />
        </div>
      </header>

      {/* Main Content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 bg-surface border border-border-subtle rounded-md p-6 shadow-sm flex flex-col relative overflow-hidden min-h-[500px]">
        
        <div className="flex items-center gap-4 mb-6">
          <Globe2 className="w-6 h-6 text-text-muted" />
          <p className="text-sm text-text-sec font-medium">Rendering <span className="text-text-main font-bold">{filteredShots.length.toLocaleString()}</span> data points using Canvas API for high performance.</p>
        </div>

        {/* The Pitch Container */}
        <div className="relative w-full max-w-4xl mx-auto aspect-[120/80] bg-surface-hover rounded-md overflow-hidden border border-border-subtle mt-4">
          
          {/* Pitch Markings (SVG layer underneath) */}
          <svg 
            viewBox="0 0 120 80" 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            <g strokeWidth="0.5" fill="none" className="stroke-border-hover">
              <rect x="0" y="0" width="120" height="80" />
              <line x1="60" y1="0" x2="60" y2="80" />
              <circle cx="60" cy="40" r="9.15" />
              <circle cx="60" cy="40" r="0.5" className="fill-border-hover" />
              <rect x="0" y="19.84" width="16.5" height="40.32" />
              <rect x="0" y="30.84" width="5.5" height="18.32" />
              <circle cx="11" cy="40" r="0.5" className="fill-border-hover" />
              <path d="M 16.5 31 A 9.15 9.15 0 0 1 16.5 49" />
              <rect x="103.5" y="19.84" width="16.5" height="40.32" />
              <rect x="114.5" y="30.84" width="5.5" height="18.32" />
              <circle cx="109" cy="40" r="0.5" className="fill-border-hover" />
              <path d="M 103.5 31 A 9.15 9.15 0 0 0 103.5 49" />
            </g>
          </svg>

          {/* High-Performance HTML5 Canvas for millions of dots */}
          <canvas 
            ref={canvasRef} 
            width={1200} 
            height={800} 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />

        </div>

      </motion.div>
    </div>
  );
}
