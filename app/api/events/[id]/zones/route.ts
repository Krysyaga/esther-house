import { NextRequest, NextResponse } from 'next/server';
import { getEventZones } from '@/lib/infomaniak';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const zones = await getEventZones(eventId);

    return NextResponse.json(zones, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error(`Error fetching zones for event ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch event zones' },
      { status: 500 }
    );
  }
}
