import fs from 'fs';
import path from 'path';
import { Person } from './types';
import { SAMAY_RAINA_IMAGE, DEFAULT_SAMAY_PERSON } from './samay';

export { SAMAY_RAINA_IMAGE, DEFAULT_SAMAY_PERSON };

// ─── CSV parser (handles quoted fields) ──────────────────────────
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

// ─── Cached dataset ──────────────────────────────────────────────
let _cache: Person[] | null = null;

export function getAllPeople(): Person[] {
  if (_cache) return _cache;

  const csvPath = path.join(process.cwd(), 'data', 'samay_panel_people.csv');
  const raw = fs.readFileSync(csvPath, 'utf-8');
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  const headers = parseCSVLine(lines[0]);

  _cache = lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = values[i] ?? ''));

    const name = obj.name ?? '';
    const isSamay =
      name.toLowerCase().includes('samay raina') || obj.person_id === 'P0001';

    return {
      person_id: obj.person_id ?? '',
      name: isSamay ? 'Samay Raina' : name,
      category: obj.category ?? '',
      profession: obj.profession ?? '',
      known_for: isSamay
        ? "Host of India's Got Latent, standup comedian, chess & streaming pioneer"
        : obj.known_for ?? '',
      platforms: obj.platforms ?? '',
      audience_type: obj.audience_type ?? '',
      audience_size_tier: obj.audience_size_tier ?? '',
      comedy_score: isSamay ? 98 : Number(obj.comedy_score) || 0,
      chaos_score: isSamay ? 95 : Number(obj.chaos_score) || 0,
      roastability: isSamay ? 92 : Number(obj.roastability) || 0,
      controversy_level: isSamay ? 88 : Number(obj.controversy_level) || 0,
      energy_level: isSamay ? 90 : Number(obj.energy_level) || 0,
      seriousness: isSamay ? 15 : Number(obj.seriousness) || 0,
      meme_factor: isSamay ? 99 : Number(obj.meme_factor) || 0,
      viral_potential: isSamay ? 98 : Number(obj.viral_potential) || 0,
      unpredictability: isSamay ? 94 : Number(obj.unpredictability) || 0,
      improvisation: isSamay ? 97 : Number(obj.improvisation) || 0,
      internet_native: isSamay ? 99 : Number(obj.internet_native) || 0,
      celebrity_factor: isSamay ? 94 : Number(obj.celebrity_factor) || 0,
      latent_fit: isSamay ? 100 : Number(obj.latent_fit) || 0,
      image_url: isSamay
        ? SAMAY_RAINA_IMAGE
        : obj.image_url && obj.image_url.trim() !== ''
        ? obj.image_url
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e1b4b&color=c084fc&bold=true`,
    } as Person;
  });

  return _cache;
}

export function getSamayRaina(): Person {
  const people = getAllPeople();
  const samay = people.find(
    (p) => p.name.toLowerCase().includes('samay raina') || p.person_id === 'P0001'
  );
  if (samay) {
    samay.image_url = SAMAY_RAINA_IMAGE;
    return samay;
  }
  return people[0];
}

// ─── Search ──────────────────────────────────────────────────────
export function searchPeople(query: string, limit = 20): Person[] {
  const q = query.toLowerCase();
  return getAllPeople()
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.profession.toLowerCase().includes(q),
    )
    .slice(0, limit);
}

// ─── Lookup ──────────────────────────────────────────────────────
export function getPersonByName(name: string): Person | undefined {
  return getAllPeople().find((p) => p.name.toLowerCase() === name.toLowerCase());
}

export function getPersonById(id: string): Person | undefined {
  return getAllPeople().find((p) => p.person_id === id);
}
