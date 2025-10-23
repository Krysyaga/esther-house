'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

export default function ContactPage() {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="bg-black text-white">
      {/* Header Section */}
      <section className="relative w-full py-20 md:py-32 px-4 md:px-8 border-b border-white/10 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://via.placeholder.com/1920x600?text=Contact+Background"
            alt="Contact Background"
            fill
            className="object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
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
                  className="w-full py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:opacity-90"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    backgroundColor: 'var(--brand-accent)',
                    color: 'black'
                  }}
                >
                  {t('pages.contact_send')}
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
