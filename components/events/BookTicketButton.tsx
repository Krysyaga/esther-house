"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { MappedEvent } from '@/types/infomaniak';

interface BookTicketButtonProps {
  event: MappedEvent;
}

export function BookTicketButton({ event }: BookTicketButtonProps) {
  const t = useTranslations();

  const isSoldOut = event.status === 'full';

  // Calculate price range
  const getPriceRange = () => {
    if (!event.zones || event.zones.length === 0) return null;

    const prices = event.zones.flatMap(zone =>
      zone.categories.map(cat => cat.amount)
    );

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return `CHF ${minPrice.toFixed(2)}`;
    }
    return `CHF ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`;
  };

  // Get total available seats
  const getTotalAvailableSeats = () => {
    if (!event.zones || event.zones.length === 0) return 0;

    return event.zones.reduce((total, zone) => {
      return total + zone.categories.reduce((zoneTotal, cat) => {
        return zoneTotal + cat.free_seats;
      }, 0);
    }, 0);
  };

  const priceRange = getPriceRange();
  const availableSeats = getTotalAvailableSeats();

  return (
    <div className="sticky top-24 border border-white/20 rounded-lg p-6 bg-white/5">
      <h3
        className="text-2xl font-bold uppercase mb-6"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        {t('pages.event_tickets')}
      </h3>
      <div className="w-12 h-1 mb-6" style={{ backgroundColor: "var(--brand-accent)" }} />

      {isSoldOut ? (
        <div className="text-center py-8">
          <p
            className="text-xl font-bold uppercase mb-2"
            style={{
              fontFamily: "'Jost', sans-serif",
              color: "var(--brand-accent)"
            }}
          >
            {t('pages.event_sold_out')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Price Range */}
          {priceRange && (
            <div className="text-center py-4">
              <p
                className="text-sm text-gray-400 mb-2"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {t('pages.event_from_price')}
              </p>
              <p
                className="text-3xl font-bold"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  color: "var(--brand-accent)"
                }}
              >
                {priceRange}
              </p>
            </div>
          )}

          {/* Available Seats */}
          {availableSeats > 0 && (
            <div className="text-center py-2">
              <p
                className="text-sm text-gray-400"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {availableSeats} {t('pages.event_available')}
              </p>
            </div>
          )}

          {/* Book Button */}
          <Link
            href={`/events/${event.id}/book`}
            className="block w-full py-4 text-center rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:opacity-90"
            style={{
              fontFamily: "'Jost', sans-serif",
              backgroundColor: 'var(--brand-accent)',
              color: 'white'
            }}
          >
            {t('pages.book_my_ticket')}
          </Link>

          {/* Ticket Categories Info */}
          {event.zones && event.zones.length > 0 && (
            <div className="pt-4 border-t border-white/20 space-y-3">
              <p
                className="text-xs uppercase text-gray-500 mb-3"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {t('pages.ticket_categories')}
              </p>
              {event.zones.map((zone) => (
                <div key={zone.zone_id} className="space-y-2">
                  <h4
                    className="font-semibold uppercase text-xs"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      color: `#${zone.bg_color}`
                    }}
                  >
                    {zone.name}
                  </h4>
                  <div className="space-y-1">
                    {zone.categories.map((category) => (
                      <div
                        key={category.category_id}
                        className="flex justify-between items-center text-xs"
                      >
                        <span className="text-gray-400">{category.name}</span>
                        <span
                          className="font-bold"
                          style={{ color: "var(--brand-accent)" }}
                        >
                          CHF {category.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
