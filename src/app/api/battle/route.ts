import { NextResponse } from 'next/server';
import { getPersonById } from '@/lib/people';
import { judgeBattle } from '@/lib/gemini';
import { calculatePanelMetrics } from '@/lib/chemistry';
import { Vibe, ALL_VIBES, Person } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const vibe: Vibe = ALL_VIBES.includes(body.vibe) ? body.vibe : 'chaotic';
    const panelAIds: string[] = Array.isArray(body.panelAIds) ? body.panelAIds : [];
    const panelBIds: string[] = Array.isArray(body.panelBIds) ? body.panelBIds : [];

    if (panelAIds.length < 2 || panelBIds.length < 2) {
      return NextResponse.json(
        { error: 'Both panels must have at least 2 members for a battle' },
        { status: 400 }
      );
    }

    const panelA: Person[] = [];
    for (const id of panelAIds) {
      const p = getPersonById(id);
      if (p) panelA.push(p);
    }

    const panelB: Person[] = [];
    for (const id of panelBIds) {
      const p = getPersonById(id);
      if (p) panelB.push(p);
    }

    if (panelA.length === 0 || panelB.length === 0) {
      return NextResponse.json(
        { error: 'One or both panels contain no valid members' },
        { status: 404 }
      );
    }

    const metricsA = calculatePanelMetrics(panelA);
    const metricsB = calculatePanelMetrics(panelB);

    const result = await judgeBattle(
      vibe,
      {
        members: panelA.map((p) => ({
          name: p.name,
          category: p.category,
          profession: p.profession,
        })),
        metrics: metricsA,
      },
      {
        members: panelB.map((p) => ({
          name: p.name,
          category: p.category,
          profession: p.profession,
        })),
        metrics: metricsB,
      }
    );

    return NextResponse.json({
      success: true,
      result,
      panelA,
      panelB,
      metricsA,
      metricsB,
      vibe,
    });
  } catch (error) {
    console.error('Error conducting panel battle:', error);
    return NextResponse.json(
      { error: 'An error occurred while evaluating the battle' },
      { status: 500 }
    );
  }
}
