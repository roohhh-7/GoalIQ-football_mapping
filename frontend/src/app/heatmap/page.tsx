"use client";
import { useState, useEffect, useRef } from 'react';
import { Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

export default function Heatmap() {
  const [shots, setShots] = useState([]);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    fetch('/shots.json')
      .then(res => res.json())
      .then(data => {
        setShots(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && shots.length > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const width = canvas.width;
      const height = canvas.height;
      const pitchWidth = 120;
      const pitchHeight = 80;

      ctx.clearRect(0, 0, width, height);

      const currentTheme = theme === 'system' ? systemTheme : theme;
      // Using GoalIQ Semantic Colors
      const goalColor = currentTheme === 'dark' ? 'rgba(95, 174, 99, 0.9)' : 'rgba(78, 154, 84, 0.9)'; 
      const missColor = currentTheme === 'dark' ? 'rgba(112, 123, 114, 0.2)' : 'rgba(139, 146, 141, 0.3)';

      shots.forEach(shot => {
        const x = (shot.x / pitchWidth) * width;
        const y = (shot.y / pitchHeight) * height;
        const isGoal = shot.is_goal === 1;

        ctx.beginPath();
        ctx.arc(x, y, isGoal ? 3 : 1.5, 0, 2 * Math.PI, false);
        ctx.fillStyle = isGoal ? goalColor : missColor;
        ctx.fill();
      });
    }
  }, [loading, shots, theme, systemTheme]);

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
          <p className="text-text-sec font-medium">Explore the density of every single shot taken across the World Cup dataset.</p>
        </div>
      </header>

      {/* Main Content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden min-h-[500px]">
        
        <div className="flex items-center gap-4 mb-6">
          <Globe2 className="w-6 h-6 text-text-muted" />
          <p className="text-sm text-text-sec font-medium">Rendering <span className="text-text-main font-bold">{shots.length.toLocaleString()}</span> data points using Canvas API for high performance.</p>
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
