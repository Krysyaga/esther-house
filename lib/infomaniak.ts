import type {
  InfomaniakEvent,
  InfomaniakZone,
  MappedEvent,
} from '@/types/infomaniak';

const API_KEY = process.env.INFOMANIAK_ETICKETS_API_KEY;
const API_URL = process.env.INFOMANIAK_ETICKETS_API_URL || 'https://etickets.infomaniak.com/api/shop';

if (!API_KEY) {
  console.warn('INFOMANIAK_ETICKETS_API_KEY is not defined in environment variables');
}

/**
 * Base fetch function for Infomaniak API with proper headers
 */
async function infomaniakFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const headers = {
    'Accept-Language': 'fr_FR',
    'key': API_KEY || '',
    'currency': '1', // CHF
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Infomaniak API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Infomaniak API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Infomaniak API fetch error:', error);
    throw error;
  }
}

/**
 * Get all events from Infomaniak
 */
export async function getEvents(params?: {
  ids?: string;
  search?: string;
  limit?: number;
  offset?: number;
  withQuota?: boolean;
  withProperties?: boolean;
  sort?: string;
}): Promise<InfomaniakEvent[]> {
  const queryParams = new URLSearchParams();

  if (params) {
    if (params.ids) queryParams.append('ids', params.ids);
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.withQuota !== undefined) queryParams.append('withQuota', params.withQuota ? '1' : '0');
    if (params.withProperties !== undefined) queryParams.append('withProperties', params.withProperties ? '1' : '0');
    if (params.sort) queryParams.append('sort', params.sort);
  }

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return infomaniakFetch<InfomaniakEvent[]>(`/events${query}`);
}

/**
 * Get a single event by ID
 */
export async function getEvent(eventId: number): Promise<InfomaniakEvent> {
  return infomaniakFetch<InfomaniakEvent>(`/event/${eventId}`);
}

/**
 * Get zones and categories for an event
 */
export async function getEventZones(eventId: number): Promise<InfomaniakZone[]> {
  return infomaniakFetch<InfomaniakZone[]>(`/event/${eventId}/zones`);
}

/**
 * Get a specific zone of an event
 */
export async function getEventZone(eventId: number, zoneId: number): Promise<InfomaniakZone> {
  return infomaniakFetch<InfomaniakZone>(`/event/${eventId}/zone/${zoneId}`);
}

/**
 * Map Infomaniak event category to our app categories
 */
function mapCategory(category: string): 'concert' | 'theatre' | 'exposition' | 'autre' {
  const lowerCategory = category.toLowerCase();

  if (lowerCategory.includes('concert') || lowerCategory.includes('music') || lowerCategory.includes('rock') || lowerCategory.includes('electro') || lowerCategory.includes('jazz')) {
    return 'concert';
  }
  if (lowerCategory.includes('théâtre') || lowerCategory.includes('theater') || lowerCategory.includes('spectacle')) {
    return 'theatre';
  }
  if (lowerCategory.includes('exposition') || lowerCategory.includes('exhibition') || lowerCategory.includes('galerie')) {
    return 'exposition';
  }

  return 'autre';
}

/**
 * Get lowest price from event zones
 */
function getLowestPrice(zones?: InfomaniakZone[]): number {
  if (!zones || zones.length === 0) return 0;

  const allPrices = zones.flatMap(zone =>
    zone.categories.map(cat => cat.amount)
  );

  return Math.min(...allPrices);
}

/**
 * Map Infomaniak event to our app event format
 */
export function mapEventToApp(event: InfomaniakEvent, zones?: InfomaniakZone[]): MappedEvent {
  // Convert properties array to object
  const propertiesObj: { [key: string]: string } = {};
  if (event.properties) {
    event.properties.forEach(prop => {
      if (prop.status === 'visible') {
        propertiesObj[prop.name] = prop.value;
      }
    });
  }

  // Build address string
  const addressParts = [
    event.address.street,
    event.address.number,
    event.address.zipcode,
    event.address.city,
  ].filter(Boolean);

  return {
    id: event.event_id.toString(),
    title: event.name,
    description: event.description,
    date: event.date || event.start, // Use date field, fallback to start
    location: event.address.title,
    image: event.portal_horizontal || event.portal || event.thumbnail, // Use horizontal image first
    category: mapCategory(event.category),
    capacity: event.capacity,
    status: event.status,
    price: zones ? getLowestPrice(zones) : 0,
    venue: {
      name: event.address.title,
      address: addressParts.join(', '),
      city: event.address.city,
      country: event.address.country,
      coordinates: event.address.google.latitude && event.address.google.longitude
        ? {
            lat: event.address.google.latitude,
            lng: event.address.google.longitude,
          }
        : undefined,
    },
    properties: Object.keys(propertiesObj).length > 0 ? propertiesObj : undefined,
    ticketUrl: event.portal_link_preview || undefined,
    zones,
  };
}

/**
 * Get all events with their zones (for full event data)
 */
export async function getEventsWithZones(params?: Parameters<typeof getEvents>[0]): Promise<MappedEvent[]> {
  const events = await getEvents({ ...params, withProperties: true });

  // Fetch zones for each event in parallel
  const eventsWithZones = await Promise.all(
    events.map(async (event) => {
      try {
        const zones = await getEventZones(event.event_id);
        return mapEventToApp(event, zones);
      } catch (error) {
        console.error(`Error fetching zones for event ${event.event_id}:`, error);
        return mapEventToApp(event);
      }
    })
  );

  return eventsWithZones;
}
