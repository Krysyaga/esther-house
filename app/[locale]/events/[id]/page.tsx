import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getEvent, getEventZones, mapEventToApp } from "@/lib/infomaniak";
import Image from "next/image";
import { notFound } from "next/navigation";
import { EventDetailClient } from "@/components/events/EventDetailClient";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const event = await getEvent(parseInt(id));
    return {
      title: `${event.name} - Esther House`,
      description: event.description || `Réservez vos billets pour ${event.name}`,
    };
  } catch {
    return {
      title: "Événement - Esther House",
      description: "Détails de l'événement et réservation.",
    };
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations();

  // Fetch event details
  let event;
  try {
    const [eventData, zones] = await Promise.all([
      getEvent(parseInt(id)),
      getEventZones(parseInt(id)),
    ]);
    event = mapEventToApp(eventData, zones);
  } catch (error) {
    console.error('Error fetching event:', error);
    notFound();
  }

  const eventDate = new Date(event.date);

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Hero Section with Event Image */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
        <Image
          src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920&h=1080&fit=crop'}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black" />

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <p
              className="text-sm md:text-base uppercase tracking-widest mb-4"
              style={{
                fontFamily: "'Jost', sans-serif",
                color: "var(--brand-accent)"
              }}
            >
              {event.category}
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-7xl font-bold uppercase mb-4 leading-tight"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {event.title}
            </h1>
            <p
              className="text-lg md:text-xl text-gray-300"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {eventDate.toLocaleDateString(locale, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Event Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {event.description && (
              <div>
                <h2
                  className="text-2xl md:text-3xl font-bold uppercase mb-4"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {t('pages.event_description')}
                </h2>
                <div className="w-12 h-1 mb-6" style={{ backgroundColor: "var(--brand-accent)" }} />
                <div
                  className="text-gray-300 leading-relaxed text-lg prose prose-invert max-w-none"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>
            )}

            {/* Event Properties */}
            {event.properties && Object.keys(event.properties).length > 0 && (
              <div>
                <h2
                  className="text-2xl md:text-3xl font-bold uppercase mb-4"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Informations
                </h2>
                <div className="w-12 h-1 mb-6" style={{ backgroundColor: "var(--brand-accent)" }} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(event.properties).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span
                        className="text-sm uppercase tracking-wider text-gray-500 mb-1"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        {key}
                      </span>
                      <span
                        className="text-lg text-white"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Venue */}
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold uppercase mb-4"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {t('pages.event_venue')}
              </h2>
              <div className="w-12 h-1 mb-6" style={{ backgroundColor: "var(--brand-accent)" }} />
              <div className="space-y-2">
                <p
                  className="text-xl font-semibold"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {event.venue.name}
                </p>
                <p
                  className="text-gray-300"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {event.venue.address}
                </p>
                <p
                  className="text-gray-300"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {event.venue.city}, {event.venue.country}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Ticket Selection */}
          <EventDetailClient event={event} />
        </div>
      </section>
    </main>
  );
}
