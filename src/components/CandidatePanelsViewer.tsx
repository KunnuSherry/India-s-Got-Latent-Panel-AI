'use client';

import React from 'react';
import { CandidatePanel } from '@/lib/types';
import { Sparkles, Trophy, Flame } from 'lucide-react';

interface CandidatePanelsViewerProps {
  candidates: CandidatePanel[];
  selectedId: string;
  onSelectCandidate: (candidate: CandidatePanel) => void;
}

export function CandidatePanelsViewer({
  candidates,
  selectedId,
  onSelectCandidate,
}: CandidatePanelsViewerProps) {
  if (!candidates || candidates.length <= 1) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#d4ff00]" />
          ALTERNATIVE 5-MEMBER ROAST DECKS ({candidates.length} EVALUATED BY AI)
        </label>
        <span className="text-xs text-zinc-500 font-medium">Click to test alternative dynamic</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {candidates.map((cand, idx) => {
          const isSelected = cand.panelId === selectedId;

          return (
            <button
              key={cand.panelId || idx}
              type="button"
              onClick={() => onSelectCandidate(cand)}
              className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all ${
                isSelected
                  ? 'border-[#d4ff00] bg-[#d4ff00]/10 shadow-lg shadow-[#d4ff00]/15 scale-[1.02]'
                  : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.2]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-black flex items-center gap-1 ${
                  isSelected ? 'text-[#d4ff00]' : 'text-white'
                }`}>
                  Desk {cand.panelId}
                  {isSelected && <Trophy className="h-3 w-3 text-[#d4ff00] ml-0.5" />}
                </span>
                <span className="text-[10px] font-black text-black bg-[#d4ff00] px-2 py-0.5 rounded-md">
                  {Math.round(cand.metrics.overall)}%
                </span>
              </div>

              {/* Members miniature avatars */}
              <div className="flex -space-x-2 overflow-hidden py-1 mb-2">
                {cand.members.map((m) => (
                  <img
                    key={m.person_id}
                    src={m.image_url}
                    alt={m.name}
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0c0e17] object-cover"
                  />
                ))}
              </div>

              <div className="text-[11px] text-zinc-400 line-clamp-1 font-medium">
                {cand.members.map((m) => m.name.split(' ')[0]).join(', ')}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
