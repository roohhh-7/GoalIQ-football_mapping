"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Target, Users, Calendar, Trophy, Lock, Search, ArrowRight, Activity, Map, User, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isLoggedIn, login } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [teamsList, setTeamsList] = useState<string[]>([]);
  const [playersList, setPlayersList] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/shots.json')
        .then(res => res.json())
        .then((data: any[]) => {
          const uniqueTeams = Array.from(new Set<string>(data.map(s => s.team)));
          const uniquePlayers = Array.from(new Set<string>(data.map(s => s.player)));
          setTeamsList(uniqueTeams as string[]);
          setPlayersList(uniquePlayers as string[]);
        })
        .catch(console.error);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allSuggestions = [...teamsList, ...playersList];
  const filteredSuggestions = searchQuery.trim() 
    ? allSuggestions.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8) 
    : [];

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setIsSearchFocused(false);
    
    const isTeam = teamsList.some(t => t.toLowerCase() === suggestion.toLowerCase());
    if (isTeam) {
      router.push(`/teams?q=${encodeURIComponent(suggestion)}`);
    } else {
      router.push(`/players?q=${encodeURIComponent(suggestion)}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const query = searchQuery.trim().toLowerCase();
    const isTeam = teamsList.some(t => t.toLowerCase().includes(query));
    
    if (isTeam) {
      router.push(`/teams?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/players?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const renderStatsCard = () => (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-surface border border-border-subtle rounded-md p-6 shadow-sm mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border-subtle">
          <div className="flex items-center justify-center gap-5 px-4">
            <Target className="w-7 h-7 text-brand" strokeWidth={2} />
            <div className="flex flex-col">
              <span className="text-[22px] font-semibold text-text-main leading-tight">500,000+</span>
              <span className="text-[9px] font-semibold tracking-wider text-text-muted uppercase mt-0.5">Shots Analyzed</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5 px-4">
            <Users className="w-7 h-7 text-brand" strokeWidth={2} />
            <div className="flex flex-col">
              <span className="text-[22px] font-semibold text-text-main leading-tight">32</span>
              <span className="text-[9px] font-semibold tracking-wider text-text-muted uppercase mt-0.5">Teams</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5 px-4">
            <Calendar className="w-7 h-7 text-brand" strokeWidth={2} />
            <div className="flex flex-col">
              <span className="text-[22px] font-semibold text-text-main leading-tight">12</span>
              <span className="text-[9px] font-semibold tracking-wider text-text-muted uppercase mt-0.5">World Cups</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5 px-4">
            <Trophy className="w-7 h-7 text-brand" strokeWidth={2} />
            <div className="flex flex-col">
              <span className="text-[22px] font-semibold text-text-main leading-tight">56</span>
              <span className="text-[9px] font-semibold tracking-wider text-text-muted uppercase mt-0.5">Years of Data</span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-text-muted text-center font-normal">
        Comprehensive shot data from every World Cup, 1966 to 2022.
      </p>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col p-8 lg:p-12 pb-16">
      {/* Top Right Header Elements */}
      <div className="flex justify-end items-center gap-4 mb-8 lg:mb-0 lg:absolute lg:top-8 lg:right-12 z-10">
        {!isLoggedIn && (
          <>
            <button 
              onClick={login}
              className="px-6 py-2 rounded-md text-[13px] font-semibold bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-black shadow-sm"
            >
              Log In
            </button>
            <button 
              onClick={login}
              className="px-6 py-2 rounded-md text-[13px] font-semibold bg-[#152e18] hover:bg-[#1a3a1e] border border-[#152e18] transition-colors text-white shadow-sm"
            >
              Sign Up
            </button>
          </>
        )}
      </div>

      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full mt-4 lg:mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-10">
          {/* Left Column: Copy & Interactive Elements */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-[5rem] font-semibold tracking-tight text-text-main leading-[1.05]">
                Understand<br />Every Shot.
              </h1>
              <p className="font-cabin text-lg text-text-sec max-w-md leading-relaxed font-normal">
                Explore player performance, team tactics and shot quality using historical World Cup data.
              </p>
            </div>

            {!isLoggedIn ? (
              <div className="bg-surface-hover border border-border-subtle rounded-md p-8 flex flex-col items-center text-center max-w-md">
                <div className="w-10 h-10 rounded-full border border-border-subtle bg-surface flex items-center justify-center mb-4">
                  <Lock className="w-4 h-4 text-text-muted" strokeWidth={2} />
                </div>
                <h3 className="text-[15px] font-semibold text-text-main mb-2">Intelligence Engine Locked</h3>
                <p className="text-[13px] text-text-sec leading-relaxed">
                  Log in or sign up to unlock the global search engine and<br />access the World Cup database.
                </p>
              </div>
            ) : (
              <form ref={searchRef} onSubmit={handleSearch} className="relative max-w-md">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-10">
                  <Search className="h-5 w-5 text-text-muted" strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search player or team..."
                  className="w-full pl-14 pr-14 py-3.5 bg-surface border border-border-subtle rounded-md text-[14px] font-normal text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent shadow-sm relative z-0"
                />
                <button type="submit" className="absolute inset-y-0 right-4 flex items-center z-10">
                  <div className="bg-surface-hover border border-border-hover rounded-md text-text-sec text-[13px] font-normal px-2.5 py-0.5 hover:bg-surface transition-colors cursor-pointer">
                    ↵
                  </div>
                </button>
                
                <AnimatePresence>
                  {isSearchFocused && searchQuery.trim() && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 mt-2 w-full bg-surface border border-border-subtle rounded-md shadow-xl max-h-64 overflow-y-auto overflow-hidden"
                    >
                      {filteredSuggestions.length === 0 ? (
                        <div className="p-4 text-text-muted text-center text-sm">No matches found</div>
                      ) : (
                        filteredSuggestions.map((suggestion) => {
                          const isTeam = teamsList.includes(suggestion);
                          return (
                            <div 
                              key={suggestion}
                              className="px-4 py-3 flex items-center gap-3 hover:bg-surface-hover text-text-main cursor-pointer transition-colors"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {isTeam ? <Users className="w-4 h-4 text-brand" /> : <User className="w-4 h-4 text-brand" />}
                              <span className="text-[14px] font-medium">{suggestion}</span>
                            </div>
                          );
                        })
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            )}
          </div>

          {/* Right Column: Hero Image */}
          <div className="relative flex justify-center lg:justify-end cursor-default">
            <Image 
              src="/hero_transparent.png" 
              alt="3D Pitch Visualization" 
              width={800} 
              height={600} 
              className="object-contain w-full max-w-3xl transition-transform duration-700 ease-out hover:scale-[1.03] dark:drop-shadow-[15px_15px_30px_rgba(95,174,99,0.25)]"
              priority
            />
          </div>
        </div>

        {isLoggedIn && (
          <div className="w-full space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Featured Tournament */}
            <div className="bg-surface border border-border-subtle rounded-md p-6 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-[72px] h-[72px] bg-brand-soft rounded-md flex items-center justify-center p-2 border border-border-subtle relative overflow-hidden group cursor-default">
                  <div className="absolute inset-0 bg-brand/20 blur-xl rounded-md group-hover:bg-brand/30 transition-colors duration-700" />
                  <Image 
                    src="/2022_FIFA_World_Cup.svg.png" 
                    alt="World Cup 2022" 
                    width={40} 
                    height={40} 
                    className="relative z-10 transform group-hover:scale-110 transition-all duration-500"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-semibold tracking-widest text-brand uppercase mb-1">Featured Tournament</div>
                  <div className="text-xl font-semibold text-text-main">World Cup 2022</div>
                  <div className="text-[13px] text-text-sec font-normal mt-0.5">Qatar</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-10 md:gap-16 flex-1 lg:border-x border-border-subtle lg:px-12 py-2 w-full lg:w-auto">
                <div className="flex items-center gap-4">
                  <Target className="w-6 h-6 text-brand" strokeWidth={2} />
                  <div>
                    <div className="text-[22px] font-semibold text-text-main leading-tight">64</div>
                    <div className="text-[11px] font-normal text-text-sec mt-0.5">Matches</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Activity className="w-6 h-6 text-brand" strokeWidth={2} />
                  <div>
                    <div className="text-[22px] font-semibold text-text-main leading-tight">172</div>
                    <div className="text-[11px] font-normal text-text-sec mt-0.5">Goals</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Target className="w-6 h-6 text-brand" strokeWidth={2} />
                  <div>
                    <div className="text-[22px] font-semibold text-text-main leading-tight">4,421</div>
                    <div className="text-[11px] font-normal text-text-sec mt-0.5">Shots</div>
                  </div>
                </div>
              </div>
              
              <Link href="/heatmap?year=2022" className="flex justify-center items-center gap-2 bg-brand hover:bg-brand-hover text-white px-7 py-3.5 rounded-md font-semibold text-[14px] transition-colors shadow-sm border border-brand w-full lg:w-auto">
                Explore
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            </div>

            {/* Grid of Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Player Intelligence */}
              <Link href="/players" className="bg-surface border border-border-subtle rounded-md shadow-sm flex flex-col group cursor-pointer hover:shadow-[0_12px_30px_-4px_rgba(78,154,84,0.15)] transition-all duration-300 relative overflow-hidden">
                <div className="p-6 pb-6 flex-1 relative">
                  <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center mb-6">
                    <User className="w-5 h-5 text-brand" strokeWidth={2} />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-[17px] font-semibold text-text-main leading-tight mb-3">Player<br />Intelligence</h3>
                    <p className="font-cabin text-[13px] text-text-sec leading-relaxed font-normal max-w-[85%]">
                      Analyze individual performance with shot maps, xG, finishing trends and more.
                    </p>
                  </div>

                  {/* Watermark & Glow */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand/20 dark:bg-brand/20 blur-2xl rounded-full group-hover:scale-[1.5] transition-transform duration-700 ease-out" />
                  <User className="absolute -bottom-4 -right-4 w-32 h-32 text-brand opacity-[0.12] dark:opacity-[0.08] -rotate-12 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 ease-out" strokeWidth={1} />
                </div>
                <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between text-brand font-semibold text-[13px] bg-surface group-hover:bg-surface-hover transition-colors">
                  Explore Players
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Team Intelligence */}
              <Link href="/teams" className="bg-surface border border-border-subtle rounded-md shadow-sm flex flex-col group cursor-pointer hover:shadow-[0_12px_30px_-4px_rgba(78,154,84,0.15)] transition-all duration-300 relative overflow-hidden">
                <div className="p-6 pb-6 flex-1 relative">
                  <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center mb-6">
                    <Users className="w-5 h-5 text-brand" strokeWidth={2} />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-[17px] font-semibold text-text-main leading-tight mb-3">Team<br />Intelligence</h3>
                    <p className="font-cabin text-[13px] text-text-sec leading-relaxed font-normal max-w-[85%]">
                      Dive into team shot maps, tactical patterns, xG performance and strategies.
                    </p>
                  </div>

                  {/* Watermark & Glow */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand/20 dark:bg-brand/20 blur-2xl rounded-full group-hover:scale-[1.5] transition-transform duration-700 ease-out" />
                  <Users className="absolute -bottom-4 -right-4 w-32 h-32 text-brand opacity-[0.12] dark:opacity-[0.08] -rotate-12 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 ease-out" strokeWidth={1} />
                </div>
                <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between text-brand font-semibold text-[13px] bg-surface group-hover:bg-surface-hover transition-colors">
                  Explore Teams
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Global Heatmap */}
              <Link href="/heatmap" className="bg-surface border border-border-subtle rounded-md shadow-sm flex flex-col group cursor-pointer hover:shadow-[0_12px_30px_-4px_rgba(78,154,84,0.15)] transition-all duration-300 relative overflow-hidden">
                <div className="p-6 pb-6 flex-1 relative">
                  <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center mb-6">
                    <Globe className="w-5 h-5 text-brand" strokeWidth={2} />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-[17px] font-semibold text-text-main leading-tight mb-3">Global<br />Heatmap</h3>
                    <p className="font-cabin text-[13px] text-text-sec leading-relaxed font-normal max-w-[85%]">
                      Explore every shot from every match. Visualize the World Cup like never before.
                    </p>
                  </div>

                  {/* Watermark & Glow */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand/20 dark:bg-brand/20 blur-2xl rounded-full group-hover:scale-[1.5] transition-transform duration-700 ease-out" />
                  <Globe className="absolute -bottom-4 -right-4 w-32 h-32 text-brand opacity-[0.12] dark:opacity-[0.08] -rotate-12 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 ease-out" strokeWidth={1} />
                </div>
                <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between text-brand font-semibold text-[13px] bg-surface group-hover:bg-surface-hover transition-colors">
                  Explore Heatmap
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Render bottom stats block */}
        {renderStatsCard()}
      </div>
    </div>
  );
}
