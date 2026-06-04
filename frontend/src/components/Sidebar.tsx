"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Home, User, Users, Map, BarChart2, Moon, Sun, ChevronDown, Lock, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isLoggedIn, login, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activePath, setActivePath] = useState(pathname);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Players', href: '/players', icon: User },
    { name: 'Teams', href: '/teams', icon: Users },
    { name: 'Heatmap', href: '/heatmap', icon: Map },
    { name: 'Compare', href: '/compare', icon: BarChart2 },
    { name: 'Gamehub', href: '/games', icon: Gamepad2 },
  ];

  return (
    <div className="w-64 bg-sidebar-bg text-text-sec flex flex-col h-screen fixed left-0 top-0 border-r border-border-subtle z-50 transition-colors duration-300">
      <div className="p-8 pb-4">
        <Link href="/">
          <h1 className="text-2xl font-bold text-text-main tracking-tight cursor-pointer">
            Goal<span className="text-brand">IQ</span>
          </h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => {
          const isActive = activePath === item.href || (item.href !== '/' && activePath?.startsWith(item.href));
          const isLocked = !isLoggedIn && item.name !== 'Home';
          
          if (isLocked) {
            return (
              <div
                key={item.name}
                className="flex items-center justify-between px-4 py-3 text-sm font-medium transition-all rounded-r-lg border-l-4 border-transparent text-text-muted opacity-60 cursor-not-allowed"
                title="Log in to unlock"
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3 text-text-muted" />
                  {item.name}
                </div>
                <Lock className="w-4 h-4 text-text-muted" />
              </div>
            );
          }
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setActivePath(item.href)}
              className={`relative flex items-center px-4 py-3 text-[14px] font-medium transition-colors rounded-xl ${
                isActive 
                  ? 'text-brand' 
                  : 'text-text-sec hover:bg-surface-hover hover:text-text-main'
              }`}
            >
              {isActive && (
                <>
                  <motion.div
                    layoutId="sidebarActiveBg"
                    className="absolute inset-0 bg-brand-soft rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                  <motion.div
                    layoutId="sidebarActiveBorder"
                    className="absolute left-0 top-2 bottom-2 w-[4px] bg-brand rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                </>
              )}
              <item.icon className={`relative z-10 w-5 h-5 mr-3 ${isActive ? 'text-brand' : 'text-text-muted group-hover:text-text-sec'}`} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border-subtle space-y-2">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-text-sec hover:bg-surface-hover transition-colors"
        >
          {mounted && theme === 'dark' ? (
            <Sun className="w-5 h-5 mr-3 text-text-muted" />
          ) : (
            <Moon className="w-5 h-5 mr-3 text-text-muted" />
          )}
          {mounted && theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        {isLoggedIn ? (
          <button onClick={logout} className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium text-text-main hover:bg-surface-hover transition-colors mt-2">
            <div className="flex items-center">
              <div className="w-7 h-7 rounded-full bg-brand-soft flex items-center justify-center text-xs font-bold text-brand mr-3">
                U
              </div>
              User
            </div>
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </button>
        ) : (
          <button onClick={login} className="flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm font-bold text-pitch-success bg-[#152e18] hover:bg-[#1a3a1e] transition-colors mt-2 border border-[#1e4423]">
            Log In to GoalIQ
          </button>
        )}
      </div>
    </div>
  );
}
