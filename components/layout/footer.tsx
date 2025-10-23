'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Music,
} from 'lucide-react';

export function Footer() {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError(t('footer.newsletter_error'));
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#F7E6CA] text-black mt-12">
      {/* Dark Banner Background */}
      <div className="bg-black/90 px-4 md:px-8 lg:px-12 py-16 flex justify-center">
        {/* Newsletter - Floating Form */}
        <form onSubmit={handleSubscribe} className="flex flex-col w-full max-w-2xl -mt-24 relative z-10">
          <div className="flex flex-row bg-white border-2 border-gray-200 rounded overflow-hidden shadow-2xl">
            <input
              type="email"
              placeholder={t('footer.newsletter_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || subscribed}
              required
              className="flex-1 px-8 py-5 bg-white text-black placeholder-gray-400 focus:outline-none text-sm md:text-base border-none"
              style={{ fontFamily: "'Jost', sans-serif" }}
            />
            <button
              type="submit"
              disabled={loading || subscribed}
              className="header-link px-12 py-5 bg-black text-white rounded-md font-bold transition-all text-sm md:text-base whitespace-nowrap disabled:opacity-50 border-none"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {loading ? t('footer.newsletter_sending') : subscribed ? `✓` : 'NEWSLETTER'}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs md:text-sm mt-3 text-center">{error}</p>}
          {subscribed && <p className="text-green-400 text-xs md:text-sm mt-3 text-center">{t('footer.newsletter_success')}</p>}
        </form>
      </div>

      {/* Footer Content */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-12 bg-[#F7E6CA]">
        {/* Social Icons */}
        <div className="flex flex-col items-center gap-6 mt-6">
          <p className="text-xs md:text-sm text-gray-700 m-0" style={{ fontFamily: "'Jost', sans-serif" }}>&copy; {new Date().getFullYear()} Esther House - {t('footer.rights')}</p>
          
          <div className="flex gap-4 md:gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} className="md:w-6 md:h-6" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} className="md:w-6 md:h-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} className="md:w-6 md:h-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} className="md:w-6 md:h-6" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black transition-colors"
              aria-label="YouTube"
            >
              <Youtube size={20} className="md:w-6 md:h-6" />
            </a>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-black transition-colors"
              aria-label="Spotify"
            >
              <Music size={20} className="md:w-6 md:h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
