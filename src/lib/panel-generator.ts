import { Person, Vibe, PanelSize, CandidatePanel } from './types';
import { getAllPeople, getSamayRaina } from './people';
import { getCandidatePool, calculateVibeScore } from './scoring';
import {
  panelChemistry,
  calculatePanelMetrics,
  categoryDiversity,
  personalityContrast,
  pairChemistry,
} from './chemistry';

// ─── Wildcard category sampler ────────────────────────────────────

/**
 * Groups all people (excluding Samay + excluded names) by their `category` field.
 * Returns a Map<category, Person[]>.
 */
function groupByCategory(
  people: Person[],
  excludeIds: Set<string>,
): Map<string, Person[]> {
  const map = new Map<string, Person[]>();
  for (const p of people) {
    if (excludeIds.has(p.person_id)) continue;
    const cat = (p.category || 'Other').trim();
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(p);
  }
  return map;
}

/**
 * Fisher-Yates shuffle — returns a new shuffled copy.
 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Helpers ─────────────────────────────────────────────────────

/** Build one random panel from a candidate pool, favouring category diversity. */
function samplePanel(candidates: Person[], size: number): Person[] {
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  const panel: Person[] = [];
  const usedCats = new Set<string>();

  // First pass: prefer unseen categories
  for (const p of shuffled) {
    if (panel.length >= size) break;
    if (!usedCats.has(p.category)) {
      panel.push(p);
      usedCats.add(p.category);
    }
  }
  // Fill remaining slots
  for (const p of shuffled) {
    if (panel.length >= size) break;
    if (!panel.includes(p)) panel.push(p);
  }
  return panel.slice(0, size);
}

/** Combined panel score for a given vibe. */
function scorePanelForVibe(panel: Person[], vibe: Vibe): number {
  const avgVibe =
    panel.reduce((s, p) => s + calculateVibeScore(p, vibe), 0) / panel.length;
  const chem = panelChemistry(panel);
  const catDiv = categoryDiversity(panel);
  const contrast = personalityContrast(panel);
  return avgVibe * 0.35 + chem * 0.3 + catDiv * 0.15 + contrast * 0.2;
}

// ─── Generate candidate panels (Fixed size 5, Samay Raina ALWAYS included) ───
export function generateCandidatePanels(
  vibe: Vibe,
  _panelSize: PanelSize = 5,
  numCandidates = 5,
  excludeNames: string[] = [],
): CandidatePanel[] {
  const samay = getSamayRaina();
  const all = getAllPeople();

  // Exclude Samay and any explicitly excluded names from the pool of other 4 members
  const poolFilterNames = new Set([
    'samay raina',
    samay.name.toLowerCase(),
    ...excludeNames.map((n) => n.toLowerCase()),
  ]);

  const filtered = all.filter(
    (p) => !poolFilterNames.has(p.name.toLowerCase()) && p.person_id !== samay.person_id
  );

  const pool = getCandidatePool(filtered, vibe, 60);

  // We need 4 additional members alongside Samay to make a 5-person panel
  const additionalSlots = 4;
  const attempts = 60;
  const scored: { panel: Person[]; score: number }[] = [];

  for (let i = 0; i < attempts; i++) {
    const guests = samplePanel(pool, additionalSlots);
    const fullPanel = [samay, ...guests];
    scored.push({ panel: fullPanel, score: scorePanelForVibe(fullPanel, vibe) });
  }

  scored.sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const results: CandidatePanel[] = [];
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  for (const { panel } of scored) {
    const key = panel
      .map((p) => p.person_id)
      .sort()
      .join(',');
    if (seen.has(key)) continue;
    seen.add(key);

    results.push({
      panelId: labels[results.length] ?? `P${results.length}`,
      members: panel,
      metrics: calculatePanelMetrics(panel),
    });
    if (results.length >= numCandidates) break;
  }

  return results;
}

// ─── Wildcard panel generator (1 person per distinct category) ────

/**
 * For the "Wildcard" vibe, we enforce strict cross-domain diversity:
 * - Samay Raina anchors seat 1 as always.
 * - The remaining 4 guests are drawn from 4 *completely different* categories.
 * - Within each chosen category, we pick the person with the highest
 *   `celebrity_factor + energy_level + viral_potential` composite (i.e. someone
 *   interesting enough to sit on Latent's desk even if they're a scientist).
 * - We generate `numCandidates` panels by sampling different sets of 4 categories.
 */
export function generateWildcardPanels(
  numCandidates = 5,
  excludeNames: string[] = [],
): CandidatePanel[] {
  const samay = getSamayRaina();
  const all = getAllPeople();

  const excludeIds = new Set<string>([
    samay.person_id,
    ...all
      .filter((p) => excludeNames.map((n) => n.toLowerCase()).includes(p.name.toLowerCase()))
      .map((p) => p.person_id),
  ]);

  const byCategory = groupByCategory(all, excludeIds);
  const allCategories = shuffle([...byCategory.keys()]);

  // Need at least 4 distinct categories to build a panel
  if (allCategories.length < 4) {
    // Fall back to standard chaotic generation
    return generateCandidatePanels('chaotic', 5, numCandidates, excludeNames);
  }

  /**
   * Score a person for "interesting on the desk" regardless of their field:
   * pick someone who is charismatic + energetic + known online.
   */
  const interestScore = (p: Person): number =>
    p.celebrity_factor * 0.35 +
    p.energy_level * 0.25 +
    p.viral_potential * 0.20 +
    p.improvisation * 0.20;

  /** Pick the top-N best person from a category bucket. */
  const bestFromCategory = (bucket: Person[], n = 1): Person[] =>
    [...bucket].sort((a, b) => interestScore(b) - interestScore(a)).slice(0, n);

  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const results: CandidatePanel[] = [];
  const seenKeys = new Set<string>();

  // Try generating up to numCandidates * 4 unique category combos
  const maxAttempts = numCandidates * 8;
  for (let attempt = 0; attempt < maxAttempts && results.length < numCandidates; attempt++) {
    // Randomly pick 4 different categories
    const candidateCategories = shuffle(allCategories).slice(0, 4);
    const guests: Person[] = [];

    for (const cat of candidateCategories) {
      const bucket = byCategory.get(cat)!;
      // Pick best person from category, with a small random offset for variety
      const topN = bestFromCategory(bucket, Math.min(5, bucket.length));
      const picked = topN[Math.floor(Math.random() * topN.length)];
      if (picked) guests.push(picked);
    }

    if (guests.length < 4) continue; // shouldn't happen, but guard

    const fullPanel = [samay, ...guests];
    const key = fullPanel
      .map((p) => p.person_id)
      .sort()
      .join(',');

    if (seenKeys.has(key)) continue;
    seenKeys.add(key);

    results.push({
      panelId: labels[results.length] ?? `P${results.length}`,
      members: fullPanel,
      metrics: calculatePanelMetrics(fullPanel),
    });
  }

  return results;
}

// ─── Generate completion candidates (Fixed size 5, Samay Raina ALWAYS included) ───
export function generateCompletionCandidates(
  existingMembers: Person[],
  vibe: Vibe,
  targetSize: PanelSize = 5,
  numCandidates = 5,
): CandidatePanel[] {
  const samay = getSamayRaina();
  let baseMembers = [...existingMembers];

  // If Samay is not present, add him as the anchor host!
  const hasSamay = baseMembers.some(
    (m) => m.name.toLowerCase().includes('samay raina') || m.person_id === samay.person_id
  );
  if (!hasSamay) {
    baseMembers = [samay, ...baseMembers];
  }

  const slotsToFill = 5 - baseMembers.length;
  if (slotsToFill <= 0) {
    return [
      {
        panelId: 'A',
        members: baseMembers.slice(0, 5),
        metrics: calculatePanelMetrics(baseMembers.slice(0, 5)),
      },
    ];
  }

  const all = getAllPeople();
  const existingIds = new Set(baseMembers.map((m) => m.person_id));
  const available = all.filter(
    (p) => !existingIds.has(p.person_id) && p.person_id !== samay.person_id
  );

  // Score candidates for both vibe fit and chemistry with locked members
  const pool = getCandidatePool(available, vibe, 80);
  const scoredPool = pool
    .map((candidate) => {
      const vibeScore = calculateVibeScore(candidate, vibe);
      const avgChem =
        baseMembers.reduce((s, m) => s + pairChemistry(m, candidate), 0) /
        Math.max(baseMembers.length, 1);
      return { candidate, score: vibeScore * 0.5 + avgChem * 0.5 };
    })
    .sort((a, b) => b.score - a.score);

  const topPool = scoredPool.slice(0, 40).map((s) => s.candidate);

  const attempts = 60;
  const scored: { additions: Person[]; score: number }[] = [];

  for (let i = 0; i < attempts; i++) {
    const shuffled = [...topPool].sort(() => Math.random() - 0.5);
    const additions = shuffled.slice(0, slotsToFill);
    const fullPanel = [...baseMembers, ...additions];
    scored.push({ additions, score: scorePanelForVibe(fullPanel, vibe) });
  }

  scored.sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const results: CandidatePanel[] = [];
  const labels = ['A', 'B', 'C', 'D', 'E'];

  for (const { additions } of scored) {
    const key = additions
      .map((p) => p.person_id)
      .sort()
      .join(',');
    if (seen.has(key)) continue;
    seen.add(key);

    const fullPanel = [...baseMembers, ...additions];
    results.push({
      panelId: labels[results.length] ?? `P${results.length}`,
      members: fullPanel,
      metrics: calculatePanelMetrics(fullPanel),
    });
    if (results.length >= numCandidates) break;
  }

  return results;
}
