"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { MappedEvent } from '@/types/infomaniak';
import { Loader2, CreditCard, Smartphone } from 'lucide-react';

export default function BookTicketPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const [event, setEvent] = useState<MappedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [categoryId: number]: number }>({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'CH',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch event');
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  const handleQuantityChange = (categoryId: number, delta: number, maxSeats: number) => {
    setQuantities(prev => {
      const current = prev[categoryId] || 0;
      const newValue = Math.max(0, Math.min(maxSeats, current + delta));
      return { ...prev, [categoryId]: newValue };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const getTotalSelected = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    if (!event) return 0;
    let total = 0;
    event.zones?.forEach(zone => {
      zone.categories.forEach(category => {
        const quantity = quantities[category.category_id] || 0;
        total += quantity * category.amount;
      });
    });
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Build cart items from selections
      const items: Array<{
        eventId: string;
        eventName: string;
        eventDate: string;
        eventImage?: string;
        zoneId: number;
        zoneName: string;
        categoryId: number;
        categoryName: string;
        price: number;
        quantity: number;
      }> = [];
      event?.zones?.forEach(zone => {
        zone.categories.forEach(category => {
          const quantity = quantities[category.category_id] || 0;
          if (quantity > 0) {
            items.push({
              eventId: event.id,
              eventName: event.title,
              eventDate: event.date,
              eventImage: event.image,
              zoneId: zone.zone_id,
              zoneName: zone.name,
              categoryId: category.category_id,
              categoryName: category.name,
              price: category.amount,
              quantity: quantity,
            });
          }
        });
      });

      if (items.length === 0) {
        setError(t('pages.select_at_least_one_ticket'));
        setIsProcessing(false);
        return;
      }

      // Create order with Infomaniak API
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: customerData,
          items: items,
          paymentMethod: selectedPaymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Order creation failed:', errorData);
        throw new Error(errorData.error || 'Failed to create order');
      }

      const data = await response.json();
      console.log('Order created successfully:', data);

      // Save customer email to localStorage for later use in confirmation page
      if (data.orderId && data.email) {
        localStorage.setItem(`order_${data.orderId}_email`, data.email);
        console.log('[BOOKING] Saved email to localStorage:', data.email);
      }

      // Handle different response scenarios
      if (data.isFree && data.confirmationUrl) {
        // Free order - redirect directly to confirmation
        console.log('Free order, redirecting to confirmation');
        window.location.href = data.confirmationUrl;
      } else if (data.paymentUrl) {
        // Paid order with payment URL - redirect to payment
        console.log('Redirecting to payment URL');
        window.location.href = data.paymentUrl;
      } else if (data.confirmationUrl) {
        // Order created but no payment URL - redirect to confirmation
        console.log('No payment URL, redirecting to confirmation');
        window.location.href = data.confirmationUrl;
      } else {
        throw new Error('No payment or confirmation URL received');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(t('pages.booking_error'));
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'var(--brand-accent)' }} />
      </main>
    );
  }

  if (!event || error) {
    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">{error || 'Event not found'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {t('pages.go_back')}
          </button>
        </div>
      </main>
    );
  }

  const eventDate = new Date(event.date);

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Header with Event Info */}
      <section className="relative w-full py-12 px-4 md:px-8 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6">
            {event.image && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h1
                className="text-2xl md:text-3xl font-bold uppercase mb-2"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {event.title}
              </h1>
              <p
                className="text-gray-400"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {eventDate.toLocaleDateString('fr-CH', {
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
        </div>
      </section>

      {/* Booking Form */}
      <section className="relative w-full py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Ticket Selection & Customer Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Ticket Selection */}
                <div className="border border-white/20 rounded-lg p-6 bg-white/5">
                  <h2
                    className="text-2xl font-bold uppercase mb-6"
                    style={{ fontFamily: "'Jost', sans-serif" }}
                  >
                    {t('pages.select_tickets')}
                  </h2>
                  <div className="w-12 h-1 mb-6" style={{ backgroundColor: "var(--brand-accent)" }} />

                  <div className="space-y-6">
                    {event.zones?.map((zone) => (
                      <div key={zone.zone_id} className="border-b border-white/10 pb-6 last:border-0">
                        <h3
                          className="font-semibold uppercase text-lg mb-4"
                          style={{
                            fontFamily: "'Jost', sans-serif",
                            color: `#${zone.bg_color}`
                          }}
                        >
                          {zone.name}
                        </h3>
                        <div className="space-y-4">
                          {zone.categories.map((category) => {
                            const quantity = quantities[category.category_id] || 0;
                            const isAvailable = category.free_seats > 0;

                            return (
                              <div
                                key={category.category_id}
                                className={`border rounded-lg p-4 transition-colors ${
                                  quantity > 0
                                    ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)]/10'
                                    : 'border-white/20 bg-white/5'
                                }`}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <p
                                      className="font-semibold text-lg mb-1"
                                      style={{ fontFamily: "'Jost', sans-serif" }}
                                    >
                                      {category.name}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                      {category.free_seats} {t('pages.event_available')}
                                    </p>
                                  </div>
                                  <p
                                    className="text-2xl font-bold ml-4"
                                    style={{
                                      fontFamily: "'Jost', sans-serif",
                                      color: "var(--brand-accent)"
                                    }}
                                  >
                                    CHF {category.amount.toFixed(2)}
                                  </p>
                                </div>

                                {isAvailable && (
                                  <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                                    <button
                                      type="button"
                                      onClick={() => handleQuantityChange(category.category_id, -1, category.free_seats)}
                                      disabled={quantity === 0}
                                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xl font-bold"
                                      style={{ fontFamily: "'Jost', sans-serif" }}
                                    >
                                      −
                                    </button>
                                    <span
                                      className="text-2xl font-bold px-6"
                                      style={{ fontFamily: "'Jost', sans-serif" }}
                                    >
                                      {quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleQuantityChange(category.category_id, 1, category.free_seats)}
                                      disabled={quantity >= category.free_seats}
                                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xl font-bold"
                                      style={{ fontFamily: "'Jost', sans-serif" }}
                                    >
                                      +
                                    </button>
                                  </div>
                                )}

                                {!isAvailable && (
                                  <p
                                    className="text-center text-sm text-gray-500"
                                    style={{ fontFamily: "'Jost', sans-serif" }}
                                  >
                                    {t('pages.event_sold_out')}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Information */}
                {getTotalSelected() > 0 && (
                  <>
                    <div className="border border-white/20 rounded-lg p-6 bg-white/5">
                      <h2
                        className="text-2xl font-bold uppercase mb-6"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        {t('customer_information')}
                      </h2>
                      <div className="w-12 h-1 mb-6" style={{ backgroundColor: "var(--brand-accent)" }} />

                      <div className="space-y-4">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium mb-2"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            >
                              {t('first_name')} *
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              required
                              value={customerData.firstName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium mb-2"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            >
                              {t('last_name')} *
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              required
                              value={customerData.lastName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            />
                          </div>
                        </div>

                        {/* Contact Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium mb-2"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            >
                              {t('contact_email')} *
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              required
                              value={customerData.email}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="phone"
                              className="block text-sm font-medium mb-2"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            >
                              {t('phone')} *
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              required
                              value={customerData.phone}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            />
                          </div>
                        </div>

                        {/* Address */}
                        <div>
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium mb-2"
                            style={{ fontFamily: "'Jost', sans-serif" }}
                          >
                            {t('contact_address')} *
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            required
                            value={customerData.address}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                            style={{ fontFamily: "'Jost', sans-serif" }}
                          />
                        </div>

                        {/* City, Postal Code, Country */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label
                              htmlFor="city"
                              className="block text-sm font-medium mb-2"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            >
                              {t('city')} *
                            </label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              required
                              value={customerData.city}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="postalCode"
                              className="block text-sm font-medium mb-2"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            >
                              {t('postal_code')} *
                            </label>
                            <input
                              type="text"
                              id="postalCode"
                              name="postalCode"
                              required
                              value={customerData.postalCode}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="country"
                              className="block text-sm font-medium mb-2"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            >
                              {t('country')} *
                            </label>
                            <select
                              id="country"
                              name="country"
                              required
                              value={customerData.country}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-white/40 focus:outline-none transition-colors"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            >
                              <option value="CH">Suisse / Switzerland</option>
                              <option value="FR">France</option>
                              <option value="DE">Deutschland</option>
                              <option value="IT">Italia</option>
                              <option value="AT">Österreich</option>
                              <option value="BE">Belgique / België</option>
                              <option value="LU">Luxembourg</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="border border-white/20 rounded-lg p-6 bg-white/5">
                      <h2
                        className="text-2xl font-bold uppercase mb-6"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        {t('pages.payment_method')}
                      </h2>
                      <div className="w-12 h-1 mb-6" style={{ backgroundColor: "var(--brand-accent)" }} />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Card Payment */}
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('card')}
                          className={`p-6 rounded-lg border-2 transition-all ${
                            selectedPaymentMethod === 'card'
                              ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)]/10'
                              : 'border-white/20 bg-white/5 hover:border-white/40'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-3">
                            <CreditCard size={32} style={{ color: 'var(--brand-accent)' }} />
                            <p
                              className="font-bold text-lg"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            >
                              {t('pages.payment_card')}
                            </p>
                            <p className="text-xs text-gray-400 text-center">
                              {t('pages.payment_card_description')}
                            </p>
                          </div>
                        </button>

                        {/* Twint Payment */}
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('twint')}
                          className={`p-6 rounded-lg border-2 transition-all ${
                            selectedPaymentMethod === 'twint'
                              ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)]/10'
                              : 'border-white/20 bg-white/5 hover:border-white/40'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-3">
                            <Smartphone size={32} style={{ color: 'var(--brand-accent)' }} />
                            <p
                              className="font-bold text-lg"
                              style={{ fontFamily: "'Jost', sans-serif" }}
                            >
                              Twint
                            </p>
                            <p className="text-xs text-gray-400 text-center">
                              {t('pages.payment_twint_description')}
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 border border-white/20 rounded-lg p-6 bg-white/5">
                  <h2
                    className="text-2xl font-bold uppercase mb-6"
                    style={{ fontFamily: "'Jost', sans-serif" }}
                  >
                    {t('order_summary')}
                  </h2>
                  <div className="w-12 h-1 mb-6" style={{ backgroundColor: "var(--brand-accent)" }} />

                  {getTotalSelected() === 0 ? (
                    <p
                      className="text-gray-400 text-center py-8"
                      style={{ fontFamily: "'Jost', sans-serif" }}
                    >
                      {t('pages.select_tickets_to_continue')}
                    </p>
                  ) : (
                    <>
                      {/* Selected Tickets */}
                      <div className="space-y-4 mb-6">
                        {event.zones?.map((zone) =>
                          zone.categories.map((category) => {
                            const quantity = quantities[category.category_id] || 0;
                            if (quantity === 0) return null;

                            return (
                              <div key={category.category_id} className="pb-4 border-b border-white/10 last:border-0">
                                <p
                                  className="font-semibold text-sm mb-1"
                                  style={{ fontFamily: "'Jost', sans-serif" }}
                                >
                                  {category.name}
                                </p>
                                <p
                                  className="text-xs text-gray-400 mb-2"
                                  style={{ fontFamily: "'Jost', sans-serif" }}
                                >
                                  {zone.name}
                                </p>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-400">
                                    {quantity} x CHF {category.amount.toFixed(2)}
                                  </span>
                                  <span
                                    className="font-bold text-sm"
                                    style={{
                                      fontFamily: "'Jost', sans-serif",
                                      color: 'var(--brand-accent)'
                                    }}
                                  >
                                    CHF {(quantity * category.amount).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Totals */}
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span
                            className="text-gray-400"
                            style={{ fontFamily: "'Jost', sans-serif" }}
                          >
                            {t('subtotal')}
                          </span>
                          <span
                            className="font-bold"
                            style={{ fontFamily: "'Jost', sans-serif" }}
                          >
                            CHF {getTotalPrice().toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span
                            className="text-gray-400"
                            style={{ fontFamily: "'Jost', sans-serif" }}
                          >
                            {t('total_items')}
                          </span>
                          <span
                            className="font-bold"
                            style={{ fontFamily: "'Jost', sans-serif" }}
                          >
                            {getTotalSelected()}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-white/20 pt-4 mb-6">
                        <div className="flex justify-between items-center text-xl">
                          <span
                            className="font-bold uppercase"
                            style={{ fontFamily: "'Jost', sans-serif" }}
                          >
                            Total
                          </span>
                          <span
                            className="font-bold"
                            style={{
                              fontFamily: "'Jost', sans-serif",
                              color: 'var(--brand-accent)'
                            }}
                          >
                            CHF {getTotalPrice().toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {error && (
                        <div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50">
                          <p className="text-red-400 text-sm" style={{ fontFamily: "'Jost', sans-serif" }}>
                            {error}
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="block w-full py-4 text-center rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          backgroundColor: 'var(--brand-accent)',
                          color: 'white'
                        }}
                      >
                        {isProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t('processing')}
                          </span>
                        ) : (
                          t('complete_order')
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="block w-full mt-3 py-3 text-center rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:bg-white/10 border border-white/20"
                        style={{
                          fontFamily: "'Jost', sans-serif",
                        }}
                      >
                        {t('pages.cancel')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
