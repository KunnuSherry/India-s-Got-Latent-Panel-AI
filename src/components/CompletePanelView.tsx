'use client';

import React, { useState, useEffect } from 'react';
import { Person, Vibe, PanelSize, CandidatePanel } from '@/lib/types';
import { DEFAULT_SAMAY_PERSON } from '@/lib/samay';
import { VibeSelector } from './VibeSelector';
import { PersonCard } from './PersonCard';
import { PanelMetricsDisplay } from './PanelMetricsDisplay';
import { PersonPickerModal } from './PersonPickerModal';
import {
  Layers,
  Sparkles,
  Plus,
  RefreshCw,
  BookmarkPlus,
  Check,
  Crown,
  Lock,
} from 'lucide-react';

interface CompletePanelViewProps {
  onInspectPerson: (person: Person) => void;
  onSavePanel: (panel: {
    members: Person[];
    vibe: Vibe;
    metrics: any;
    reason: string;
    highlights: string[];
  }) => void;
}

export function CompletePanelView({
  onInspectPerson,
  onSavePanel,
}: CompletePanelViewProps) {
  // Samay Raina is ALWAYS member #1 by default
  const [lockedMembers, setLockedMembers] = useState<Person[]>([DEFAULT_SAMAY_PERSON]);
  const [selectedVibe, setSelectedVibe] = useState<Vibe>('chaotic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedPanel, setCompletedPanel] = useState<CandidatePanel | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleAddPerson = (person: Person) => {
    if (lockedMembers.length < 4) {
      setLockedMembers([...lockedMembers, person]);
      setCompletedPanel(null);
    }
  };

  const handleRemovePerson = (person: Person) => {
    // Cannot remove Samay
    if (person.name.toLowerCase().includes('samay raina') || person.person_id === samay.person_id) {
      return;
    }
    setLockedMembers(lockedMembers.filter((m) => m.person_id !== person.person_id));
    setCompletedPanel(null);
  };

  const handleCompletePanel = async () => {
    setIsGenerating(true);
    setIsSaved(false);

    try {
      const res = await fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          existingMemberIds: lockedMembers.map((m) => m.person_id),
          vibe: selectedVibe,
          targetSize: 5,
        }),
      });

      const data = await res.json();
      if (data.candidates && data.candidates.length > 0) {
        setCompletedPanel(data.candidates[0]);
      }
    } catch (err) {
      console.error('Failed to complete panel:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-white/[0.1] bg-gradient-to-r from-[#d4ff00]/10 via-[#0e101d] to-purple-950/40 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="latent-sticker rounded-md bg-[#d4ff00] px-2.5 py-0.5 text-xs font-black text-black">
              ⚡ ROAST CO-PILOT
            </span>
            <span className="text-xs text-[#d4ff00] font-bold">Fixed 5-Member Desk</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">
            Complete My Panel (5 Seats)
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Samay Raina anchors the host seat. Lock up to 3 of your favorite public figures, and our algorithmic chemistry engine recruits the remaining comedians to maximize episode chemistry.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCompletePanel}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#d4ff00] to-lime-400 text-xs font-black uppercase tracking-wider text-black shadow-xl shadow-[#d4ff00]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none self-start md:self-auto"
        >
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          <span>{isGenerating ? 'Synthesizing...' : 'Complete Lineup to 5'}</span>
        </button>
      </div>

      {/* Configuration Section: Vibe Selector & Host Info */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 rounded-3xl border border-white/[0.08] bg-[#0c0e17]/80 backdrop-blur-xl">
        <div className="lg:col-span-3">
          <VibeSelector
            selectedVibe={selectedVibe}
            onSelectVibe={(v) => {
              setSelectedVibe(v);
              setCompletedPanel(null);
            }}
          />
        </div>

        <div className="flex flex-col justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#d4ff00] mb-2">
              <Crown className="h-4 w-4" /> Permanent Host Anchor
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Samay Raina is locked in Seat #1 for every episode. Add guests to seats 2–4 and let AI fill the rest!
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-zinc-500 font-bold">Target Size:</span>
            <span className="font-black text-[#d4ff00]">5 Members</span>
          </div>
        </div>
      </div>

      {/* Active Lineup Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-white text-base">
              {completedPanel ? 'Complete 5-Member Lineup' : 'Active Panel Lineup (5 Seats)'}
            </h3>
            <p className="text-xs text-zinc-400">
              {completedPanel
                ? '5 members balanced across comedy, chaos, and roastability'
                : `${lockedMembers.length} of 5 seats assigned`}
            </p>
          </div>

          {completedPanel && (
            <button
              type="button"
              onClick={() => {
                onSavePanel({
                  members: completedPanel.members,
                  vibe: selectedVibe,
                  metrics: completedPanel.metrics,
                  reason: `Completed 5-member panel anchored by Samay Raina`,
                  highlights: ['Maximized pair-level chemistry', 'Balanced personality contrast'],
                });
                setIsSaved(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-zinc-200 transition-all"
            >
              {isSaved ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <BookmarkPlus className="h-3.5 w-3.5 text-[#d4ff00]" />}
              <span>{isSaved ? 'Saved to Vault' : 'Save Lineup'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Locked members */}
          {lockedMembers.map((person) => (
            <PersonCard
              key={person.person_id}
              person={person}
              isLocked={true}
              onRemove={handleRemovePerson}
              onInspect={onInspectPerson}
            />
          ))}

          {/* AI completed additions */}
          {completedPanel &&
            completedPanel.members
              .filter((m) => !lockedMembers.some((l) => l.person_id === m.person_id))
              .map((person) => (
                <div key={person.person_id} className="relative">
                  <div className="absolute -top-2 left-3 z-10 rounded-full bg-[#d4ff00] px-2 py-0.5 text-[9px] font-black uppercase text-black shadow-sm">
                    AI RECRUIT
                  </div>
                  <PersonCard
                    person={person}
                    isLocked={false}
                    onInspect={onInspectPerson}
                  />
                </div>
              ))}

          {/* Empty slot placeholder */}
          {!completedPanel && lockedMembers.length < 5 && (
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="flex flex-col items-center justify-center min-h-[220px] rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.04] hover:border-[#d4ff00]/50 p-6 text-center transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-zinc-400 group-hover:scale-110 group-hover:bg-[#d4ff00]/20 group-hover:text-[#d4ff00] transition-all mb-3">
                <Plus className="h-6 w-6" />
              </div>
              <span className="font-black text-sm text-zinc-300 group-hover:text-white transition-colors">
                Lock Guest Seat {lockedMembers.length + 1}
              </span>
              <span className="text-xs text-zinc-500 mt-1">
                Pick from 2,000 public figures
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics breakdown if completed */}
      {completedPanel && (
        <PanelMetricsDisplay metrics={completedPanel.metrics} panelCount={5} />
      )}

      {/* Person Picker */}
      <PersonPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleAddPerson}
        excludeIds={lockedMembers.map((m) => m.person_id)}
        title="Lock Guest into Panel"
        subtitle="Choose a public figure to accompany Samay Raina"
      />
    </div>
  );
}
