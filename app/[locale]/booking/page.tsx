'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function BookingPage() {
  const t = useTranslations();
  const [selectedEvent, setSelectedEvent] = useState(1);
  const [tickets, setTickets] = useState(1);

  const events = [
    {
      id: 1,
      title: 'Concert Symphonique',
      artist: 'Orchestre Symphonique',
      date: '15 Novembre 2025',
      time: '20:00',
      price: 45,
      description: t('pages.construction'),
      seats_available: 150,
    },
    {
      id: 2,
      title: 'Pièce de Théâtre Classique',
      artist: 'Compagnie Théâtrale',
      date: '22 Novembre 2025',
      time: '19:30',
      price: 35,
      description: t('pages.construction'),
      seats_available: 200,
    },
    {
      id: 3,
      title: 'Exposition d\'Art Moderne',
      artist: 'Galerie Contemporaine',
      date: '01 Décembre 2025',
      time: '10:00',
      price: 15,
      description: t('pages.construction'),
      seats_available: 300,
    },
    {
      id: 4,
      title: 'Festival de Jazz',
      artist: 'Artistes Internationaux',
      date: '08 Décembre 2025',
      time: '21:00',
      price: 55,
      description: t('pages.construction'),
      seats_available: 250,
    },
  ];

  const currentEvent = events.find((e) => e.id === selectedEvent);
  const totalPrice = currentEvent ? currentEvent.price * tickets : 0;

  const handleBooking = () => {
    alert(
      `Réservation confirmée!\n\nÉvénement: ${currentEvent?.title}\nNombre de billets: ${tickets}\nPrix total: CHF ${totalPrice.toFixed(2)}`
    );
  };

  return (
    <main className="bg-black text-white">
      {/* Header Section */}
      <section className="relative w-full py-20 md:py-32 px-4 md:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6 leading-tight"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('pages.booking')}
          </h1>
          <div className="w-16 h-1 mb-8 mx-auto" style={{ backgroundColor: "var(--brand-accent)" }} />
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto" style={{ fontFamily: "'Jost', sans-serif" }}>
            {t('pages.construction')}
          </p>
        </div>
      </section>

      {/* Booking Section */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Events List */}
            <div className="md:col-span-2">
              <h2 
                className="text-2xl md:text-3xl font-bold uppercase mb-8"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {t('pages.booking_available')}
              </h2>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event.id)}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition duration-300 ${
                      selectedEvent === event.id
                        ? 'border-white/60 bg-white/10'
                        : 'border-white/20 hover:border-white/40 bg-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold" style={{ fontFamily: "'Jost', sans-serif" }}>{event.title}</h3>
                        <p className="text-sm text-gray-400">{event.artist}</p>
                      </div>
                      <span className="text-2xl font-bold" style={{ color: "var(--brand-accent)" }}>CHF {event.price}</span>
                    </div>
                    <p className="text-gray-300 mb-3">{event.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex gap-4 text-gray-400">
                        <span>📅 {event.date}</span>
                        <span>⏰ {event.time}</span>
                      </div>
                      <span className="text-green-400 font-semibold">
                        {event.seats_available} places
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Summary */}
            <div>
              <div className="p-8 border border-white/20 rounded-lg sticky top-20 bg-white/5">
                <h2 
                  className="text-2xl font-bold mb-8 uppercase"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {t('pages.booking_summary')}
                </h2>

                {currentEvent && (
                  <>
                    <div className="mb-8 pb-8 border-b border-white/20">
                      <h3 className="font-semibold mb-2" style={{ fontFamily: "'Jost', sans-serif" }}>{currentEvent.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">
                        <span className="block">📅 {currentEvent.date}</span>
                        <span className="block">⏰ {currentEvent.time}</span>
                      </p>
                    </div>

                    <div className="mb-8 pb-8 border-b border-white/20">
                      <label className="block text-sm font-medium text-gray-300 mb-4 uppercase" style={{ fontFamily: "'Jost', sans-serif" }}>
                        {t('pages.booking_tickets')}
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setTickets(Math.max(1, tickets - 1))}
                          className="flex-1 bg-white/10 hover:bg-white/20 font-bold py-2 rounded transition"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={tickets}
                          onChange={(e) => setTickets(Math.max(1, parseInt(e.target.value) || 1))}
                          min="1"
                          max={currentEvent.seats_available}
                          className="flex-1 text-center bg-white/10 border border-white/20 rounded py-2 focus:border-white/60 outline-none text-white"
                        />
                        <button
                          onClick={() => setTickets(Math.min(currentEvent.seats_available, tickets + 1))}
                          className="flex-1 bg-white/10 hover:bg-white/20 font-bold py-2 rounded transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-8 pb-8 border-b border-white/20">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t('pages.booking_unit_price')}:</span>
                        <span className="font-semibold">CHF {currentEvent.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t('pages.booking_quantity')}:</span>
                        <span className="font-semibold">{tickets}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t('pages.booking_fees')}:</span>
                        <span className="font-semibold">CHF 2.50</span>
                      </div>
                    </div>

                    <div className="p-4 rounded mb-6 border border-white/30" style={{ backgroundColor: "rgba(220, 38, 38, 0.1)" }}>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold uppercase" style={{ fontFamily: "'Jost', sans-serif" }}>
                          {t('pages.booking_total')}:
                        </span>
                        <span className="text-2xl font-bold" style={{ color: "var(--brand-accent)" }}>
                          CHF {(totalPrice + 2.5).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleBooking}
                      className="w-full py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:opacity-90 mb-3"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        backgroundColor: 'var(--brand-accent)',
                        color: 'black'
                      }}
                    >
                      {t('pages.booking_reserve')}
                    </button>

                    <button 
                      className="w-full border-2 border-white/30 text-white font-bold uppercase text-sm tracking-wider py-3 rounded-lg hover:border-white/60 transition"
                      style={{ fontFamily: "'Jost', sans-serif" }}
                    >
                      {t('pages.booking_cart')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-2xl md:text-3xl font-bold uppercase mb-6"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('pages.booking_info')}
          </h2>
          <div className="w-12 h-1 mb-12" style={{ backgroundColor: "var(--brand-accent)" }} />
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 border border-white/20 rounded-lg">
              <h3 className="text-lg font-semibold uppercase mb-3" style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}>
                {t('pages.booking_cancellation')}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t('pages.construction')}
              </p>
            </div>
            <div className="p-6 border border-white/20 rounded-lg">
              <h3 className="text-lg font-semibold uppercase mb-3" style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}>
                {t('pages.booking_payment')}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t('pages.construction')}
              </p>
            </div>
            <div className="p-6 border border-white/20 rounded-lg">
              <h3 className="text-lg font-semibold uppercase mb-3" style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}>
                {t('pages.booking_confirmation')}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t('pages.construction')}
              </p>
            </div>
            <div className="p-6 border border-white/20 rounded-lg">
              <h3 className="text-lg font-semibold uppercase mb-3" style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}>
                {t('pages.booking_support')}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t('pages.construction')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
