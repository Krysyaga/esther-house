'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function BookingPage() {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    event: 'concert',
    date: '',
    tickets: '1',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned invalid response');
      }

      if (response.ok) {
        setStatus('success');
        setStatusMessage('Réservation envoyée avec succès ! Nous confirmerons votre demande bientôt.');
        setFormData({ name: '', email: '', event: 'concert', date: '', tickets: '1', message: '' });
      } else {
        setStatus('error');
        setStatusMessage(data.error || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      setStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Erreur de connexion';
      setStatusMessage(`${errorMsg}. Veuillez réessayer.`);
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus('idle'), 5000);
    }
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

      {/* Booking Form Section */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8 border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <h2 
            className="text-2xl md:text-3xl font-bold uppercase mb-8"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('pages.booking_form') || 'Formulaire de Réservation'}
          </h2>
          <div className="w-12 h-1 mb-12" style={{ backgroundColor: "var(--brand-accent)" }} />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'success' && (
              <div className="p-4 bg-green-900/30 border border-green-500 rounded-lg text-green-400">
                {statusMessage}
              </div>
            )}
            {status === 'error' && (
              <div className="p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-400">
                {statusMessage}
              </div>
            )}
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-3 uppercase" style={{ fontFamily: "'Jost', sans-serif" }}>
                {t('pages.contact_name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-white/60 focus:outline-none transition text-white placeholder-gray-500"
                placeholder={t('pages.contact_name')}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-3 uppercase" style={{ fontFamily: "'Jost', sans-serif" }}>
                {t('pages.contact_email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-white/60 focus:outline-none transition text-white placeholder-gray-500"
                placeholder="votre.email@exemple.com"
              />
            </div>

            {/* Event Selection */}
            <div>
              <label htmlFor="event" className="block text-sm font-medium text-gray-300 mb-3 uppercase" style={{ fontFamily: "'Jost', sans-serif" }}>
                {t('pages.booking_event_type') || 'Type d\'Événement'}
              </label>
              <select
                id="event"
                name="event"
                value={formData.event}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-white/60 focus:outline-none transition text-white"
              >
                <option value="concert">{t('pages.booking_event_concert') || 'Concert'}</option>
                <option value="theatre">{t('pages.booking_event_theatre') || 'Théâtre'}</option>
                <option value="exhibition">{t('pages.booking_event_exhibition') || 'Exposition'}</option>
                <option value="other">{t('pages.booking_event_other') || 'Autre'}</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-3 uppercase" style={{ fontFamily: "'Jost', sans-serif" }}>
                {t('pages.booking_desired_date') || 'Date Souhaitée'}
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-white/60 focus:outline-none transition text-white"
              />
            </div>

            {/* Number of Tickets */}
            <div>
              <label htmlFor="tickets" className="block text-sm font-medium text-gray-300 mb-3 uppercase" style={{ fontFamily: "'Jost', sans-serif" }}>
                {t('pages.booking_tickets')}
              </label>
              <input
                type="number"
                id="tickets"
                name="tickets"
                value={formData.tickets}
                onChange={handleChange}
                min="1"
                max="100"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-white/60 focus:outline-none transition text-white"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-3 uppercase" style={{ fontFamily: "'Jost', sans-serif" }}>
                {t('pages.booking_additional_info') || 'Informations Supplémentaires'}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-white/60 focus:outline-none transition text-white placeholder-gray-500 resize-none"
                placeholder={t('pages.booking_additional_info_placeholder') || 'Toute information utile pour votre réservation...'}
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: "'Jost', sans-serif",
                backgroundColor: 'var(--brand-accent)',
                color: 'black'
              }}
            >
              {loading ? (t('pages.booking_sending') || 'Envoi en cours...') : t('pages.booking_reserve')}
            </button>
          </form>
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
