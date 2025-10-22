'use client';

import { useState } from 'react';
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Music,
} from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#d1cfc0] text-black mt-12">
      <div className="w-full px-4 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Newsletter */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 mb-8 md:mb-12 pb-8 md:pb-12 border-b border-black/20">
          <div className="flex-1">
            <h3 className="font-bold text-base md:text-lg mb-2">S&apos;inscrire à la newsletter</h3>
            <p className="text-xs md:text-sm text-gray-700">Recevez nos dernières actualités</p>
          </div>
          
          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col md:flex-row gap-2">
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-3 md:px-4 py-2 bg-white border border-black/20 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
            <button
              type="submit"
              className="px-4 md:px-6 py-2 bg-black text-white font-bold hover:opacity-80 transition-opacity rounded text-sm whitespace-nowrap"
            >
              {subscribed ? '✓' : 'S&apos;abonner'}
            </button>
          </form>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <p className="text-xs md:text-sm text-gray-700">&copy; {new Date().getFullYear()} Esther House</p>
          
          <div className="flex gap-4 md:gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
              aria-label="Instagram"
            >
              <Instagram size={20} className="md:w-6 md:h-6" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
              aria-label="Facebook"
            >
              <Facebook size={20} className="md:w-6 md:h-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
              aria-label="Twitter"
            >
              <Twitter size={20} className="md:w-6 md:h-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} className="md:w-6 md:h-6" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
              aria-label="YouTube"
            >
              <Youtube size={20} className="md:w-6 md:h-6" />
            </a>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
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
