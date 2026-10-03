'use client';

import React, { useState } from 'react';
import { Person, Vibe, PanelMetrics, BattleResult, ALL_VIBES } from '@/lib/types';
import { VIBE_META } from '@/lib/vibes';
import { DEFAULT_SAMAY_PERSON } from '@/lib/samay';
import {
  Swords,
  Trophy,
  Flame,
  Zap,
  Sparkles,
  RefreshCw,
  Plus,
  X,
  Bot,
  Crown,
  Lock,
} from 'lucide-react';
import { PersonPickerModal } from './PersonPickerModal';

interface BattleViewProps {
  onInspectPerson: (person: Person) => void;
}

export function BattleView({ onInspectPerson }: BattleViewProps) {
  const [battleVibe, setBattleVibe] = useState<Vibe>('chaotic');
  const [panelA, setPanelA] = useState<Person[]>([]);
  const [panelB, setPanelB] = useState<Person[]>([]);
  const [isJudging, setIsJudging] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

  // Picker modal state
  const [pickerTarget, setPickerTarget] = useState<'A' | 'B' | null>(null);

  // Auto-draft 5-member teams
  const handleAutoDraft = async () => {
    setIsJudging(true);
    setBattleResult(null);
    try {
      // Team A includes Samay by default
      const resA = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibe: battleVibe, panelSize: 5 }),
      });
      const dataA = await resA.json();
      const teamA: Person[] = dataA.panel?.members || [];
      setPanelA(teamA);

      // Team B: 5 rival members excluding team A names
      const excludeNames = teamA.map((m) => m.name);
      const resB = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibe: battleVibe, panelSize: 5, excludeNames }),
      });
      const dataB = await resB.json();
      const teamB: Person[] = dataB.panel?.members || [];
      setPanelB(teamB);
    } catch (err) {
      console.error('Failed to draft teams:', err);
    } finally {
      setIsJudging(false);
    }
  };

  // Launch Battle
  const handleJudgeBattle = async () => {
    if (panelA.length !== 5 || panelB.length !== 5) return;
    setIsJudging(true);
    setBattleResult(null);
    try {
      const res = await fetch('/api/battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vibe: battleVibe,
          panelAIds: panelA.map((p) => p.person_id),
          panelBIds: panelB.map((p) => p.person_id),
        }),
      });
      const data = await res.json();
      if (data.result) {
        setBattleResult(data.result);
      }
    } catch (err) {
      console.error('Failed to judge battle:', err);
    } finally {
      setIsJudging(false);
    }
  };

  const handleAddMember = (person: Person) => {
    if (pickerTarget === 'A') {
      if (panelA.length < 5 && !panelA.some((p) => p.person_id === person.person_id)) {
        setPanelA([...panelA, person]);
      }
    } else if (pickerTarget === 'B') {
      if (panelB.length < 5 && !panelB.some((p) => p.person_id === person.person_id)) {
        setPanelB([...panelB, person]);
      }
    }
  };

  const handleRemoveMember = (team: 'A' | 'B', id: string) => {
    if (team === 'A') {
      // Do not allow removing Samay from team A
      const target = panelA.find((p) => p.person_id === id);
      if (target?.name.toLowerCase().includes('samay raina') || target?.person_id === 'P0001') {
        return;
      }
      setPanelA(panelA.filter((p) => p.person_id !== id));
    } else {
      setPanelB(panelB.filter((p) => p.person_id !== id));
    }
    setBattleResult(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-white/[0.1] bg-gradient-to-r from-red-950/40 via-[#0e101d] to-[#17111f] backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="latent-sticker rounded-md bg-[#ff007f] px-2.5 py-0.5 text-xs font-black text-white">
              ⚔️ 5 VS 5 ROAST ARENA
            </span>
            <span className="text-xs text-[#d4ff00] font-bold">Judged by Gemini AI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">
            Panel Battle & AI Referee
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Clash two 5-member roast desks. Samay Raina leads Panel A against a challenger squad. Gemini judges the round-by-round comedic damage and declares a winner.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleAutoDraft}
            disabled={isJudging}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] text-xs font-black text-zinc-200 uppercase tracking-wider transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isJudging ? 'animate-spin' : ''}`} />
            Auto-Draft 5v5
          </button>

          <button
            type="button"
            onClick={handleJudgeBattle}
            disabled={panelA.length !== 5 || panelB.length !== 5 || isJudging}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-[#d4ff00] text-xs font-black uppercase tracking-wider text-black shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <Swords className="h-4 w-4" />
            {isJudging ? 'Evaluating Duel...' : 'FIGHT 5v5 BATTLE'}
          </button>
        </div>
      </div>

      {/* Battle Vibe Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-black uppercase tracking-wider text-zinc-400 mr-2 shrink-0">
          Arena Criterion:
        </span>
        {ALL_VIBES.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => {
              setBattleVibe(v);
              setBattleResult(null);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-black uppercase transition-all whitespace-nowrap ${
              battleVibe === v
                ? 'border-[#d4ff00] bg-[#d4ff00] text-black shadow-md shadow-[#d4ff00]/25'
                : 'border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white'
            }`}
          >
            <span>{VIBE_META[v].emoji}</span>
            <span>{VIBE_META[v].label}</span>
          </button>
        ))}
      </div>

      {/* Battle Result Announcement */}
      {battleResult && (
        <div className="p-6 sm:p-7 rounded-3xl border-2 border-[#d4ff00] bg-gradient-to-br from-[#0c0e18] via-black to-[#1a1224] backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/[0.1]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4ff00] text-black font-black text-2xl shadow-lg shadow-[#d4ff00]/30">
                🏆
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#d4ff00]">
                  OFFICIAL VERDICT
                </span>
                <h3 className="text-2xl font-black text-white">
                  {battleResult.winner === 'A' ? 'PANEL A (SAMAY SQUAD) WINS!' : 'PANEL B WINS!'}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/[0.05] px-4 py-2 rounded-2xl border border-white/[0.1]">
              <Bot className="h-4 w-4 text-[#d4ff00]" />
              <span className="text-xs font-bold text-zinc-300">
                Judged by Gemini AI Engine
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm sm:text-base font-semibold leading-relaxed text-zinc-200">
            {battleResult.reason}
          </p>

          {/* Breakdown Clash Rounds */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/[0.08]">
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[10px] uppercase font-black text-red-400 flex items-center gap-1 mb-1">
                <Flame className="h-3.5 w-3.5" /> CHAOS CLASH
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {battleResult.comparison.chaos}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[10px] uppercase font-black text-[#d4ff00] flex items-center gap-1 mb-1">
                <Sparkles className="h-3.5 w-3.5" /> CHEMISTRY CLASH
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {battleResult.comparison.chemistry}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[10px] uppercase font-black text-[#00f0ff] flex items-center gap-1 mb-1">
                <Zap className="h-3.5 w-3.5" /> VIRAL DAMAGE
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {battleResult.comparison.viralPotential}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Arena Grid: Panel A vs Panel B */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* VS Badge in Middle */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-14 w-14 items-center justify-center rounded-2xl bg-black border-2 border-[#d4ff00] text-[#d4ff00] font-black text-base shadow-2xl shadow-[#d4ff00]/40">
          VS
        </div>

        {/* Panel A Box (Samay Squad) */}
        <div
          className={`flex flex-col justify-between rounded-3xl border p-5 sm:p-6 backdrop-blur-xl transition-all ${
            battleResult?.winner === 'A'
              ? 'border-[#d4ff00] bg-gradient-to-b from-[#d4ff00]/10 via-[#0e1017] to-black shadow-xl shadow-[#d4ff00]/10'
              : 'border-white/[0.08] bg-[#0c0e18]/90'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#d4ff00] text-black font-black text-sm">
                  A
                </span>
                <div>
                  <h3 className="font-black text-white text-base">PANEL A (SAMAY SQUAD)</h3>
                  <p className="text-[11px] text-zinc-400">{panelA.length}/5 Members ready</p>
                </div>
              </div>

              {battleResult?.winner === 'A' && (
                <span className="flex items-center gap-1 rounded-full bg-[#d4ff00] px-3 py-1 text-xs font-black text-black">
                  <Crown className="h-3.5 w-3.5" /> WINNER
                </span>
              )}
            </div>

            {/* Members in Panel A */}
            <div className="mt-4 space-y-2.5">
              {panelA.map((p) => {
                const isSamay = p.name.toLowerCase().includes('samay raina') || p.person_id === 'P0001';
                return (
                  <div
                    key={p.person_id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isSamay
                        ? 'border-[#d4ff00]/40 bg-[#d4ff00]/5'
                        : 'border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div
                      onClick={() => onInspectPerson(p)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-10 w-10 rounded-xl object-cover border border-white/10"
                      />
                      <div>
                        <div className="font-bold text-sm text-white hover:text-[#d4ff00] transition-colors flex items-center gap-1.5">
                          <span>{p.name}</span>
                          {isSamay && (
                            <span className="text-[9px] font-black uppercase text-[#d4ff00] bg-black px-1.5 py-0.2 rounded border border-[#d4ff00]/40">
                              HOST
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-400">{p.profession}</div>
                      </div>
                    </div>

                    {!isSamay && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember('A', p.person_id)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}

              {panelA.length < 5 && (
                <button
                  type="button"
                  onClick={() => setPickerTarget('A')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.01] hover:bg-white/[0.03] text-xs font-bold text-zinc-400 hover:text-white transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Add Guest to Panel A ({panelA.length}/5)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Panel B Box (Rival Desk) */}
        <div
          className={`flex flex-col justify-between rounded-3xl border p-5 sm:p-6 backdrop-blur-xl transition-all ${
            battleResult?.winner === 'B'
              ? 'border-red-500 bg-gradient-to-b from-red-950/20 via-[#0e1017] to-black shadow-xl shadow-red-500/10'
              : 'border-white/[0.08] bg-[#0c0e18]/90'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600 text-white font-black text-sm">
                  B
                </span>
                <div>
                  <h3 className="font-black text-white text-base">PANEL B (CHALLENGER SQUAD)</h3>
                  <p className="text-[11px] text-zinc-400">{panelB.length}/5 Members ready</p>
                </div>
              </div>

              {battleResult?.winner === 'B' && (
                <span className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">
                  <Crown className="h-3.5 w-3.5" /> WINNER
                </span>
              )}
            </div>

            {/* Members in Panel B */}
            <div className="mt-4 space-y-2.5">
              {panelB.map((p) => (
                <div
                  key={p.person_id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all"
                >
                  <div
                    onClick={() => onInspectPerson(p)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="h-10 w-10 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <div className="font-bold text-sm text-white hover:text-red-400 transition-colors">
                        {p.name}
                      </div>
                      <div className="text-xs text-zinc-400">{p.profession}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveMember('B', p.person_id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {panelB.length < 5 && (
                <button
                  type="button"
                  onClick={() => setPickerTarget('B')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.01] hover:bg-white/[0.03] text-xs font-bold text-zinc-400 hover:text-white transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Add Guest to Panel B ({panelB.length}/5)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Person Picker Modal */}
      <PersonPickerModal
        isOpen={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        onSelect={handleAddMember}
        excludeIds={[...panelA, ...panelB].map((p) => p.person_id)}
        title={pickerTarget === 'A' ? 'Draft to Panel A' : 'Draft to Panel B'}
      />
    </div>
  );
}
