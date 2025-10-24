import { NextRequest, NextResponse } from 'next/server';
import { getEvent, getEventZones, mapEventToApp } from '@/lib/infomaniak';

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

    // Fetch event and zones in parallel
    const [event, zones] = await Promise.all([
      getEvent(eventId),
      getEventZones(eventId),
    ]);

    const mappedEvent = mapEventToApp(event, zones);

    return NextResponse.json(mappedEvent, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error(`Error fetching event ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}
