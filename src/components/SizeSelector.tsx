'use client';

import React from 'react';
import { Users, Lock, Crown } from 'lucide-react';

interface SizeSelectorProps {
  panelSize?: number;
  onChangeSize?: (size: 5) => void;
}

export function SizeSelector({}: SizeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
          Panel Format
        </label>
        <span className="flex items-center gap-1 text-[10px] font-bold text-[#d4ff00]">
          <Lock className="h-2.5 w-2.5" /> LOCKED TO 5
        </span>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-2xl border border-[#d4ff00]/40 bg-[#d4ff00]/10">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black border border-[#d4ff00]/40 text-[#d4ff00] font-black text-base">
          5
        </div>

        <div>
          <div className="text-xs font-black text-white flex items-center gap-1.5">
            <span>5-MEMBER ROAST DESK</span>
            <span className="rounded bg-[#ff007f] px-1 py-0.2 text-[8px] font-black text-white uppercase">
              OFFICIAL
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Samay Raina (Permanent Host) + 4 Curated Guests
          </p>
        </div>
      </div>
    </div>
  );
}
