'use client';

import React from 'react';
import { Vibe, ALL_VIBES } from '@/lib/types';
import { VIBE_META } from '@/lib/vibes';
import { Flame } from 'lucide-react';

interface VibeSelectorProps {
  selectedVibe: Vibe;
  onSelectVibe: (vibe: Vibe) => void;
}

export function VibeSelector({ selectedVibe, onSelectVibe }: VibeSelectorProps) {
  const customDescriptions: Record<Vibe, string> = {
    chaotic: 'Raw unpredictability, explosive contrasts, zero script.',
    safe: 'High chemistry, mainstream charm, crowd-pleaser banter.',
    dark: 'Edgy roasts, cynical punchlines, dark comedy threshold.',
    viral: 'Peak meme potential, clip-worthy hooks, internet energy.',
    unhinged: 'Utterly lawless dynamic, absurd tangents, wild cards.',
    balanced: 'Harmonious comedic timing with seasoned public figures.',
    wildcard: 'Cricketers. Scientists. Rappers. No rules, all fields.',
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-[#d4ff00]" />
          EPISODE VIBE (SAMAY RAINA + 4 GUESTS)
        </label>
        <span className="text-xs text-[#d4ff00] font-black uppercase tracking-wider">
          {VIBE_META[selectedVibe]?.label} VIBE ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {ALL_VIBES.map((vibe) => {
          const meta = VIBE_META[vibe];
          const isSelected = selectedVibe === vibe;
          const isWildcard = vibe === 'wildcard';

          return (
            <button
              key={vibe}
              type="button"
              onClick={() => onSelectVibe(vibe)}
              className={`group relative flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                isSelected
                  ? isWildcard
                    ? 'border-fuchsia-400 bg-fuchsia-500/10 shadow-lg shadow-fuchsia-500/20 scale-[1.02]'
                    : 'border-[#d4ff00] bg-[#d4ff00]/10 shadow-lg shadow-[#d4ff00]/15 scale-[1.02]'
                  : isWildcard
                  ? 'border-fuchsia-500/30 bg-fuchsia-500/5 hover:bg-fuchsia-500/10 hover:border-fuchsia-400/50'
                  : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.2]'
              }`}
            >
              {/* Active indicator dot */}
              {isSelected && (
                <div
                  className={`absolute top-2.5 right-2.5 h-2 w-2 rounded-full shadow-sm ${
                    isWildcard
                      ? 'bg-fuchsia-400 shadow-fuchsia-400'
                      : 'bg-[#d4ff00] shadow-[#d4ff00]'
                  }`}
                />
              )}

              {/* "NEW" badge for wildcard */}
              {isWildcard && !isSelected && (
                <div className="absolute top-2 right-2 text-[8px] font-black uppercase tracking-widest bg-fuchsia-500 text-white px-1.5 py-0.5 rounded-full leading-none">
                  NEW
                </div>
              )}

              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.06] mb-2.5 text-lg group-hover:scale-110 transition-transform">
                {meta.emoji}
              </div>

              <div
                className={`font-black text-sm tracking-tight transition-colors ${
                  isSelected
                    ? isWildcard
                      ? 'text-fuchsia-300'
                      : 'text-[#d4ff00]'
                    : isWildcard
                    ? 'text-fuchsia-300 group-hover:text-fuchsia-200'
                    : 'text-white group-hover:text-[#d4ff00]'
                }`}
              >
                {meta.label}
              </div>

              <p className="text-[11px] leading-relaxed text-zinc-400 mt-1 line-clamp-2">
                {customDescriptions[vibe] || meta.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
