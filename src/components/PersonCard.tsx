'use client';

import React, { useState } from 'react';
import { Person } from '@/lib/types';
import { SAMAY_RAINA_IMAGE } from '@/lib/samay';
import {
  Lock,
  Unlock,
  RefreshCw,
  Info,
  Flame,
  Zap,
  Smile,
  Crown,
  X,
  Radio,
  Sparkles,
} from 'lucide-react';

interface PersonCardProps {
  person: Person;
  isLocked?: boolean;
  onToggleLock?: (person: Person) => void;
  onReplace?: (person: Person) => void;
  onRemove?: (person: Person) => void;
  onInspect?: (person: Person) => void;
  showActions?: boolean;
}

export function PersonCard({
  person,
  isLocked = false,
  onToggleLock,
  onReplace,
  onRemove,
  onInspect,
  showActions = true,
}: PersonCardProps) {
  const [imgError, setImgError] = useState(false);

  const isSamay =
    person.name.toLowerCase().includes('samay raina') ||
    person.person_id === 'P0001';

  const avatarSrc = isSamay
    ? SAMAY_RAINA_IMAGE
    : imgError || !person.image_url
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        person.name
      )}&background=13141f&color=d4ff00&bold=true`
    : person.image_url;

  const getCategoryBadge = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'comedian':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'creator':
      case 'content creator':
        return 'bg-lime-500/15 text-[#d4ff00] border-lime-500/30';
      case 'actor':
      case 'bollywood':
        return 'bg-pink-500/15 text-pink-300 border-pink-500/30';
      case 'musician':
      case 'rapper':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'athlete':
      case 'cricketer':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30';
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 ${
        isSamay
          ? 'border-[#d4ff00]/60 bg-gradient-to-b from-[#d4ff00]/10 via-[#0e1017] to-[#121420] shadow-xl shadow-[#d4ff00]/10 scale-[1.01]'
          : isLocked
          ? 'border-purple-500/60 bg-purple-950/20 shadow-md shadow-purple-500/10'
          : 'border-white/[0.08] bg-[#0e101a]/85 hover:border-[#d4ff00]/40 hover:bg-[#131624]'
      }`}
    >
      {/* Top Banner Tag for Samay */}
      {isSamay && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4ff00] via-[#ff007f] to-[#00f0ff]" />
      )}

      {/* Top Header Card Info */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar / Portrait */}
            <div
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border bg-zinc-950 shadow-inner ${
                isSamay
                  ? 'border-[#d4ff00] ring-2 ring-[#d4ff00]/30'
                  : 'border-white/10 group-hover:border-[#d4ff00]/40'
              }`}
            >
              <img
                src={avatarSrc}
                alt={person.name}
                onError={() => {
                  if (!isSamay) setImgError(true);
                }}
                className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {isSamay && (
                <div className="absolute bottom-0 inset-x-0 bg-black/70 py-0.5 text-center text-[8px] font-black uppercase tracking-wider text-[#d4ff00]">
                  HOST
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-black text-sm sm:text-base text-white tracking-tight leading-snug line-clamp-1 group-hover:text-[#d4ff00] transition-colors">
                  {person.name}
                </h3>
                {isSamay && (
                  <span className="flex items-center gap-0.5 rounded-full bg-[#d4ff00] px-1.5 py-0.2 text-[9px] font-black uppercase text-black">
                    <Crown className="h-2.5 w-2.5 fill-current" /> MAALIK
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                {person.profession || person.category}
              </p>

              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getCategoryBadge(
                    person.category
                  )}`}
                >
                  {person.category}
                </span>

                {person.latent_fit > 90 && (
                  <span className="rounded-md border border-[#ff007f]/30 bg-[#ff007f]/10 px-1.5 py-0.5 text-[10px] text-[#ff007f] font-black uppercase">
                    ⚡ LATENT 10/10
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Top Icons */}
          {showActions && (
            <div className="flex items-center gap-1">
              {isSamay ? (
                <div
                  title="Samay Raina is the permanent Host"
                  className="rounded-xl bg-[#d4ff00]/10 p-1.5 text-[#d4ff00] border border-[#d4ff00]/20"
                >
                  <Lock className="h-3.5 w-3.5" />
                </div>
              ) : (
                <>
                  {onToggleLock && (
                    <button
                      type="button"
                      title={isLocked ? 'Locked into panel' : 'Lock guest'}
                      onClick={() => onToggleLock(person)}
                      className={`rounded-xl p-1.5 transition-colors ${
                        isLocked
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'text-zinc-500 hover:bg-white/[0.08] hover:text-zinc-300'
                      }`}
                    >
                      {isLocked ? (
                        <Lock className="h-3.5 w-3.5" />
                      ) : (
                        <Unlock className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}

                  {onRemove && (
                    <button
                      type="button"
                      title="Remove from lineup"
                      onClick={() => onRemove(person)}
                      className="rounded-xl p-1.5 text-zinc-500 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Known For quote */}
        {person.known_for && (
          <p className="mt-3 text-xs leading-relaxed text-zinc-300 line-clamp-2 italic bg-black/40 p-2.5 rounded-xl border border-white/[0.05]">
            "{person.known_for}"
          </p>
        )}

        {/* Latent Score Pills Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06]">
          <div className="flex flex-col rounded-xl bg-white/[0.02] p-1.5 text-center border border-white/[0.04]">
            <span className="text-[10px] text-zinc-400 flex items-center justify-center gap-1 font-bold">
              <Smile className="h-2.5 w-2.5 text-amber-400" /> COMEDY
            </span>
            <span className="text-xs font-black text-white mt-0.5">
              {person.comedy_score}
            </span>
          </div>

          <div className="flex flex-col rounded-xl bg-white/[0.02] p-1.5 text-center border border-white/[0.04]">
            <span className="text-[10px] text-zinc-400 flex items-center justify-center gap-1 font-bold">
              <Flame className="h-2.5 w-2.5 text-red-400" /> CHAOS
            </span>
            <span className="text-xs font-black text-white mt-0.5">
              {person.chaos_score}
            </span>
          </div>

          <div className="flex flex-col rounded-xl bg-white/[0.02] p-1.5 text-center border border-white/[0.04]">
            <span className="text-[10px] text-zinc-400 flex items-center justify-center gap-1 font-bold">
              <Zap className="h-2.5 w-2.5 text-[#d4ff00]" /> VIRAL
            </span>
            <span className="text-xs font-black text-[#d4ff00] mt-0.5">
              {person.viral_potential}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="flex items-center justify-between border-t border-white/[0.06] bg-black/40 px-3.5 py-2.5 text-xs">
        <button
          type="button"
          onClick={() => onInspect?.(person)}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-[#d4ff00] font-bold uppercase tracking-wider text-[11px] transition-colors"
        >
          <Info className="h-3.5 w-3.5 text-[#d4ff00]" />
          <span>Inspect Dossier</span>
        </button>

        {showActions && onReplace && !isSamay && !isLocked && (
          <button
            type="button"
            onClick={() => onReplace(person)}
            className="flex items-center gap-1 text-zinc-400 hover:text-white font-medium transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Swap</span>
          </button>
        )}
      </div>
    </div>
  );
}
