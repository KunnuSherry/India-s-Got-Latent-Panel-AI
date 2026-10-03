'use client';

import React from 'react';
import { Bot, Sparkles, CheckCircle2, Flame, ShieldAlert } from 'lucide-react';

interface AIInsightBoxProps {
  reason: string;
  highlights: string[];
}

export function AIInsightBox({ reason, highlights }: AIInsightBoxProps) {
  if (!reason && (!highlights || highlights.length === 0)) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-[#d4ff00]/40 bg-gradient-to-br from-[#0c0e18] via-black to-[#131722] p-5 sm:p-6 backdrop-blur-xl shadow-2xl shadow-[#d4ff00]/5">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-[#d4ff00]/10 blur-3xl pointer-events-none" />

      <div className="flex items-start gap-4 relative z-10">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#d4ff00] text-black font-black shadow-lg shadow-[#d4ff00]/25">
          <Bot className="h-6 w-6 text-black" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-wider text-[#d4ff00]">
              GEMINI AI JUDGE & ROAST VERDICT
            </span>
            <span className="latent-sticker inline-flex items-center gap-1 rounded bg-[#ff007f] px-2 py-0.5 text-[9px] font-black text-white">
              <Sparkles className="h-3 w-3" /> 10/10 SELECTION
            </span>
          </div>

          <p className="mt-2 text-sm sm:text-base font-semibold leading-relaxed text-zinc-100">
            {reason}
          </p>

          {highlights && highlights.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-white/[0.08]">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 font-medium">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#d4ff00] mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
