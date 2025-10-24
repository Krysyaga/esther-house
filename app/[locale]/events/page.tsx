import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getEventsWithZones } from "@/lib/infomaniak";
import type { MappedEvent } from "@/types/infomaniak";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Événements - Esther House",
    description: "Découvrez nos événements à venir et réservez vos places.",
  };
}

export default async function EventsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations();

  // Fetch all visible upcoming events
  let events: MappedEvent[] = [];
  try {
    events = await getEventsWithZones({
      sort: 'date',
      withQuota: true,
      withProperties: true,
    });

    // Filter visible and future events
    const now = new Date();
    events = events.filter(event => {
      const eventDate = new Date(event.date);
      return event.status === 'visible' && eventDate >= now;
    });
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Header Section */}
      <section className="relative w-full py-20 md:py-32 px-4 md:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6 leading-tight"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('pages.events')}
          </h1>
          <div className="w-16 h-1 mb-8" style={{ backgroundColor: "var(--brand-accent)" }} />
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl" style={{ fontFamily: "'Jost', sans-serif" }}>
            {t('pages.events_subtitle')}
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {events.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg" style={{ fontFamily: "'Jost', sans-serif" }}>
                {t('pages.no_events')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const eventDate = new Date(event.date);
                const isSoldOut = event.status === 'full';

                return (
                  <Link
                    key={event.id}
                    href={`/${locale}/events/${event.id}`}
                    className="group relative overflow-hidden rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    {/* Event Image */}
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-900">
                      <Image
                        src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=800&fit=crop'}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90" />

                      {/* Sold Out Badge */}
                      {isSoldOut && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                          {t('pages.event_sold_out')}
                        </div>
                      )}

                      {/* Event Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        {/* Category */}
                        <p
                          className="text-xs uppercase tracking-widest mb-2"
                          style={{
                            fontFamily: "'Jost', sans-serif",
                            color: "var(--brand-accent)"
                          }}
                        >
                          {event.category}
                        </p>

                        {/* Title */}
                        <h3
                          className="text-xl md:text-2xl font-bold uppercase mb-2 group-hover:opacity-80 transition-opacity"
                          style={{ fontFamily: "'Jost', sans-serif" }}
                        >
                          {event.title}
                        </h3>

                        {/* Date and Venue */}
                        <div className="space-y-1 text-sm text-gray-300">
                          <p style={{ fontFamily: "'Jost', sans-serif" }}>
                            {eventDate.toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p style={{ fontFamily: "'Jost', sans-serif" }}>
                            {event.venue.name}
                          </p>
                        </div>

                        {/* Price */}
                        {event.price > 0 && (
                          <p
                            className="mt-3 text-sm font-semibold"
                            style={{
                              fontFamily: "'Jost', sans-serif",
                              color: "var(--brand-accent)"
                            }}
                          >
                            {t('pages.event_from_price')} {event.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
