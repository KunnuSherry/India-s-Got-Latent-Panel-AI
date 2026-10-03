import { Person, Vibe } from './types';
import { VIBE_PROFILES } from './vibes';

// ─── Individual vibe score ───────────────────────────────────────
export function calculateVibeScore(person: Person, vibe: Vibe): number {
  const weights = VIBE_PROFILES[vibe];
  let score = 0;

  for (const [attr, weight] of Object.entries(weights)) {
    const value = (person as unknown as Record<string, number>)[attr];
    if (typeof value !== 'number') continue;

    // For the "dark" vibe, low seriousness is actually desirable
    if (vibe === 'dark' && attr === 'seriousness') {
      score += (100 - value) * weight;
    } else {
      score += value * weight;
    }
  }

  return score;
}

// ─── Rank the entire database for a vibe ─────────────────────────
export function rankPeopleForVibe(
  people: Person[],
  vibe: Vibe,
): { person: Person; score: number }[] {
  return people
    .map((person) => ({ person, score: calculateVibeScore(person, vibe) }))
    .sort((a, b) => b.score - a.score);
}

// ─── Build candidate pool with controlled randomness ─────────────
export function getCandidatePool(
  people: Person[],
  vibe: Vibe,
  poolSize = 60,
): Person[] {
  const ranked = rankPeopleForVibe(people, vibe);
  const expanded = ranked.slice(0, Math.floor(poolSize * 1.5));

  // Light shuffle to introduce variation across runs
  for (let i = expanded.length - 1; i > 0; i--) {
    if (Math.random() < 0.3) {
      const j = Math.floor(Math.random() * (i + 1));
      [expanded[i], expanded[j]] = [expanded[j], expanded[i]];
    }
  }

  return expanded.slice(0, poolSize).map((c) => c.person);
}
