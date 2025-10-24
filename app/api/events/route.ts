import { NextRequest, NextResponse } from 'next/server';
import { getEventsWithZones } from '@/lib/infomaniak';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params = {
      ids: searchParams.get('ids') || undefined,
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
      withQuota: searchParams.get('withQuota') === 'true',
      withProperties: true, // Always get properties
      sort: searchParams.get('sort') || undefined,
    };

    const events = await getEventsWithZones(params);

    return NextResponse.json(events, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
