'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function AboutPage() {
  const t = useTranslations();

  return (
    <main className="bg-black text-white">
      {/* Header Section */}
      <section className="relative w-full py-20 md:py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6 leading-tight"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('pages.about')}
          </h1>
          <div className="w-16 h-1 mb-8 mx-auto" style={{ backgroundColor: "var(--brand-accent)" }} />
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto" style={{ fontFamily: "'Jost', sans-serif" }}>
            Découvrez notre histoire et notre mission
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 
                className="text-3xl md:text-4xl font-bold uppercase mb-6"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {t('pages.about')} - Notre Histoire
              </h2>
              <div className="w-12 h-1 mb-8" style={{ backgroundColor: "var(--brand-accent)" }} />
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('pages.construction')}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {t('pages.construction')}
              </p>
            </div>
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-white/20">
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <Image
                  src="/images/IMG_2012.jpg"
                  alt="Notre Histoire"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-white/20 order-2 md:order-1">
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <Image
                  src="https://via.placeholder.com/600x600?text=Notre+Mission"
                  alt="Notre Mission"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 
                className="text-3xl md:text-4xl font-bold uppercase mb-6"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {t('pages.about')} - Notre Mission
              </h2>
              <div className="w-12 h-1 mb-8" style={{ backgroundColor: "var(--brand-accent)" }} />
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('pages.construction')}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {t('pages.construction')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold uppercase mb-6"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('pages.about')} - Nos Valeurs
          </h2>
          <div className="w-12 h-1 mb-12" style={{ backgroundColor: "var(--brand-accent)" }} />
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Excellence', desc: t('pages.construction') },
              { title: 'Accessibilité', desc: t('pages.construction') },
              { title: 'Créativité', desc: t('pages.construction') }
            ].map((value, idx) => (
              <div key={idx} className="border border-white/20 p-8 rounded-lg hover:border-white/50 transition-colors">
                <h3 
                  className="text-xl font-bold uppercase mb-4"
                  style={{ fontFamily: "'Jost', sans-serif", color: "var(--brand-accent)" }}
                >
                  {value.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold uppercase mb-6"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('pages.about')} - Notre Équipe
          </h2>
          <div className="w-12 h-1 mb-12" style={{ backgroundColor: "var(--brand-accent)" }} />
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((member) => (
              <div key={member} className="group">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-white/20 mb-4 bg-gray-900">
                  <Image
                    src={`https://via.placeholder.com/400x400?text=Membre+${member}`}
                    alt={`Membre ${member}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold" style={{ fontFamily: "'Jost', sans-serif" }}>Membre de l'Équipe {member}</h3>
                <p className="text-gray-400 text-sm">{t('pages.construction')}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-300 leading-relaxed mb-4 max-w-3xl">
            {t('pages.construction')}
          </p>
          <p className="text-gray-300 leading-relaxed max-w-3xl">
            {t('pages.construction')}
          </p>
        </div>
      </section>
    </main>
  );
}
