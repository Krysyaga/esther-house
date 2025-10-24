"use client";

import { useTranslations } from 'next-intl';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const t = useTranslations();
  const router = useRouter();
  const { items, getTotalPrice, getTotalItems } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'CH',
  });

  // Redirect if cart is empty
  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Create order with Infomaniak API
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: formData,
          items: items,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();

      // Save customer email to localStorage for later use in confirmation page
      if (data.orderId && data.email) {
        localStorage.setItem(`order_${data.orderId}_email`, data.email);
        console.log('[CHECKOUT] Saved email to localStorage:', data.email);
      }

      // Redirect to payment URL provided by Infomaniak
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(t('checkout_error'));
      setIsProcessing(false);
    }
  };

  return (
    <main className="bg-black text-white min-h-screen">
      <section className="relative w-full py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold uppercase mb-6"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('checkout')}
          </h1>
          <div className="w-12 h-1 mb-12" style={{ backgroundColor: "var(--brand-accent)" }} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Information Form */}
            <div className="lg:col-span-2">
              <div className="border border-white/20 rounded-lg p-6 bg-white/5">
                <h2
                  className="text-2xl font-bold uppercase mb-6"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {t('customer_information')}
                </h2>
                <div className="w-12 h-1 mb-6" style={{ backgroundColor: "var(--brand-accent)" }} />

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        value={formData.firstName}
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
                        value={formData.lastName}
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
                        value={formData.email}
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
                        value={formData.phone}
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
                      value={formData.address}
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
                        value={formData.city}
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
                        value={formData.postalCode}
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
                        value={formData.country}
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

                  {error && (
                    <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50">
                      <p className="text-red-400" style={{ fontFamily: "'Jost', sans-serif" }}>
                        {error}
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 border border-white/20 rounded-lg p-6 bg-white/5">
                <h2
                  className="text-2xl font-bold uppercase mb-6"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {t('order_summary')}
                </h2>
                <div className="w-12 h-1 mb-6" style={{ backgroundColor: "var(--brand-accent)" }} />

                {/* Cart Items Summary */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.categoryId} className="pb-4 border-b border-white/10 last:border-0">
                      <p
                        className="font-semibold text-sm mb-1"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        {item.eventName}
                      </p>
                      <p
                        className="text-xs text-gray-400 mb-2"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        {item.zoneName} - {item.categoryName}
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">
                          {item.quantity} x CHF {item.price.toFixed(2)}
                        </span>
                        <span
                          className="font-bold"
                          style={{
                            fontFamily: "'Jost', sans-serif",
                            color: 'var(--brand-accent)'
                          }}
                        >
                          CHF {(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
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
                      {getTotalItems()}
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

                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="block w-full py-3 text-center rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:opacity-90 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    backgroundColor: 'var(--brand-accent)',
                    color: 'white'
                  }}
                >
                  {isProcessing ? t('processing') : t('complete_order')}
                </button>

                <Link
                  href="/cart"
                  className="block w-full py-3 text-center rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:bg-white/10 border border-white/20"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                  }}
                >
                  {t('back_to_cart')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
