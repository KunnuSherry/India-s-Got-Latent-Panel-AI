// ─── Person type matching CSV schema ──────────────────────────────
export interface Person {
  person_id: string;
  name: string;
  category: string;
  profession: string;
  known_for: string;
  platforms: string;
  audience_type: string;
  audience_size_tier: string;
  comedy_score: number;
  chaos_score: number;
  roastability: number;
  controversy_level: number;
  energy_level: number;
  seriousness: number;
  meme_factor: number;
  viral_potential: number;
  unpredictability: number;
  improvisation: number;
  internet_native: number;
  celebrity_factor: number;
  latent_fit: number;
  image_url?: string;
}

// ─── Numeric score fields ────────────────────────────────────────
export const SCORE_FIELDS = [
  'comedy_score',
  'chaos_score',
  'roastability',
  'controversy_level',
  'energy_level',
  'seriousness',
  'meme_factor',
  'viral_potential',
  'unpredictability',
  'improvisation',
  'internet_native',
  'celebrity_factor',
  'latent_fit',
] as const;

export type ScoreField = (typeof SCORE_FIELDS)[number];

// ─── Vibes ───────────────────────────────────────────────────────
export type Vibe = 'chaotic' | 'safe' | 'dark' | 'viral' | 'unhinged' | 'balanced' | 'wildcard';
export const ALL_VIBES: Vibe[] = ['chaotic', 'safe', 'dark', 'viral', 'unhinged', 'balanced', 'wildcard'];

// ─── Panel sizes (fixed to 5 members) ───────────────────────────
export type PanelSize = 5;
export const PANEL_SIZE: PanelSize = 5;

// ─── Vibe weight map ─────────────────────────────────────────────
export type VibeWeights = Partial<Record<ScoreField, number>>;

// ─── Panel metrics ───────────────────────────────────────────────
export interface PanelMetrics {
  chaos: number;
  comedy: number;
  viral: number;
  chemistry: number;
  diversity: number;
  overall: number;
}

// ─── Candidate panel sent to Gemini ──────────────────────────────
export interface CandidatePanel {
  panelId: string;
  members: Person[];
  metrics: PanelMetrics;
}

// ─── Gemini response for panel selection ─────────────────────────
export interface GeminiPanelSelection {
  selectedPanelId: string;
  reason: string;
  highlights: string[];
}

// ─── Full generated panel returned to the client ─────────────────
export interface GeneratedPanel {
  members: Person[];
  vibe: Vibe;
  panelSize: PanelSize;
  metrics: PanelMetrics;
  reason: string;
  highlights: string[];
}

// ─── Battle result ───────────────────────────────────────────────
export interface BattleResult {
  winner: 'A' | 'B';
  reason: string;
  comparison: {
    chaos: string;
    chemistry: string;
    viralPotential: string;
  };
  metricsA: PanelMetrics;
  metricsB: PanelMetrics;
}

// ─── Saved panel (localStorage) ──────────────────────────────────
export interface SavedPanel {
  id: string;
  members: Person[];
  vibe: Vibe;
  metrics: PanelMetrics;
  reason: string;
  highlights: string[];
  savedAt: string;
}

// ─── Client-facing person (safe for browser) ─────────────────────
export interface PersonSummary {
  person_id: string;
  name: string;
  category: string;
  profession: string;
  known_for: string;
  platforms: string;
  image_url: string;
}
