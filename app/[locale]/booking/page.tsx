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
    message: '',
  });
  const [technicalRider, setTechnicalRider] = useState<File | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setTechnicalRider(file);
    } else if (file) {
      alert('Veuillez sélectionner un fichier PDF uniquement');
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('event', formData.event);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('message', formData.message);

      if (technicalRider) {
        formDataToSend.append('technicalRider', technicalRider);
      }

      const response = await fetch('/api/booking', {
        method: 'POST',
        body: formDataToSend,
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
        setFormData({ name: '', email: '', event: 'concert', date: '', message: '' });
        setTechnicalRider(null);
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
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-white/60 focus:outline-none transition text-white [&>option]:bg-black [&>option]:text-white"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                <option value="concert" className="bg-black text-white">{t('pages.booking_event_concert') || 'Concert'}</option>
                <option value="theatre" className="bg-black text-white">{t('pages.booking_event_theatre') || 'Théâtre'}</option>
                <option value="exhibition" className="bg-black text-white">{t('pages.booking_event_exhibition') || 'Exposition'}</option>
                <option value="other" className="bg-black text-white">{t('pages.booking_event_other') || 'Autre'}</option>
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

            {/* Technical Rider PDF Upload */}
            <div>
              <label htmlFor="technicalRider" className="block text-sm font-medium text-gray-300 mb-3 uppercase" style={{ fontFamily: "'Jost', sans-serif" }}>
                Rider Technique (PDF)
              </label>
              <input
                type="file"
                id="technicalRider"
                name="technicalRider"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-white/60 focus:outline-none transition text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
              />
              {technicalRider && (
                <p className="mt-2 text-sm text-gray-400">
                  Fichier sélectionné: {technicalRider.name}
                </p>
              )}
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
