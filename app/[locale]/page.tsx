import { UpcomingEventsStacked } from "@/components/home/upcoming-events-stacked";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { getEventsWithZones } from "@/lib/infomaniak";
import type { MappedEvent } from "@/types/infomaniak";

export default async function HomePage() {
  // Fetch events from Infomaniak
  let events: MappedEvent[] = [];
  try {
    events = await getEventsWithZones({
      limit: 10,
      sort: 'date', // Sort by date ascending
      withQuota: true,
      withProperties: true,
    });

    // Filter only visible events with future dates
    const now = new Date();
    events = events.filter(event => {
      const eventDate = new Date(event.date);
      return event.status === 'visible' && eventDate >= now;
    });
  } catch (error) {
    console.error('Error fetching events for homepage:', error);
    // Continue with empty array if API fails
  }

  return (
    <main className="bg-black text-white">
      <HeroCarousel events={events} />
      <UpcomingEventsStacked events={events} />
    </main>
  );
}
