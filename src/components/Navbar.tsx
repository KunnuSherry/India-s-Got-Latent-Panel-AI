'use client';

import React from 'react';
import {
  Sparkles,
  Users,
  Swords,
  Layers,
  BookmarkCheck,
  Flame,
  Radio,
  Zap,
} from 'lucide-react';
import { BuzzerButton } from './BuzzerButton';

interface NavbarProps {
  activeTab: 'generate' | 'complete' | 'battle' | 'roster' | 'saved';
  setActiveTab: (tab: 'generate' | 'complete' | 'battle' | 'roster' | 'saved') => void;
  savedCount: number;
}

export function Navbar({ activeTab, setActiveTab, savedCount }: NavbarProps) {
  const navItems = [
    { id: 'generate', label: 'Make a Panel', icon: Sparkles, badge: '5' },
    { id: 'complete', label: 'Complete Panel', icon: Layers, badge: null },
    { id: 'battle', label: 'Panel Battle', icon: Swords, badge: 'VS' },
    { id: 'roster', label: '2,000 Roster', icon: Users, badge: '2K' },
    { id: 'saved', label: 'Saved Panels', icon: BookmarkCheck, badge: savedCount > 0 ? savedCount.toString() : null },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07080c]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand with India's Got Latent styling */}
        <div
          onClick={() => setActiveTab('generate')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#d4ff00] via-[#ff007f] to-[#00f0ff] p-[2px] shadow-lg shadow-[#d4ff00]/20 group-hover:scale-105 transition-transform">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0c0e17]">
              <Flame className="h-5 w-5 text-[#d4ff00] group-hover:rotate-12 transition-transform" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-[#d4ff00] transition-colors">
                LATENT<span className="text-[#d4ff00]">LAB</span>
              </span>
              <span className="latent-sticker rounded-md bg-[#ff007f] px-1.5 py-0.2 text-[9px] font-black text-white">
                SAMAY EDIT
              </span>
            </div>
            <p className="text-[10px] font-bold text-zinc-400 hidden sm:block tracking-wide">
              5-MEMBER ROAST MATRIX &bull; 2,000 ICONS
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 max-w-[55%] sm:max-w-none no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-black bg-[#d4ff00] shadow-md shadow-[#d4ff00]/25'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 rounded-md px-1.5 py-0.2 text-[9px] font-black uppercase ${
                      isActive
                        ? 'bg-black text-[#d4ff00]'
                        : 'bg-white/[0.08] text-zinc-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Buzzer Button */}
        <div className="hidden md:flex items-center">
          <BuzzerButton />
        </div>
      </div>
    </header>
  );
}
