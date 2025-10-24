/**
 * Infomaniak eTickets API Type Definitions
 * Based on: https://etickets.infomaniak.com/api/shop documentation
 */

// Event Types - Actual API response structure
export interface InfomaniakEvent {
  date_id: number;
  event_id: number;
  period_id: number;
  name: string;
  description: string;
  start: string; // ISO datetime string
  date: string; // ISO datetime string (same as start)
  end: string | null;
  opening_doors: string;
  closing_doors: string | null;
  category: string;
  category_id: number;
  status: 'visible' | 'full';
  capacity: number | null;
  has_hall: boolean;
  has_zone: boolean;
  minimum_age: number;
  duration_in_minutes: number;
  website: string | null;
  ytb: string | null;
  portal: string; // Big image URL
  portal_horizontal: string; // Horizontal image URL
  thumbnail: string; // Thumbnail image URL
  portal_link: string; // Relative link to event
  portal_link_preview: string; // Full URL to event page
  address: InfomaniakAddress;
  properties?: InfomaniakEventProperty[];
  // Optional fields when withQuota is true
  quota?: number;
  total?: number;
  reserved?: number;
  paid?: number;
  free?: number;
  warning_low?: number;
  authors?: any[];
  distribution?: any[];
}

export interface InfomaniakAddress {
  id: number;
  title: string;
  street: string | null;
  number: string | null;
  zipcode: string;
  city: string;
  country: string;
  country_id: number;
  custom: string | null;
  google: {
    title: string | null;
    place_id: string | null;
    latitude: number;
    longitude: number;
  };
}

export interface InfomaniakEventProperty {
  name: string;
  value: string;
  status: 'visible' | 'hidden';
}

// Zone and Category Types
export interface InfomaniakZone {
  zone_id: number;
  name: string;
  status: 'visible' | 'full';
  status_id: number;
  bg_color: string; // Hex color without #
  text_color: string;
  numbered: 0 | 1; // 0 = unnumbered, 1 = numbered seats
  free_seats: number;
  total_seats: number;
  reserved_seats_zones: number;
  default_total_seats: number;
  position: number;
  zone_link: number;
  zone_areas: any | null;
  access: any;
  categories: InfomaniakCategory[];
}

export interface InfomaniakCategory {
  category_id: number;
  name: string;
  status: 'visible' | 'full';
  status_id: number;
  amount: number; // Price
  free_seats: number;
  limit?: number; // Max tickets per order
  position?: number;
}

// API Response Types
export interface InfomaniakEventsResponse {
  events: InfomaniakEvent[];
}

export interface InfomaniakEventResponse {
  event: InfomaniakEvent;
}

export interface InfomaniakZonesResponse {
  zones: InfomaniakZone[];
}

// Mapped types for our application
export interface MappedEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  price: number; // Lowest price
  category: 'concert' | 'theatre' | 'exposition' | 'autre';
  capacity: number | null;
  status: 'visible' | 'full';
  ticketUrl?: string; // URL to buy tickets
  venue: {
    name: string;
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  properties?: {
    [key: string]: string;
  };
  zones?: InfomaniakZone[];
}

// Carousel-specific type
export interface CarouselEvent {
  id: number;
  artist: string;
  date: string;
  name: string;
  image: string;
  slideNumber: string;
}

// Upcoming events stacked type
export interface UpcomingEvent {
  id: number;
  name: string;
  artist: string;
  date: string;
  image: string;
  category: 'concert' | 'theatre' | 'exposition' | 'autre';
}
