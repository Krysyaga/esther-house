"use client";

import { useTranslations } from 'next-intl';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const t = useTranslations();
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  if (items.length === 0) {
    return (
      <main className="bg-black text-white min-h-screen">
        <section className="relative w-full py-24 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-4xl md:text-5xl font-bold uppercase mb-6"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {t('cart')}
            </h1>
            <div className="w-12 h-1 mx-auto mb-8" style={{ backgroundColor: "var(--brand-accent)" }} />

            <p
              className="text-xl text-gray-400 mb-8"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {t('cart_empty')}
            </p>

            <Link
              href="/events"
              className="inline-block px-8 py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:opacity-90"
              style={{
                fontFamily: "'Jost', sans-serif",
                backgroundColor: 'var(--brand-accent)',
                color: 'white'
              }}
            >
              {t('continue_shopping')}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-black text-white min-h-screen">
      <section className="relative w-full py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold uppercase mb-6"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('cart')}
          </h1>
          <div className="w-12 h-1 mb-12" style={{ backgroundColor: "var(--brand-accent)" }} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.categoryId}
                  className="border border-white/20 rounded-lg p-6 bg-white/5 flex flex-col md:flex-row gap-4"
                >
                  {/* Event Image */}
                  {item.eventImage && (
                    <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.eventImage}
                        alt={item.eventName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Item Details */}
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ fontFamily: "'Jost', sans-serif" }}
                    >
                      {item.eventName}
                    </h3>
                    <p
                      className="text-sm text-gray-400 mb-2"
                      style={{ fontFamily: "'Jost', sans-serif" }}
                    >
                      {new Date(item.eventDate).toLocaleDateString('fr-CH', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-sm px-2 py-1 rounded"
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        {item.zoneName}
                      </span>
                      <span
                        className="text-sm"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        • {item.categoryName}
                      </span>
                    </div>
                    <p
                      className="text-lg font-bold"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        color: 'var(--brand-accent)'
                      }}
                    >
                      CHF {item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.categoryId, Math.max(1, item.quantity - 1))}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span
                        className="w-12 text-center font-bold"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.categoryId, item.quantity + 1)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.categoryId)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400"
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
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

                <Link
                  href="/checkout"
                  className="block w-full py-3 text-center rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:opacity-90 mb-4"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    backgroundColor: 'var(--brand-accent)',
                    color: 'white'
                  }}
                >
                  {t('proceed_to_checkout')}
                </Link>

                <Link
                  href="/events"
                  className="block w-full py-3 text-center rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:bg-white/10 border border-white/20"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                  }}
                >
                  {t('continue_shopping')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
