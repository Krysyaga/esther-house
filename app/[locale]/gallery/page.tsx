'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

export default function GalleryPage() {
  const t = useTranslations();
  const [filter, setFilter] = useState('all');

  const galleryItems = [
    { id: 1, title: 'Événement 1', category: 'concert' },
    { id: 2, title: 'Événement 2', category: 'theatre' },
    { id: 3, title: 'Événement 3', category: 'exhibition' },
    { id: 4, title: 'Événement 4', category: 'concert' },
    { id: 5, title: 'Événement 5', category: 'theatre' },
    { id: 6, title: 'Événement 6', category: 'exhibition' },
    { id: 7, title: 'Événement 7', category: 'concert' },
    { id: 8, title: 'Événement 8', category: 'theatre' },
  ];

  const filteredItems = filter === 'all' ? galleryItems : galleryItems.filter(item => item.category === filter);

  return (
    <main className="bg-black text-white">
      {/* Header Section */}
      <section className="relative w-full py-20 md:py-32 px-4 md:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6 leading-tight"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t('pages.gallery')}
          </h1>
          <div className="w-16 h-1 mb-8 mx-auto" style={{ backgroundColor: "var(--brand-accent)" }} />
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto" style={{ fontFamily: "'Jost', sans-serif" }}>
            {t('pages.gallery_description')}
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Filter Buttons */}
          <div className="mb-12 flex gap-4 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full transition-all duration-300 uppercase font-semibold text-sm tracking-wider ${
                filter === 'all'
                  ? 'text-black'
                  : 'border-2 border-white/30 text-white hover:border-white/60'
              }`}
              style={{
                fontFamily: "'Jost', sans-serif",
                backgroundColor: filter === 'all' ? 'var(--brand-accent)' : 'transparent'
              }}
            >
              {t('pages.gallery_all')}
            </button>
            {['concert', 'theatre', 'exhibition'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full transition-all duration-300 uppercase font-semibold text-sm tracking-wider ${
                  filter === cat
                    ? 'text-black'
                    : 'border-2 border-white/30 text-white hover:border-white/60'
                }`}
                style={{
                  fontFamily: "'Jost', sans-serif",
                  backgroundColor: filter === cat ? 'var(--brand-accent)' : 'transparent'
                }}
              >
                {t(`upcoming.${cat}`)}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {filteredItems.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-white/20 mb-4 bg-gray-900 hover:border-white/50 transition-colors duration-300">
                  <Image
                    src={`https://via.placeholder.com/400x400?text=${item.title}`}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <button 
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 py-2 rounded-full font-semibold uppercase text-sm tracking-wider"
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        backgroundColor: 'var(--brand-accent)',
                        color: 'black'
                      }}
                    >
                      {t('pages.construction')}
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-white" style={{ fontFamily: "'Jost', sans-serif" }}>{item.title}</h3>
                <p className="text-sm text-gray-400 capitalize">{item.category}</p>
              </div>
            ))}
          </div>

          {/* Description Section */}
          <div className="max-w-4xl border border-white/20 p-8 md:p-12 rounded-lg">
            <h2 
              className="text-2xl md:text-3xl font-bold mb-6 uppercase"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {t('pages.gallery_title')}
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
      </section>
    </main>
  );
}
