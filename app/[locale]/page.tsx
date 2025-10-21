"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Event {
  id: number;
  artist: string;
  date: string;
  image: string;
  name: string;
  slideNumber: string;
}

const EVENTS: Event[] = [
  {
    id: 1,
    artist: "Concert Rock Legend",
    date: "15 Nov 2024",
    name: "The Rockers Band",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
    slideNumber: "01",
  },
  {
    id: 2,
    artist: "Concert Jazz Night",
    date: "22 Nov 2024",
    name: "Miles Davis Experience",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    slideNumber: "02",
  },
  {
    id: 3,
    artist: "Théâtre Contemporain",
    date: "28 Nov 2024",
    name: "La Compagnie du Rire",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    slideNumber: "03",
  },
  {
    id: 4,
    artist: "Danse Moderne",
    date: "05 Dec 2024",
    name: "Dancers Collective",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
    slideNumber: "04",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % EVENTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index % EVENTS.length);
  };

  const goToEvent = (index: number) => {
    const eventId = EVENTS[index].id;
    window.location.href = `/events/${eventId}`;
  };

  const currentEvent = EVENTS[currentSlide];

  // Split intelligent du titre en 2-3 lignes equilibrees
  const getTitleLines = (title: string) => {
    const words = title.split(' ');
    if (words.length <= 2) return [title.toUpperCase()];
    if (words.length === 3) return [words[0].toUpperCase(), words.slice(1).join(' ').toUpperCase()];
    return [words[0].toUpperCase(), words.slice(1, -1).join(' ').toUpperCase(), words.slice(-1)[0].toUpperCase()];
  };

  const titleLines = getTitleLines(currentEvent.name);

  return (
    <>
      <main className="bg-black text-white">
      <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
        {/* Conteneur principal centré */}
        <div className="relative h-full flex items-center justify-center px-6 md:px-12">
          {/* Layout avec overlay du texte sur l'image */}
          <div className="relative z-10 w-full max-w-6xl flex items-center justify-center h-full">
            {/* Numero de slide grand et transparent DERRIÈRE l'image - En haut à gauche */}
            <div className="absolute left-28 -top-2 z-0 pointer-events-none">
              <div 
                className="text-[140px] md:text-[200px] font-semibold leading-none text-white/20 whitespace-nowrap carousel-slide-number" 
                key={`number-${currentSlide}`}
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {currentEvent.slideNumber}
              </div>
            </div>

            {/* Image au centre - Plus grande */}
            <div className="absolute inset-0 flex justify-end items-center pr-16 z-5">
              <div
                className="relative w-full md:w-[850px] h-[350px] md:h-[420px] overflow-hidden rounded-lg border border-white/10 cursor-pointer group transition-all duration-500 hover:shadow-2xl carousel-image"
                key={`image-${currentSlide}`}
                onClick={() => goToEvent(currentSlide)}
              >
                <Image
                  src={currentEvent.image}
                  alt={currentEvent.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  priority
                />
                {/* Gradient fade de gauche à droite pour lisibilité du texte */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent pointer-events-none rounded-lg" />
              </div>
            </div>

            {/* Texte overlay - À gauche de l'image */}
            <div className="relative z-20 w-full flex items-center cursor-pointer" onClick={() => goToEvent(currentSlide)}>
              <div className="w-2/5 pr-12 flex flex-col justify-center space-y-4">
                {/* Titre */}
                <div 
                  className="space-y-1 carousel-text-title"
                  key={`title-${currentSlide}`}
                >
                  {titleLines.map((line, idx) => (
                    <h2
                      key={idx}
                      className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight uppercase whitespace-nowrap hover:opacity-80 transition-opacity"
                      style={{ fontFamily: "'Jost', sans-serif" }}
                    >
                      {line}
                    </h2>
                  ))}
                </div>

                {/* Date */}
                <div 
                  className="space-y-1 pt-2 carousel-text-date hover:opacity-80 transition-opacity"
                  key={`date-${currentSlide}`}
                >
                  <p 
                    className="tracking-widest uppercase text-gray-500" 
                    style={{ fontFamily: "'Jost', sans-serif", fontSize: '18px' }}
                  >
                    Unique date suisse
                  </p>
                  <p 
                    className="text-gray-400 font-semibold" 
                    style={{ fontFamily: "'Jost', sans-serif", fontSize: '24px' }}
                  >
                    {currentEvent.date}
                  </p>
                </div>

                {/* Navigation dots - Sous la date */}
                <div 
                  className="flex gap-2 pt-4 carousel-text-dots"
                  key={`dots-${currentSlide}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {EVENTS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      style={{
                        backgroundColor: index === currentSlide ? '#860000' : '#4b5563',
                        width: index === currentSlide ? '16px' : '8px',
                        height: '2px',
                        transition: 'all 300ms',
                      }}
                      className="hover:bg-gray-400"
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              {/* Espace pour l'image */}
              <div className="w-3/5" />
            </div>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}