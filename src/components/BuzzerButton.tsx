'use client';

import React, { useState } from 'react';
import { Bell, Flame, ShieldAlert, Volume2 } from 'lucide-react';

export function BuzzerButton() {
  const [isPressed, setIsPressed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const triggerBuzzerSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Funky low harsh sawtooth buzzer tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.42);
    } catch (e) {
      // AudioContext may be restricted before user gesture
    }
  };

  const handleBuzzerClick = () => {
    setIsPressed(true);
    setShowWarning(true);
    triggerBuzzerSound();

    setTimeout(() => setIsPressed(false), 300);
    setTimeout(() => setShowWarning(false), 2800);
  };

  return (
    <>
      {/* Floating or embedded buzzer button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleBuzzerClick}
          title="Hit the Latent Buzzer!"
          className={`relative group flex items-center gap-2.5 px-4 py-2 rounded-2xl border-2 transition-all select-none ${
            isPressed
              ? 'scale-95 border-red-600 bg-red-700 shadow-none ring-4 ring-red-500/50'
              : 'border-red-500/80 bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 active:scale-95'
          }`}
        >
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>

          <span className="font-black text-xs uppercase tracking-widest text-white drop-shadow">
            STRIKE BUZZER
          </span>

          <Bell className="h-4 w-4 fill-white text-white group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Buzzer strike notification banner */}
      {showWarning && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-red-500 bg-black/95 text-white shadow-2xl shadow-red-500/40 animate-buzzer-hit">
          <ShieldAlert className="h-6 w-6 text-red-500 animate-bounce" />
          <div>
            <div className="font-black text-sm uppercase tracking-wider text-red-400">
              🚨 BUZZER STRUCK!
            </div>
            <div className="text-xs text-zinc-300 font-medium">
              Samay Raina has detected 0 latent. Panel roasters unhinged!
            </div>
          </div>
        </div>
      )}
    </>
  );
}
