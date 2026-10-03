import { NextResponse } from 'next/server';
import { getPersonById } from '@/lib/people';
import { generateCompletionCandidates } from '@/lib/panel-generator';
import { enrichPanelImages } from '@/lib/wiki-image';
import { Vibe, PanelSize, ALL_VIBES, Person } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const existingMemberIds: string[] = Array.isArray(body.existingMemberIds)
      ? body.existingMemberIds
      : [];
    const vibe: Vibe = ALL_VIBES.includes(body.vibe) ? body.vibe : 'chaotic';
    const targetSize: PanelSize = 5;

    if (existingMemberIds.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least 1 person to complete the panel' },
        { status: 400 }
      );
    }

    if (existingMemberIds.length >= targetSize) {
      return NextResponse.json(
        { error: 'Panel is already at or above target size' },
        { status: 400 }
      );
    }

    const existingMembers: Person[] = [];
    for (const id of existingMemberIds) {
      const p = getPersonById(id);
      if (p) existingMembers.push(p);
    }

    if (existingMembers.length === 0) {
      return NextResponse.json(
        { error: 'None of the provided member IDs could be found' },
        { status: 404 }
      );
    }

    const candidates = generateCompletionCandidates(
      existingMembers,
      vibe,
      targetSize,
      5
    );

    // Enrich images for candidates via Wikimedia
    for (const cand of candidates) {
      cand.members = await enrichPanelImages(cand.members);
    }

    return NextResponse.json({
      success: true,
      existingMembers,
      candidates,
    });
  } catch (error) {
    console.error('Error completing panel:', error);
    return NextResponse.json(
      { error: 'An error occurred while completing the panel' },
      { status: 500 }
    );
  }
}
