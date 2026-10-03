import { Vibe, VibeWeights } from './types';

// ─── Scoring weights per vibe ────────────────────────────────────
export const VIBE_PROFILES: Record<Vibe, VibeWeights> = {
  chaotic: {
    chaos_score: 0.25,
    unpredictability: 0.20,
    meme_factor: 0.15,
    comedy_score: 0.10,
    viral_potential: 0.10,
    improvisation: 0.05,
    energy_level: 0.10,
    controversy_level: 0.05,
  },
  safe: {
    comedy_score: 0.25,
    celebrity_factor: 0.20,
    latent_fit: 0.20,
    viral_potential: 0.15,
    energy_level: 0.10,
    improvisation: 0.10,
  },
  dark: {
    roastability: 0.25,
    comedy_score: 0.20,
    controversy_level: 0.15,
    unpredictability: 0.15,
    seriousness: 0.10,
    viral_potential: 0.10,
    chaos_score: 0.05,
  },
  viral: {
    viral_potential: 0.30,
    meme_factor: 0.20,
    celebrity_factor: 0.15,
    internet_native: 0.15,
    chaos_score: 0.10,
    energy_level: 0.10,
  },
  unhinged: {
    chaos_score: 0.30,
    unpredictability: 0.25,
    meme_factor: 0.15,
    controversy_level: 0.10,
    energy_level: 0.10,
    comedy_score: 0.10,
  },
  balanced: {
    comedy_score: 0.20,
    latent_fit: 0.15,
    viral_potential: 0.15,
    celebrity_factor: 0.15,
    chaos_score: 0.10,
    energy_level: 0.10,
    improvisation: 0.10,
    roastability: 0.05,
  },
  // Wildcard: deliberately flat/equal weights so NO single trait dominates.
  // The real magic is enforced at the generator level (1 person per category).
  wildcard: {
    celebrity_factor: 0.15,
    improvisation: 0.15,
    energy_level: 0.15,
    comedy_score: 0.10,
    viral_potential: 0.10,
    meme_factor: 0.10,
    chaos_score: 0.10,
    roastability: 0.10,
    seriousness: 0.05,
  },
};

// ─── Vibe metadata for UI ────────────────────────────────────────
export interface VibeMeta {
  label: string;
  description: string;
  emoji: string;
  gradient: string;
  color: string;
}

export const VIBE_META: Record<Vibe, VibeMeta> = {
  chaotic: {
    label: 'Chaotic',
    description: 'Maximum unpredictability, chaos and personality contrast',
    emoji: '🔥',
    gradient: 'from-orange-600 to-red-600',
    color: '#FF4500',
  },
  safe: {
    label: 'Safe',
    description: 'High chemistry, broad appeal and lower controversy',
    emoji: '✨',
    gradient: 'from-emerald-500 to-teal-600',
    color: '#10B981',
  },
  dark: {
    label: 'Dark',
    description: 'Dark-comedy, roast-heavy, edgy combinations',
    emoji: '🌑',
    gradient: 'from-purple-600 to-violet-800',
    color: '#7C3AED',
  },
  viral: {
    label: 'Viral',
    description: 'Maximum potential for memorable, shareable moments',
    emoji: '📈',
    gradient: 'from-cyan-400 to-blue-600',
    color: '#06B6D4',
  },
  unhinged: {
    label: 'Unhinged',
    description: 'Extreme unpredictability, absurdity and internet energy',
    emoji: '💀',
    gradient: 'from-red-500 to-pink-600',
    color: '#EF4444',
  },
  balanced: {
    label: 'Balanced',
    description: 'Comedy, chemistry, celebrity factor and virality combined',
    emoji: '⚖️',
    gradient: 'from-amber-400 to-yellow-600',
    color: '#F59E0B',
  },
  wildcard: {
    label: 'Wildcard',
    description: 'Totally unrelated fields — max cross-domain chaos',
    emoji: '🎲',
    gradient: 'from-fuchsia-500 to-indigo-600',
    color: '#D946EF',
  },
};
