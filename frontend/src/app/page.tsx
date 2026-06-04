"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Target, Users, Calendar, Trophy, Lock, Search, ArrowRight, Activity, Map, User, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isLoggedIn, login } = useAuth();

  const renderStatsCard = () => (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white border border-[#F2F4F7] rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] mb-4">
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
              <p className="text-lg text-text-sec max-w-md leading-relaxed font-normal">
                Explore player performance, team tactics and shot quality using historical World Cup data.
              </p>
            </div>

            {!isLoggedIn ? (
              <div className="bg-[#F8F9F7] dark:bg-surface-hover border border-border-subtle rounded-xl p-8 flex flex-col items-center text-center max-w-md">
                <div className="w-10 h-10 rounded-full border border-border-subtle bg-surface flex items-center justify-center mb-4">
                  <Lock className="w-4 h-4 text-text-muted" strokeWidth={2} />
                </div>
                <h3 className="text-[15px] font-semibold text-text-main mb-2">Intelligence Engine Locked</h3>
                <p className="text-[13px] text-text-sec leading-relaxed">
                  Log in or sign up to unlock the global search engine and<br />access the World Cup database.
                </p>
              </div>
            ) : (
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  placeholder="Search player, team or tournament..."
                  className="w-full pl-14 pr-14 py-3.5 bg-white border border-gray-100 rounded-[14px] text-[14px] font-normal text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5FAE63] focus:border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <div className="bg-[#F8F9FA] border border-gray-200 rounded-lg text-gray-600 text-[13px] font-normal px-2.5 py-0.5">
                    /
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Hero Image */}
          <div className="relative flex justify-center lg:justify-end cursor-default">
            <Image 
              src="/hero_image.png" 
              alt="3D Pitch Visualization" 
              width={800} 
              height={600} 
              className="object-contain w-full max-w-3xl transition-transform duration-700 ease-out hover:scale-[1.03]"
              priority
            />
          </div>
        </div>

        {isLoggedIn && (
          <div className="w-full space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Featured Tournament */}
            <div className="bg-white border border-[#F2F4F7] rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-[72px] h-[72px] bg-[#F5F7F5] dark:bg-surface-hover rounded-xl flex items-center justify-center p-2 border border-border-subtle">
                  <Image src="/trophy.png" alt="Trophy" width={44} height={44} className="object-contain" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold tracking-widest text-[#5FAE63] uppercase mb-1">Featured Tournament</div>
                  <div className="text-xl font-semibold text-text-main">World Cup 2022</div>
                  <div className="text-[13px] text-text-sec font-normal mt-0.5">Qatar</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-10 md:gap-16 flex-1 lg:border-x border-border-subtle lg:px-12 py-2 w-full lg:w-auto">
                <div className="flex items-center gap-4">
                  <Target className="w-6 h-6 text-[#5FAE63]" strokeWidth={2} />
                  <div>
                    <div className="text-[22px] font-semibold text-text-main leading-tight">64</div>
                    <div className="text-[11px] font-normal text-text-sec mt-0.5">Matches</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Activity className="w-6 h-6 text-[#5FAE63]" strokeWidth={2} />
                  <div>
                    <div className="text-[22px] font-semibold text-text-main leading-tight">172</div>
                    <div className="text-[11px] font-normal text-text-sec mt-0.5">Goals</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Target className="w-6 h-6 text-[#5FAE63]" strokeWidth={2} />
                  <div>
                    <div className="text-[22px] font-semibold text-text-main leading-tight">4,421</div>
                    <div className="text-[11px] font-normal text-text-sec mt-0.5">Shots</div>
                  </div>
                </div>
              </div>
              
              <button className="flex justify-center items-center gap-2 bg-[#5FAE63] hover:bg-[#4E9A54] text-white px-7 py-3.5 rounded-xl font-semibold text-[14px] transition-colors shadow-sm border border-[#4E9A54] w-full lg:w-auto">
                Explore
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Grid of Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Player Intelligence */}
              <Link href="/players" className="bg-white border border-[#F2F4F7] rounded-[20px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] flex flex-col group cursor-pointer hover:shadow-[0_12px_30px_-4px_rgba(78,154,84,0.15)] transition-all duration-300 relative overflow-hidden">
                <div className="p-6 pb-6 flex-1 relative">
                  <div className="w-10 h-10 rounded-full bg-[#F0F5F1] flex items-center justify-center mb-6">
                    <User className="w-5 h-5 text-[#4E9A54]" strokeWidth={2} />
                  </div>
                  
                  <div className="relative z-10 pr-[110px]">
                    <h3 className="text-[17px] font-semibold text-gray-900 leading-tight mb-3">Player<br />Intelligence</h3>
                    <p className="text-[12px] text-gray-500 leading-relaxed font-normal">
                      Analyze individual performance with shot maps, xG, finishing trends and more.
                    </p>
                  </div>

                  <div className="absolute top-12 right-6 w-[120px] h-[120px]">
                    <Image src="/player.png" alt="Player Maps" fill className="object-contain transform group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-[#F2F4F7] flex items-center justify-between text-[#4E9A54] font-semibold text-[13px] bg-white">
                  Explore Players
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Team Intelligence */}
              <Link href="/teams" className="bg-white border border-[#F2F4F7] rounded-[20px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] flex flex-col group cursor-pointer hover:shadow-[0_12px_30px_-4px_rgba(78,154,84,0.15)] transition-all duration-300 relative overflow-hidden">
                <div className="p-6 pb-6 flex-1 relative">
                  <div className="w-10 h-10 rounded-full bg-[#F0F5F1] flex items-center justify-center mb-6">
                    <Users className="w-5 h-5 text-[#4E9A54]" strokeWidth={2} />
                  </div>
                  
                  <div className="relative z-10 pr-[110px]">
                    <h3 className="text-[17px] font-semibold text-gray-900 leading-tight mb-3">Team<br />Intelligence</h3>
                    <p className="text-[12px] text-gray-500 leading-relaxed font-normal">
                      Dive into team shot maps, tactical patterns, xG performance and strategies.
                    </p>
                  </div>

                  <div className="absolute top-12 right-6 w-[120px] h-[120px]">
                    <Image src="/team.png" alt="Team Maps" fill className="object-contain transform group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-[#F2F4F7] flex items-center justify-between text-[#4E9A54] font-semibold text-[13px] bg-white">
                  Explore Teams
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Global Heatmap */}
              <Link href="/heatmap" className="bg-white border border-[#F2F4F7] rounded-[20px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] flex flex-col group cursor-pointer hover:shadow-[0_12px_30px_-4px_rgba(78,154,84,0.15)] transition-all duration-300 relative overflow-hidden">
                <div className="p-6 pb-6 flex-1 relative">
                  <div className="w-10 h-10 rounded-full bg-[#F0F5F1] flex items-center justify-center mb-6">
                    <Globe className="w-5 h-5 text-[#4E9A54]" strokeWidth={2} />
                  </div>
                  
                  <div className="relative z-10 pr-[120px]">
                    <h3 className="text-[17px] font-semibold text-gray-900 leading-tight mb-3">Global<br />Heatmap</h3>
                    <p className="text-[12px] text-gray-500 leading-relaxed font-normal">
                      Explore every shot from every match. Visualize the World Cup like never before.
                    </p>
                  </div>

                  <div className="absolute top-14 right-4 w-[160px] h-[100px]">
                    <Image src="/world.png" alt="World Map" fill className="object-contain transform group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-[#F2F4F7] flex items-center justify-between text-[#4E9A54] font-semibold text-[13px] bg-white">
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