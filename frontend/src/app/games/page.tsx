"use client";
import Link from 'next/link';
import { Trophy, TrendingUp, Grid3X3, EyeOff, Map, Network } from 'lucide-react';

const games = [
  {
    id: 'higher-lower',
    title: 'Higher or Lower',
    description: 'Guess which player has more career goals, World Cup appearances, or a higher market value.',
    icon: TrendingUp,
    status: 'Play Now',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    id: 'grid',
    title: 'Football Grid',
    description: 'Find a player who satisfies the intersecting criteria of row and column in a 3x3 grid.',
    icon: Grid3X3,
    status: 'Play Now',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    id: 'blur',
    title: 'Blur Challenge',
    description: 'Identify the mystery player from a heavily blurred image. Wrong guesses reveal more detail.',
    icon: EyeOff,
    status: 'Coming Soon',
    color: 'text-brand',
    bg: 'bg-brand/10'
  },
  {
    id: 'career',
    title: 'Guess the Career',
    description: 'Follow the transfer path of a mystery player and guess who they are based on their club history.',
    icon: Map,
    status: 'Coming Soon',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10'
  },
  {
    id: 'connections',
    title: 'Connections',
    description: 'Group 16 football items into four hidden categories (e.g. World Cup Winners, Teammates).',
    icon: Network,
    status: 'Coming Soon',
    color: 'text-red-500',
    bg: 'bg-red-500/10'
  }
];

export default function GamesHub() {
  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-main tracking-tight mb-2">Gamehub</h1>
          <p className="font-cabin text-text-sec font-medium">Test your football knowledge with our daily challenges.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Link href={`/games/${game.id}`} key={game.id} className={`block bg-surface border border-border-subtle rounded-md p-6 transition-all duration-200 shadow-sm ${game.status === 'Play Now' ? 'hover:-translate-y-1 hover:shadow-md cursor-pointer hover:border-brand/30 group' : 'opacity-80 cursor-not-allowed'}`}>
            <div className={`w-14 h-14 ${game.bg} ${game.color} rounded-md flex items-center justify-center mb-5 ${game.status === 'Play Now' ? 'group-hover:scale-110 transition-transform' : ''}`}>
              <game.icon className="w-7 h-7" />
            </div>
            
            <h2 className="text-xl font-bold mb-2 text-text-main">{game.title}</h2>
            <p className="font-cabin font-medium text-text-sec text-sm leading-relaxed mb-6 min-h-[60px]">{game.description}</p>
            
            <div className="flex items-center justify-between mt-auto">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                game.status === 'Play Now' 
                  ? 'bg-brand text-white shadow-sm group-hover:bg-brand-hover transition-colors' 
                  : 'bg-surface-hover text-text-muted border border-border-subtle'
              }`}>
                {game.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
