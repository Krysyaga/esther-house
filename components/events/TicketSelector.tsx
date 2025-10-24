"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/contexts/CartContext';
import type { MappedEvent } from '@/types/infomaniak';

interface TicketSelectorProps {
  event: MappedEvent;
}

export function TicketSelector({ event }: TicketSelectorProps) {
  const t = useTranslations();
  const { addItem } = useCart();
  const [quantities, setQuantities] = useState<{ [categoryId: number]: number }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const isSoldOut = event.status === 'full';

  const handleQuantityChange = (categoryId: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[categoryId] || 0;
      const newValue = Math.max(0, current + delta);
      return { ...prev, [categoryId]: newValue };
    });
  };

  const handleAddToCart = () => {
    let totalAdded = 0;

    // Add all items with quantity > 0
    event.zones?.forEach(zone => {
      zone.categories.forEach(category => {
        const quantity = quantities[category.category_id] || 0;
        if (quantity > 0) {
          addItem({
            eventId: event.id,
            eventName: event.title,
            eventDate: event.date,
            eventImage: event.image,
            zoneId: zone.zone_id,
            zoneName: zone.name,
            categoryId: category.category_id,
            categoryName: category.name,
            price: category.amount,
          }, quantity);
          totalAdded += quantity;
        }
      });
    });

    if (totalAdded > 0) {
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Reset quantities
      setQuantities({});
    }
  };

  const getTotalSelected = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    let total = 0;
    event.zones?.forEach(zone => {
      zone.categories.forEach(category => {
        const quantity = quantities[category.category_id] || 0;
        total += quantity * category.amount;
      });
    });
    return total;
  };

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
          {/* Zones and Categories */}
          {event.zones && event.zones.length > 0 ? (
            <div className="space-y-4">
              {event.zones.map((zone) => (
                <div key={zone.zone_id} className="border-b border-white/10 pb-4 last:border-0">
                  <h4
                    className="font-semibold uppercase text-sm mb-3"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      color: `#${zone.bg_color}`
                    }}
                  >
                    {zone.name}
                  </h4>
                  <div className="space-y-3">
                    {zone.categories.map((category) => {
                      const quantity = quantities[category.category_id] || 0;
                      const isAvailable = category.free_seats > 0;

                      return (
                        <div
                          key={category.category_id}
                          className="space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <p
                                className="font-medium text-sm"
                                style={{ fontFamily: "'Jost', sans-serif" }}
                              >
                                {category.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {category.free_seats} {t('pages.event_available')}
                              </p>
                            </div>
                            <p
                              className="font-bold text-sm ml-4"
                              style={{
                                fontFamily: "'Jost', sans-serif",
                                color: "var(--brand-accent)"
                              }}
                            >
                              CHF {category.amount.toFixed(2)}
                            </p>
                          </div>

                          {/* Quantity Selector */}
                          {isAvailable && (
                            <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                              <button
                                onClick={() => handleQuantityChange(category.category_id, -1)}
                                disabled={quantity === 0}
                                className="w-8 h-8 rounded flex items-center justify-center transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                style={{ fontFamily: "'Jost', sans-serif" }}
                              >
                                −
                              </button>
                              <span
                                className="font-semibold px-4"
                                style={{ fontFamily: "'Jost', sans-serif" }}
                              >
                                {quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(category.category_id, 1)}
                                disabled={quantity >= category.free_seats}
                                className="w-8 h-8 rounded flex items-center justify-center transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                style={{ fontFamily: "'Jost', sans-serif" }}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              Informations de billetterie non disponibles
            </p>
          )}

          {/* Total and Add to Cart */}
          {getTotalSelected() > 0 && (
            <div className="pt-4 border-t border-white/20 space-y-4">
              <div className="flex justify-between items-center">
                <span
                  className="font-semibold"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  Total
                </span>
                <span
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    color: "var(--brand-accent)"
                  }}
                >
                  CHF {getTotalPrice().toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-3 text-center rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:opacity-90"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  backgroundColor: 'var(--brand-accent)',
                  color: 'white'
                }}
              >
                {t('pages.add_to_cart')} ({getTotalSelected()})
              </button>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div
              className="bg-green-600/20 border border-green-600 text-green-300 px-4 py-3 rounded-lg text-sm text-center"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {t('pages.added_to_cart')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
