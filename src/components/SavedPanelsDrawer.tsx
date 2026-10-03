'use client';

import React, { useState } from 'react';
import { SavedPanel, Person } from '@/lib/types';
import {
  BookmarkCheck,
  Trash2,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Users,
  Sparkles,
} from 'lucide-react';
import { VIBE_META } from '@/lib/vibes';

interface SavedPanelsProps {
  savedPanels: SavedPanel[];
  onDeletePanel: (id: string) => void;
  onLoadPanel: (panel: SavedPanel) => void;
  onInspectPerson: (person: Person) => void;
}

export function SavedPanelsDrawer({
  savedPanels,
  onDeletePanel,
  onLoadPanel,
  onInspectPerson,
}: SavedPanelsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLineup = (panel: SavedPanel) => {
    const text = `Panel Lab Lineup (${VIBE_META[panel.vibe]?.label} Vibe):\n` +
      panel.members.map((m, i) => `${i + 1}. ${m.name} (${m.profession})`).join('\n') +
      `\nChemistry: ${Math.round(panel.metrics.chemistry)}% | Overall: ${Math.round(panel.metrics.overall)}%`;

    navigator.clipboard.writeText(text);
    setCopiedId(panel.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border border-white/[0.08] bg-gradient-to-r from-purple-950/40 via-[#0e101d] to-pink-950/30 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <BookmarkCheck className="h-3 w-3" /> SAVED LINEUPS
            </span>
            <span className="text-xs text-zinc-400">Personal Panel Archive</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Saved Panels ({savedPanels.length})
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Review, copy, or export your favorite AI-generated public figure combinations stored locally in your browser session.
          </p>
        </div>
      </div>

      {/* List of saved panels */}
      {savedPanels.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-3xl border border-dashed border-white/10 bg-white/[0.01] text-center">
          <BookmarkCheck className="h-12 w-12 text-zinc-600 mb-3" />
          <h3 className="font-bold text-base text-zinc-300">No saved panels yet</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm">
            Generate or complete a panel and click "Save Lineup" to bookmark it into your collection!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {savedPanels.map((panel) => {
            const meta = VIBE_META[panel.vibe];

            return (
              <div
                key={panel.id}
                className="flex flex-col justify-between p-5 rounded-3xl border border-white/[0.08] bg-[#0c0e17]/90 backdrop-blur-xl hover:border-purple-500/40 transition-all group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{meta?.emoji}</span>
                      <div>
                        <span className="font-bold text-white text-sm">
                          {meta?.label} Panel
                        </span>
                        <span className="text-[10px] text-zinc-500 block">
                          {new Date(panel.savedAt).toLocaleDateString()} &bull; {panel.members.length} members
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-bold text-purple-400 border border-purple-500/20">
                        {Math.round(panel.metrics.overall)}% Fit
                      </span>

                      <button
                        type="button"
                        onClick={() => onDeletePanel(panel.id)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete panel"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Members list */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4">
                    {panel.members.map((person) => (
                      <div
                        key={person.person_id}
                        onClick={() => onInspectPerson(person)}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06] cursor-pointer transition-colors"
                      >
                        <img
                          src={person.image_url}
                          alt={person.name}
                          className="h-8 w-8 rounded-lg object-cover shrink-0"
                        />
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-zinc-200 line-clamp-1">
                            {person.name}
                          </div>
                          <div className="text-[10px] text-zinc-500 line-clamp-1">
                            {person.profession}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reason summary */}
                  {panel.reason && (
                    <p className="text-xs text-zinc-400 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04] line-clamp-2 italic mb-4">
                      "{panel.reason}"
                    </p>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => handleCopyLineup(panel)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-medium transition-colors"
                  >
                    {copiedId === panel.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Lineup</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onLoadPanel(panel)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold border border-purple-500/30 transition-all"
                  >
                    <span>Load in Studio</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
