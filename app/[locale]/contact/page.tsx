'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function ContactPage() {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const response = await fetch('/api/contact', {
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
        setStatusMessage(t('pages.contact_success') || 'Message envoyé avec succès ! Nous vous répondrons bientôt.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setStatusMessage(data.error || (t('pages.contact_error') || 'Une erreur est survenue. Veuillez réessayer.'));
      }
    } catch (error) {
      setStatus('error');
      const errorMsg = error instanceof Error ? error.message : (t('pages.contact_connection_error') || 'Erreur de connexion');
      setStatusMessage(`${errorMsg}. ${t('pages.contact_retry') || 'Veuillez réessayer.'}`);
      console.error('Form error:', error);
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
            {t('pages.contact')}
          </h1>
          <div className="w-16 h-1 mb-8 mx-auto" style={{ backgroundColor: "var(--brand-accent)" }} />
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto" style={{ fontFamily: "'Jost', sans-serif" }}>
            {t('pages.construction')}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h2 
                className="text-2xl md:text-3xl font-bold uppercase mb-8"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {t('pages.contact_info')}
              </h2>
              <div className="w-12 h-1 mb-12" style={{ backgroundColor: "var(--brand-accent)" }} />

              <div className="mb-8">
                <h3 className="text-lg font-semibold uppercase mb-3" style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}>
                  {t('pages.contact_address')}
                </h3>
                <p className="text-gray-300">
                  27 Rue Voltaire<br />
                  1201 Genève<br />
                  Suisse
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold uppercase mb-3" style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}>
                  {t('pages.contact_phone')}
                </h3>
                <p className="text-gray-300">
                  <a href="tel:+41786488212" className="hover:text-white transition-colors">
                    +41 78 648 82 12
                  </a>
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold uppercase mb-3" style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}>
                  {t('pages.contact_email')}
                </h3>
                <p className="text-gray-300">
                  <a href="mailto:info@estherhouse.ch" className="hover:text-white transition-colors">
                    info@estherhouse.ch
                  </a>
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold uppercase mb-3" style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}>
                  {t('pages.contact_hours')}
                </h3>
                <p className="text-gray-300">
                  Lundi - Vendredi: 9:00 - 18:00<br />
                  Samedi: 10:00 - 16:00<br />
                  Dimanche: Fermé
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 
                className="text-2xl md:text-3xl font-bold uppercase mb-8"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {t('pages.contact_form')}
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

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-3 uppercase" style={{ fontFamily: "'Jost', sans-serif" }}>
                    {t('pages.contact_subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-white/60 focus:outline-none transition text-white placeholder-gray-500"
                    placeholder={t('pages.contact_subject')}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-3 uppercase" style={{ fontFamily: "'Jost', sans-serif" }}>
                    {t('pages.contact_message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:border-white/60 focus:outline-none transition text-white placeholder-gray-500 resize-none"
                    placeholder={t('pages.contact_message')}
                  ></textarea>
                </div>

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
                  {loading ? (t('pages.contact_sending') || 'Envoi en cours...') : t('pages.contact_send')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-2xl md:text-3xl font-bold uppercase mb-6"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('pages.contact_faq')}
          </h2>
          <div className="w-12 h-1 mb-12" style={{ backgroundColor: "var(--brand-accent)" }} />
          
          <div className="space-y-6">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="p-6 border border-white/20 rounded-lg hover:border-white/50 transition-colors">
                <h3 className="font-semibold text-lg mb-3 uppercase" style={{ fontFamily: "'Jost', sans-serif" }}>
                  {t('pages.construction')}?
                </h3>
                <p className="text-gray-400">
                  {t('pages.construction')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
