import {
  CandidatePanel,
  Vibe,
  GeminiPanelSelection,
  BattleResult,
  PanelMetrics,
} from './types';

// ─── Groq API Client via Fetch (zero extra dependency) ───────────
async function callGroqChat(messages: { role: string; content: string }[]): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_')) {
    return null;
  }

  // Use stable Groq model IDs (no response_format — not supported by all models)
  // Confirmed available on this Groq account (as of runtime check)
  const MODELS = ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b'];

  for (const model of MODELS) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`Groq model ${model} failed (${res.status}): ${errText.slice(0, 200)}`);
        continue; // try next model
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        console.log(`\n🤖 [Groq:${model}] Response:\n${content}\n`);
        return content;
      }
      console.warn(`Groq model ${model} returned empty content, trying next.`);
    } catch (err) {
      console.warn(`Groq fetch error for model ${model}:`, err);
    }
  }

  console.warn('⚠️  All Groq models failed — using built-in smart fallback.');
  return null;
}

// ─── Strip code fences ───────────────────────────────────────────
function cleanJSON(raw: string): string {
  return raw
    .replace(/```json?\s*/gi, '')
    .replace(/```/g, '')
    .trim();
}

// ─── Smart dynamic commentary generator ──────────────────────────
function generateSmartCommentary(vibe: Vibe, panel: CandidatePanel): GeminiPanelSelection {
  const guests = panel.members.filter(
    (m) => !m.name.toLowerCase().includes('samay raina')
  );
  const g1 = guests[0]?.name || 'the guest roasters';
  const g2 = guests[1]?.name || 'the comedians';
  const g3 = guests[2]?.name || 'the table';

  const vibeReasons: Record<Vibe, string> = {
    chaotic: `Desk ${panel.panelId} unleashes maximum entropy: Samay Raina's unhinged hosting collides with the unfiltered banter of ${g1} and ${g2}, keeping the table on edge.`,
    safe: `Desk ${panel.panelId} delivers prime crowd-pleasing chemistry: Samay Raina balances razor-sharp crowd work alongside ${g1} and ${g2} with effortless comedic flow.`,
    dark: `Desk ${panel.panelId} brings pure dark comedy resilience: ${g1} and ${g2} absorb and counter Samay's brutal roasts, guaranteeing high-voltage tension.`,
    viral: `Desk ${panel.panelId} is engineered for clips: explosive comedic chemistry between Samay Raina, ${g1}, and ${g2} guarantees instant meme moments.`,
    unhinged: `Desk ${panel.panelId} guarantees total studio delirium: Samay, ${g1}, and ${g2} abandon any script for relentless improvised insanity.`,
    balanced: `Desk ${panel.panelId} offers the definitive roast lineup: seasoned timing from ${g1} and ${g2} perfectly complements Samay Raina's anchoring.`,
    wildcard: `Desk ${panel.panelId} is the most unhinged cross-domain experiment in Latent history: Samay Raina somehow has to hold a conversation between ${g1}, ${g2}, and ${g3} — three people who have absolutely no business being in the same room.`,
  };

  return {
    selectedPanelId: panel.panelId,
    reason:
      vibeReasons[vibe] ||
      `Selected Desk ${panel.panelId} for highest overall entertainment synergy and comedic balance.`,
    highlights: [
      `Samay Raina anchors the desk with 98% comedy delivery`,
      `Dynamic comedic contrast between ${g1} and ${g2}`,
      `Peak viral index score of ${Math.round(panel.metrics.viral)}%`,
      `Synergistic roast tolerance with ${g3} completing the 5 seats`,
    ],
  };
}

// ─── Select best panel using GROQ AI ─────────────────────────────
export async function selectBestPanel(
  vibe: Vibe,
  candidates: CandidatePanel[],
): Promise<GeminiPanelSelection> {
  const best = candidates.reduce((a, b) =>
    a.metrics.overall > b.metrics.overall ? a : b
  );

  const systemInstruction = `You are the AI judge for "India's Got Latent".
Your job is to select the BEST 5-member roast panel from candidate panels for a target vibe.
Host Samay Raina is always in seat 1.
RULES:
1. Select exactly one panel using its panelId (e.g. "A", "B", "C").
2. Provide a witty, punchy reason (1-2 sentences) explaining why Samay Raina and the other 4 guests create the ultimate dynamic.
3. Return 3-4 punchy bullet highlights.
4. Output strictly valid JSON:
{
  "selectedPanelId": "A",
  "reason": "Witty description of why this 5-member panel kills it",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"]
}`;

  const summaries = candidates.map((c) => ({
    panelId: c.panelId,
    members: c.members.map(
      (m) => `${m.name} (${m.profession}, comedy: ${m.comedy_score}, chaos: ${m.chaos_score})`
    ),
    metrics: c.metrics,
  }));

  const prompt = `Select the best 5-member panel for the "${vibe}" vibe.\nCandidates:\n${JSON.stringify(
    summaries,
    null,
    2
  )}`;

  console.log(`\n🎯 [Panel Selector] Requesting AI pick for vibe: "${vibe}" across ${candidates.length} candidates...`);
  const rawJson = await callGroqChat([
    { role: 'system', content: systemInstruction },
    { role: 'user', content: prompt },
  ]);

  if (!rawJson) {
    console.log('↩️  [Panel Selector] No AI response — using smart fallback commentary.');
    return generateSmartCommentary(vibe, best);
  }

  try {
    const parsed = JSON.parse(cleanJSON(rawJson)) as GeminiPanelSelection;
    const validIds = candidates.map((c) => c.panelId);
    if (!validIds.includes(parsed.selectedPanelId)) {
      console.warn(`⚠️  [Panel Selector] AI returned invalid panelId "${parsed.selectedPanelId}", correcting to "${best.panelId}".`);
      parsed.selectedPanelId = best.panelId;
    }
    console.log(`✅ [Panel Selector] AI picked Panel ${parsed.selectedPanelId}: "${parsed.reason?.slice(0, 120)}"`);
    return parsed;
  } catch (e) {
    console.warn('⚠️  [Panel Selector] Failed to parse AI JSON — using smart fallback.');
    return generateSmartCommentary(vibe, best);
  }
}

// ─── Judge battle using GROQ AI ──────────────────────────────────
export async function judgeBattle(
  criterion: Vibe,
  panelA: {
    members: { name: string; category: string; profession: string }[];
    metrics: PanelMetrics;
  },
  panelB: {
    members: { name: string; category: string; profession: string }[];
    metrics: PanelMetrics;
  },
): Promise<BattleResult> {
  const winner = panelA.metrics.overall >= panelB.metrics.overall ? 'A' : 'B';
  const winningPanel = winner === 'A' ? panelA : panelB;
  const losingPanel = winner === 'A' ? panelB : panelA;

  const systemInstruction = `You are the battle referee for India's Got Latent.
Compare two 5-member roast desks (Panel A vs Panel B) on the criterion "${criterion}".
Return strictly valid JSON:
{
  "winner": "A" or "B",
  "reason": "2-3 punchy witty sentences declaring the winning roast desk",
  "comparison": {
    "chaos": "1 sentence comparing chaos",
    "chemistry": "1 sentence comparing chemistry",
    "viralPotential": "1 sentence comparing viral punch"
  }
}`;

  const prompt = `Criterion: ${criterion}
Panel A: ${panelA.members.map((m) => m.name).join(', ')} (Metrics: ${JSON.stringify(panelA.metrics)})
Panel B: ${panelB.members.map((m) => m.name).join(', ')} (Metrics: ${JSON.stringify(panelB.metrics)})`;

  console.log(`\n⚔️  [Battle Judge] Asking AI to judge Panel A vs Panel B on criterion: "${criterion}"...`);
  const rawJson = await callGroqChat([
    { role: 'system', content: systemInstruction },
    { role: 'user', content: prompt },
  ]);

  if (!rawJson) {
    console.log('↩️  [Battle Judge] No AI response — using metric-based fallback verdict.');
    return {
      winner,
      reason: `Panel ${winner} (${winningPanel.members.slice(0, 2).map((m) => m.name).join(' & ')}) takes the episode with higher ${criterion} synergy.`,
      comparison: {
        chaos: `Panel A registered ${panelA.metrics.chaos}% chaos vs Panel B's ${panelB.metrics.chaos}%.`,
        chemistry: `Desk chemistry favored Panel ${winner} with tighter comedic pacing.`,
        viralPotential: `Viral index peaked at ${Math.max(panelA.metrics.viral, panelB.metrics.viral)}% for the winning desk.`,
      },
      metricsA: panelA.metrics,
      metricsB: panelB.metrics,
    };
  }

  try {
    const parsed = JSON.parse(cleanJSON(rawJson));
    console.log(`✅ [Battle Judge] AI verdict — Winner: Panel ${parsed.winner} | "${(parsed.reason || '').slice(0, 120)}"`);
    return {
      winner: parsed.winner === 'B' ? 'B' : 'A',
      reason: parsed.reason || `Panel ${winner} wins based on superior comedic compatibility.`,
      comparison: {
        chaos: parsed.comparison?.chaos || 'Comparable chaos levels.',
        chemistry: parsed.comparison?.chemistry || 'Sharp comedic timing on the winning desk.',
        viralPotential: parsed.comparison?.viralPotential || 'Viral potential was exceptionally high.',
      },
      metricsA: panelA.metrics,
      metricsB: panelB.metrics,
    };
  } catch (e) {
    console.warn('⚠️  [Battle Judge] Failed to parse AI JSON — using metric-based fallback.');
    return {
      winner,
      reason: `Panel ${winner} claims victory with ${winningPanel.metrics.overall}% overall latent synergy compared to Panel ${winner === 'A' ? 'B' : 'A'}'s ${losingPanel.metrics.overall}%.`,
      comparison: {
        chaos: `Chaos differential: Panel A ${panelA.metrics.chaos}% vs Panel B ${panelB.metrics.chaos}%.`,
        chemistry: `Panel ${winner} demonstrated superior conversational balance.`,
        viralPotential: `Winning desk unlocked ${winningPanel.metrics.viral}% viral clip potential.`,
      },
      metricsA: panelA.metrics,
      metricsB: panelB.metrics,
    };
  }
}
