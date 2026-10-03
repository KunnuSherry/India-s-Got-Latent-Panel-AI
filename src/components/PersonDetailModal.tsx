'use client';

import React from 'react';
import { Person, SCORE_FIELDS } from '@/lib/types';
import { SAMAY_RAINA_IMAGE } from '@/lib/samay';
import { X, Sparkles, Award, Globe, Users, Flame, Zap, Crown } from 'lucide-react';

interface PersonDetailModalProps {
  person: Person | null;
  onClose: () => void;
  onAddToPanel?: (person: Person) => void;
}

export function PersonDetailModal({ person, onClose, onAddToPanel }: PersonDetailModalProps) {
  if (!person) return null;

  const isSamay =
    person.name.toLowerCase().includes('samay raina') ||
    person.person_id === 'P0001';

  const avatarSrc = isSamay
    ? SAMAY_RAINA_IMAGE
    : person.image_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        person.name
      )}&background=13141f&color=d4ff00&bold=true`;

  const scoreLabels: Record<string, { label: string; color: string }> = {
    comedy_score: { label: 'Comedy Punch', color: 'from-amber-400 to-orange-500' },
    chaos_score: { label: 'Chaos Index', color: 'from-red-500 to-rose-600' },
    roastability: { label: 'Roast Resistance & Vulnerability', color: 'from-[#ff007f] to-purple-600' },
    controversy_level: { label: 'Controversy Hazard', color: 'from-rose-500 to-red-600' },
    energy_level: { label: 'Desk Energy', color: 'from-yellow-400 to-amber-500' },
    seriousness: { label: 'Seriousness (Lower = Funnier)', color: 'from-blue-400 to-indigo-500' },
    meme_factor: { label: 'Meme Generation', color: 'from-[#00f0ff] to-blue-500' },
    viral_potential: { label: 'Viral Clip Hook', color: 'from-[#d4ff00] to-lime-500' },
    unpredictability: { label: 'Unpredictability', color: 'from-orange-500 to-red-500' },
    improvisation: { label: 'Improvisation & Banter', color: 'from-emerald-400 to-teal-500' },
    internet_native: { label: 'Internet Native Culture', color: 'from-indigo-400 to-purple-500' },
    celebrity_factor: { label: 'Celebrity Gravitas', color: 'from-amber-300 to-yellow-500' },
    latent_fit: { label: 'India\'s Got Latent Fit', color: 'from-[#d4ff00] via-[#ff007f] to-cyan-400' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border-2 border-white/[0.12] bg-[#090b12] shadow-2xl overflow-hidden">
        {/* Header Hero */}
        <div className="relative p-6 bg-gradient-to-br from-[#d4ff00]/15 via-[#0e101a] to-black border-b border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <img
                src={avatarSrc}
                alt={person.name}
                className="h-24 w-24 rounded-2xl object-cover border-2 border-[#d4ff00] shadow-xl shadow-[#d4ff00]/20 shrink-0"
              />
              {isSamay && (
                <div className="absolute -bottom-2 -right-2 rounded-full bg-[#d4ff00] p-1 text-black shadow-md">
                  <Crown className="h-4 w-4 fill-current" />
                </div>
              )}
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="rounded-full bg-[#d4ff00]/15 px-3 py-0.5 text-xs font-black text-[#d4ff00] border border-[#d4ff00]/30 uppercase">
                  {person.category}
                </span>
                {isSamay && (
                  <span className="rounded-full bg-[#ff007f] px-2.5 py-0.5 text-xs font-black text-white uppercase">
                    PERMANENT HOST
                  </span>
                )}
                <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs font-mono text-zinc-400">
                  ID: {person.person_id}
                </span>
              </div>

              <h2 className="text-2xl font-black text-white mt-1.5 tracking-tight">
                {person.name}
              </h2>
              <p className="text-sm text-zinc-300 font-medium">
                {person.profession}
              </p>

              {person.known_for && (
                <p className="mt-2 text-xs text-zinc-200 bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.06] italic">
                  "{person.known_for}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 bg-white/[0.01] border-b border-white/[0.06] text-xs">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <Globe className="h-4 w-4 text-[#00f0ff]" />
            <div>
              <span className="block text-[9px] text-zinc-500 uppercase font-bold">Platforms</span>
              <span className="font-bold text-zinc-200 line-clamp-1">{person.platforms || 'YouTube / Insta'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <Users className="h-4 w-4 text-[#d4ff00]" />
            <div>
              <span className="block text-[9px] text-zinc-500 uppercase font-bold">Audience</span>
              <span className="font-bold text-zinc-200 line-clamp-1">{person.audience_type || 'Mainstream / Gen Z'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] col-span-2 sm:col-span-1">
            <Award className="h-4 w-4 text-amber-400" />
            <div>
              <span className="block text-[9px] text-zinc-500 uppercase font-bold">Audience Tier</span>
              <span className="font-bold text-zinc-200">{person.audience_size_tier || 'High'}</span>
            </div>
          </div>
        </div>

        {/* 13 Attributes Breakdown */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-[#d4ff00]" />
            13 Algorithmic Latent Attributes
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SCORE_FIELDS.map((field) => {
              const val = person[field] as number;
              const meta = scoreLabels[field] || { label: field, color: 'from-purple-500 to-pink-500' };

              return (
                <div key={field} className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-300 font-bold">{meta.label}</span>
                    <span className="font-black text-white">{val}/100</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${meta.color}`}
                      style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-black/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-colors"
          >
            Close Dossier
          </button>

          {onAddToPanel && !isSamay && (
            <button
              type="button"
              onClick={() => {
                onAddToPanel(person);
                onClose();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d4ff00] text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-[#d4ff00]/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Add Guest to Panel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
