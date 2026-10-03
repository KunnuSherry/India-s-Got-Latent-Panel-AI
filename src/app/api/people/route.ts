import { NextResponse } from 'next/server';
import { getAllPeople } from '@/lib/people';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    const category = searchParams.get('category') || '';
    const limit = Math.min(Number(searchParams.get('limit')) || 40, 2000);
    const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);

    let list = getAllPeople();

    if (category && category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.profession.toLowerCase().includes(q) ||
          p.known_for.toLowerCase().includes(q)
      );
    }

    const total = list.length;
    const paginated = list.slice(offset, offset + limit);

    // Extract unique categories for easy filtering on frontend
    const allCategories = Array.from(new Set(getAllPeople().map((p) => p.category))).sort();

    return NextResponse.json({
      people: paginated,
      total,
      categories: allCategories,
      offset,
      limit,
    });
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json({ error: 'Failed to load people database' }, { status: 500 });
  }
}
