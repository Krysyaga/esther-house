'use client';

import { useEffect, useState } from 'react';

export default function MaintenancePage() {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // Optional: Countdown timer (set to any time you want)
    const maintenanceEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000).getTime(); // 24h from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = maintenanceEndTime - now;

      if (distance <= 0) {
        setTimeRemaining(0);
        clearInterval(timer);
      } else {
        setTimeRemaining(distance);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
  const seconds = Math.floor((timeRemaining / 1000) % 60);

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-black text-white">
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-2xl text-center space-y-8">
            {/* Large maintenance icon/number */}
            <div className="space-y-4">
              <div
                className="text-[120px] md:text-[180px] font-semibold leading-none text-white/20"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                🛠️
              </div>
              <h1
                className="text-4xl md:text-6xl font-bold uppercase"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Maintenance en cours
              </h1>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-lg md:text-xl text-gray-400">
                Nous effectuons actuellement une maintenance sur notre site pour vous offrir une meilleure expérience.
              </p>
              <p className="text-base md:text-lg text-gray-500">
                Nous serons de retour très bientôt avec de nouvelles améliorations !
              </p>
            </div>

            {/* Countdown Timer */}
            {timeRemaining > 0 && (
              <div className="pt-8 border-t border-white/10">
                <p className="text-gray-500 mb-4">Retour estimé :</p>
                <div className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}>
                  {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
              </div>
            )}

            {/* Contact info */}
            <div className="pt-8 border-t border-white/10">
              <p className="text-gray-500 mb-4">Questions ? Contactez-nous :</p>
              <a
                href="mailto:contact@estherhouse.ch"
                className="inline-block px-8 py-3 text-white font-bold hover:opacity-80 transition-opacity rounded-lg"
                style={{ fontFamily: "'Jost', sans-serif", backgroundColor: "var(--brand-accent)" }}
              >
                Nous contacter
              </a>
            </div>

            {/* Social links */}
            <div className="pt-8 border-t border-white/10">
              <p className="text-gray-500 mb-4">Suivez-nous pour les mises à jour :</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors font-medium"
                  style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}
                >
                  Instagram
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors font-medium"
                  style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
