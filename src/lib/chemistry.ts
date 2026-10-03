import { Person, PanelMetrics } from './types';

// ─── Pair‑level chemistry ────────────────────────────────────────
export function pairChemistry(a: Person, b: Person): number {
  let score = 0;

  // Comedy compatibility — similar comedy levels gel together
  const comedyDiff = Math.abs(a.comedy_score - b.comedy_score);
  score += (1 - comedyDiff / 100) * 15;

  // Energy contrast — some contrast is interesting
  const energyDiff = Math.abs(a.energy_level - b.energy_level);
  score += Math.min(energyDiff, 40) / 40 * 15;

  // Chaos compatibility
  const chaosDiff = Math.abs(a.chaos_score - b.chaos_score);
  score += (1 - chaosDiff / 100) * 10;

  // Category diversity — different worlds colliding is fun
  if (a.category !== b.category) score += 15;

  // Roast compatibility — both need to be roastable
  score += ((a.roastability + b.roastability) / 200) * 10;

  // Internet-native contrast
  const netDiff = Math.abs(a.internet_native - b.internet_native);
  score += Math.min(netDiff, 50) / 50 * 10;

  // Celebrity balance — mix of celebrity tiers
  const celDiff = Math.abs(a.celebrity_factor - b.celebrity_factor);
  score += Math.min(celDiff, 40) / 40 * 10;

  // Improvisation synergy
  score += ((a.improvisation + b.improvisation) / 200) * 10;

  // Viral synergy
  score += ((a.viral_potential + b.viral_potential) / 200) * 5;

  return Math.min(score, 100);
}

// ─── Panel‑level chemistry (average of all pairs) ────────────────
export function panelChemistry(panel: Person[]): number {
  let total = 0;
  let pairs = 0;

  for (let i = 0; i < panel.length; i++) {
    for (let j = i + 1; j < panel.length; j++) {
      total += pairChemistry(panel[i], panel[j]);
      pairs++;
    }
  }

  return pairs > 0 ? total / pairs : 0;
}

// ─── Category diversity (0–100) ──────────────────────────────────
export function categoryDiversity(panel: Person[]): number {
  const categories = new Set(panel.map((p) => p.category));
  return (categories.size / panel.length) * 100;
}

// ─── Audience diversity (0–100) ──────────────────────────────────
export function audienceDiversity(panel: Person[]): number {
  const types = new Set(panel.map((p) => p.audience_type));
  return (types.size / panel.length) * 100;
}

// ─── Personality contrast (standard‑deviation based, 0–100) ──────
export function personalityContrast(panel: Person[]): number {
  if (panel.length < 2) return 0;

  const attrs = [
    'comedy_score',
    'chaos_score',
    'energy_level',
    'seriousness',
    'unpredictability',
  ] as const;

  let totalStd = 0;
  for (const attr of attrs) {
    const values = panel.map((p) => p[attr]);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
    totalStd += Math.sqrt(variance);
  }

  // Scale so ~25 stdev per dimension → 100
  return Math.min((totalStd / attrs.length) * 4, 100);
}

// ─── Aggregate panel metrics ─────────────────────────────────────
export function calculatePanelMetrics(panel: Person[]): PanelMetrics {
  const avg = (fn: (p: Person) => number) =>
    panel.reduce((s, p) => s + fn(p), 0) / panel.length;

  const chaos = avg((p) => p.chaos_score);
  const comedy = avg((p) => p.comedy_score);
  const viral = avg((p) => p.viral_potential);
  const chemistry = panelChemistry(panel);
  const diversity =
    (categoryDiversity(panel) +
      audienceDiversity(panel) +
      personalityContrast(panel)) /
    3;

  const overall =
    chaos * 0.15 +
    comedy * 0.2 +
    viral * 0.15 +
    chemistry * 0.3 +
    diversity * 0.2;

  return {
    chaos: Math.round(chaos),
    comedy: Math.round(comedy),
    viral: Math.round(viral),
    chemistry: Math.round(chemistry),
    diversity: Math.round(diversity),
    overall: Math.round(overall),
  };
}
