'use client';

import React from 'react';
import { PanelMetrics } from '@/lib/types';
import {
  Sparkles,
  Flame,
  Smile,
  Zap,
  Layers,
  HeartHandshake,
  ShieldAlert,
} from 'lucide-react';

interface PanelMetricsDisplayProps {
  metrics: PanelMetrics;
  panelCount?: number;
}

export function PanelMetricsDisplay({ metrics }: PanelMetricsDisplayProps) {
  const items = [
    {
      label: 'CHEMISTRY',
      value: Math.round(metrics.chemistry),
      icon: HeartHandshake,
      color: 'from-[#d4ff00] to-lime-500',
      textColor: 'text-[#d4ff00]',
    },
    {
      label: 'COMEDY POWER',
      value: Math.round(metrics.comedy),
      icon: Smile,
      color: 'from-amber-400 to-orange-500',
      textColor: 'text-amber-400',
    },
    {
      label: 'CHAOS INDEX',
      value: Math.round(metrics.chaos),
      icon: Flame,
      color: 'from-[#ff007f] to-rose-600',
      textColor: 'text-[#ff007f]',
    },
    {
      label: 'VIRAL HOOK',
      value: Math.round(metrics.viral),
      icon: Zap,
      color: 'from-[#00f0ff] to-blue-500',
      textColor: 'text-[#00f0ff]',
    },
    {
      label: 'ROAST CONTRAST',
      value: Math.round(metrics.diversity),
      icon: Layers,
      color: 'from-purple-400 to-indigo-500',
      textColor: 'text-purple-400',
    },
  ];

  return (
    <div className="rounded-3xl border border-white/[0.1] bg-[#0c0e18]/90 p-5 sm:p-6 backdrop-blur-xl shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#d4ff00] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#d4ff00]" />
            LATENT ALGORITHMIC MATRIX
          </span>
          <h3 className="text-xl font-black text-white tracking-tight mt-0.5">
            Roast Chemistry & Studio Dynamics
          </h3>
        </div>

        {/* Big Latent Overall Score Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-black/80 px-4 py-2.5 rounded-2xl border-2 border-[#d4ff00]/40 shadow-lg shadow-[#d4ff00]/10">
          <div className="text-right">
            <span className="block text-[9px] uppercase font-black tracking-widest text-[#d4ff00]">
              LATENT RATING
            </span>
            <span className="text-2xl font-black text-white">
              {Math.round(metrics.overall)}
            </span>
            <span className="text-xs text-zinc-500 font-bold">/100</span>
          </div>

          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#d4ff00] text-black font-black text-sm">
            {metrics.overall >= 80 ? '🔥' : '⚡'}
          </div>
        </div>
      </div>

      {/* Metrics Progress Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mt-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex flex-col rounded-2xl bg-white/[0.02] border border-white/[0.06] p-3.5 transition-all hover:bg-white/[0.05] hover:border-white/[0.15]"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="flex items-center gap-1.5 text-zinc-400 font-bold text-[11px]">
                  <Icon className={`h-3.5 w-3.5 ${item.textColor}`} />
                  {item.label}
                </span>
                <span className="font-black text-white text-sm">{item.value}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                  style={{ width: `${Math.min(100, Math.max(0, item.value))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
