import { NextResponse } from 'next/server';
import { generateCandidatePanels, generateWildcardPanels } from '@/lib/panel-generator';
import { selectBestPanel } from '@/lib/gemini';
import { enrichPanelImages } from '@/lib/wiki-image';
import { Vibe, PanelSize, ALL_VIBES } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vibe: Vibe = ALL_VIBES.includes(body.vibe) ? body.vibe : 'chaotic';
    const panelSize: PanelSize = 5;
    const excludeNames: string[] = Array.isArray(body.excludeNames) ? body.excludeNames : [];

    // ── Dispatch to the right generator ──────────────────────────
    let candidates;
    if (vibe === 'wildcard') {
      console.log('\n🎲 [Wildcard] Generating cross-domain panel — one guest per category...');
      candidates = generateWildcardPanels(5, excludeNames);
    } else {
      candidates = generateCandidatePanels(vibe, 5, 5, excludeNames);
    }

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({ error: 'Failed to generate candidates' }, { status: 400 });
    }

    const selection = await selectBestPanel(vibe, candidates);
    const chosen =
      candidates.find((c) => c.panelId === selection.selectedPanelId) || candidates[0];

    // Fetch and enrich images from Wikimedia Commons / Wikipedia API
    const enrichedMembers = await enrichPanelImages(chosen.members);

    const fullPanel = {
      members: enrichedMembers,
      vibe,
      panelSize: 5 as const,
      metrics: chosen.metrics,
      reason: selection.reason,
      highlights: selection.highlights,
    };

    if (vibe === 'wildcard') {
      const categories = chosen.members
        .filter((m) => m.name !== 'Samay Raina')
        .map((m) => m.category);
      console.log(`✅ [Wildcard] Panel assembled — categories: ${categories.join(' | ')}`);
    }

    return NextResponse.json({
      success: true,
      panel: fullPanel,
      candidates,
      selectedPanelId: chosen.panelId,
    });
  } catch (error) {
    console.error('Error generating panel:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the panel' },
      { status: 500 }
    );
  }
}

