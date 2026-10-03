'use client';

import React, { useState, useEffect } from 'react';
import {
  Person,
  Vibe,
  GeneratedPanel,
  SavedPanel,
} from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { VibeSelector } from '@/components/VibeSelector';
import { PersonCard } from '@/components/PersonCard';
import { PanelMetricsDisplay } from '@/components/PanelMetricsDisplay';
import { AIInsightBox } from '@/components/AIInsightBox';
import { PersonPickerModal } from '@/components/PersonPickerModal';
import { PersonDetailModal } from '@/components/PersonDetailModal';
import { CompletePanelView } from '@/components/CompletePanelView';
import { BattleView } from '@/components/BattleView';
import { RosterExplorer } from '@/components/RosterExplorer';
import { SavedPanelsDrawer } from '@/components/SavedPanelsDrawer';
import {
  Sparkles,
  RefreshCw,
  BookmarkPlus,
  Check,
  Crown,
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    'generate' | 'complete' | 'battle' | 'roster' | 'saved'
  >('generate');

  // Generator states (Fixed to 5 members with Samay Raina)
  const [selectedVibe, setSelectedVibe] = useState<Vibe>('chaotic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPanel, setCurrentPanel] = useState<GeneratedPanel | null>(null);
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set());

  // Modal states
  const [inspectingPerson, setInspectingPerson] = useState<Person | null>(null);
  const [replacingPerson, setReplacingPerson] = useState<Person | null>(null);

  // Saved panels
  const [savedPanels, setSavedPanels] = useState<SavedPanel[]>([]);
  const [isSavedCurrent, setIsSavedCurrent] = useState(false);

  // Load saved panels from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('panel_lab_saved');
      if (stored) {
        setSavedPanels(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved panels:', e);
    }
  }, []);

  // Save panels to localStorage
  const savePanel = (panel: {
    members: Person[];
    vibe: Vibe;
    metrics: any;
    reason: string;
    highlights: string[];
  }) => {
    const newEntry: SavedPanel = {
      id: `panel_${Date.now()}`,
      members: panel.members,
      vibe: panel.vibe,
      metrics: panel.metrics,
      reason: panel.reason,
      highlights: panel.highlights,
      savedAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...savedPanels];
    setSavedPanels(updated);
    try {
      localStorage.setItem('panel_lab_saved', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  };

  const deleteSavedPanel = (id: string) => {
    const updated = savedPanels.filter((p) => p.id !== id);
    setSavedPanels(updated);
    try {
      localStorage.setItem('panel_lab_saved', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update localStorage:', e);
    }
  };

  // Generate Panel action (5 members always)
  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsSavedCurrent(false);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibe: selectedVibe, panelSize: 5 }),
      });
      const data = await res.json();
      if (data.panel) {
        setCurrentPanel(data.panel);
        setLockedIds(new Set());
      }
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Initial auto-generate on first load
  useEffect(() => {
    handleGenerate();
  }, []);

  // Toggle lock on person
  const handleToggleLock = (person: Person) => {
    if (person.name.toLowerCase().includes('samay raina') || person.person_id === 'P0001') {
      return; // Samay is permanently locked
    }
    setLockedIds((prev) => {
      const next = new Set(prev);
      if (next.has(person.person_id)) {
        next.delete(person.person_id);
      } else {
        next.add(person.person_id);
      }
      return next;
    });
  };

  // Replace a person in the current panel (guests only)
  const handleSelectReplacement = (newPerson: Person) => {
    if (!replacingPerson || !currentPanel) return;
    const updatedMembers = currentPanel.members.map((m) =>
      m.person_id === replacingPerson.person_id ? newPerson : m
    );
    setCurrentPanel({
      ...currentPanel,
      members: updatedMembers,
      reason: `Lineup customized: ${newPerson.name} joined Samay Raina's desk.`,
    });
    setReplacingPerson(null);
  };

  // Load a saved panel into the active generator
  const handleLoadSavedPanel = (panel: SavedPanel) => {
    setSelectedVibe(panel.vibe);
    setCurrentPanel({
      members: panel.members,
      vibe: panel.vibe,
      panelSize: 5,
      metrics: panel.metrics,
      reason: panel.reason,
      highlights: panel.highlights,
    });
    setActiveTab('generate');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07080c] text-zinc-100 selection:bg-[#d4ff00] selection:text-black">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedPanels.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: MAKE A PANEL (CLEAN & UNCLUTTERED) */}
        {activeTab === 'generate' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Clean Action Control Bar */}
            <div className="p-5 sm:p-6 rounded-3xl border border-white/[0.08] bg-[#0c0e17]/90 backdrop-blur-xl space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="latent-sticker rounded-md bg-[#d4ff00] px-2 py-0.5 text-[10px] font-black text-black">
                      INDIA'S GOT LATENT
                    </span>
                    <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1">
                      <Crown className="h-3 w-3 text-[#d4ff00]" /> Permanent Host: Samay Raina + 4 Guests
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                    Make a Panel
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  {currentPanel && (
                    <button
                      type="button"
                      onClick={() => {
                        savePanel({
                          members: currentPanel.members,
                          vibe: selectedVibe,
                          metrics: currentPanel.metrics,
                          reason: currentPanel.reason,
                          highlights: currentPanel.highlights,
                        });
                        setIsSavedCurrent(true);
                      }}
                      className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold text-zinc-200 transition-all"
                    >
                      {isSavedCurrent ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-300">Saved</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="h-4 w-4 text-[#d4ff00]" />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#d4ff00] via-lime-400 to-[#00f0ff] text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-xl shadow-[#d4ff00]/25 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>{isGenerating ? 'Synthesizing...' : 'Generate Panel'}</span>
                  </button>
                </div>
              </div>

              {/* Vibe Selection */}
              <VibeSelector
                selectedVibe={selectedVibe}
                onSelectVibe={(v) => setSelectedVibe(v)}
              />
            </div>

            {/* 5 Member Cards Grid */}
            {currentPanel && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {currentPanel.members.map((person) => (
                    <PersonCard
                      key={person.person_id}
                      person={person}
                      isLocked={lockedIds.has(person.person_id)}
                      onToggleLock={handleToggleLock}
                      onReplace={(p) => setReplacingPerson(p)}
                      onInspect={(p) => setInspectingPerson(p)}
                    />
                  ))}
                </div>

                {/* Algorithmic Metrics Bar */}
                <PanelMetricsDisplay metrics={currentPanel.metrics} panelCount={5} />

                {/* Gemini AI Verdict and Highlights */}
                <AIInsightBox
                  reason={currentPanel.reason}
                  highlights={currentPanel.highlights}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMPLETE MY PANEL */}
        {activeTab === 'complete' && (
          <CompletePanelView
            onInspectPerson={(p) => setInspectingPerson(p)}
            onSavePanel={savePanel}
          />
        )}

        {/* TAB 3: PANEL BATTLE */}
        {activeTab === 'battle' && (
          <BattleView onInspectPerson={(p) => setInspectingPerson(p)} />
        )}

        {/* TAB 4: 2,000 ROSTER EXPLORER */}
        {activeTab === 'roster' && (
          <RosterExplorer onInspectPerson={(p) => setInspectingPerson(p)} />
        )}

        {/* TAB 5: SAVED PANELS VAULT */}
        {activeTab === 'saved' && (
          <SavedPanelsDrawer
            savedPanels={savedPanels}
            onDeletePanel={deleteSavedPanel}
            onLoadPanel={handleLoadSavedPanel}
            onInspectPerson={(p) => setInspectingPerson(p)}
          />
        )}
      </main>

      {/* Person Detail Dossier Modal */}
      <PersonDetailModal
        person={inspectingPerson}
        onClose={() => setInspectingPerson(null)}
      />

      {/* Person Replacement Picker Modal */}
      <PersonPickerModal
        isOpen={replacingPerson !== null}
        onClose={() => setReplacingPerson(null)}
        onSelect={handleSelectReplacement}
        excludeIds={currentPanel?.members.map((m) => m.person_id) || []}
        title={`Swap out ${replacingPerson?.name}`}
        subtitle="Select another public figure to take this guest seat"
      />

      {/* Clean Footer */}
      <footer className="border-t border-white/[0.08] bg-[#050608] py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#d4ff00]">PANEL LAB</span>
            <span>&bull;</span>
            <span>India's Got Latent Format &bull; Permanent Host: Samay Raina</span>
          </div>
          <p className="text-[11px] text-zinc-600 font-mono">
            2,000 Public Figures Indexed &bull; Gemini AI &bull; Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
