"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

interface UpcomingEvent {
  id: number;
  name: string;
  artist: string;
  date: string;
  image: string;
  category: "concert" | "theatre" | "exposition" | "autre";
}

const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: 1,
    name: "Puma Blue",
    artist: "Concert",
    date: "08 JUL 2026\nUMLE VENISSE",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&h=600&fit=crop",
    category: "concert",
  },
  {
    id: 2,
    name: "Yvvns",
    artist: "Concert",
    date: "13.03.2026\nUMLE VENISSE",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop",
    category: "concert",
  },
  {
    id: 3,
    name: "Del Water Gap",
    artist: "Concert",
    date: "22.04.2026\nUMLE VENISSE",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=600&fit=crop",
    category: "concert",
  },
  {
    id: 4,
    name: "Perceval",
    artist: "Live",
    date: "06.03.2026\nUMLE VENISSE",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=600&fit=crop",
    category: "theatre",
  },
  {
    id: 5,
    name: "Yuston XIII",
    artist: "Concert",
    date: "07.03.2026\nUMLE VENISSE",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=600&fit=crop",
    category: "concert",
  },
];

export function UpcomingEventsStacked() {
  const t = useTranslations();
  const locale = useLocale();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Intersection Observer pour déclencher l'animation à l'arrivée dans la vue
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Observer une seule fois
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Déclencher quand 10% de la section est visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <section className="relative w-full bg-black text-white py-20 md:py-32 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-4 leading-tight"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {t("upcoming.title")}
          </h2>
          <div className="w-16 h-1" style={{ backgroundColor: "var(--brand-accent)" }} />
        </div>

        {/* Damier masonry avec chevauchement */}
        <div 
          ref={containerRef}
          className="relative upcoming-events-container"
          style={{
            height: isMobile ? `${UPCOMING_EVENTS.length * 140 + 180}px` : "600px"
          }}
        >
          {UPCOMING_EVENTS.map((event, index) => {
            // Positions responsive - cascade horizontale sur desktop, verticale sur mobile
            let positions;
            
            if (isMobile) {
              // Mobile: cascade verticale avec plus d'espacement
              positions = [
                { top: `${index * 140}px`, left: "20%", width: "60%", rotation: "0deg", zIndex: 5 },
                { top: `${index * 140}px`, left: "0%", width: "60%", rotation: "0deg", zIndex: 5 },
                { top: `${index * 140}px`, left: "20%", width: "60%", rotation: "0deg", zIndex: 5 },
                { top: `${index * 140}px`, left: "40%", width: "60%", rotation: "0deg", zIndex: 6 },
                { top: `${index * 140}px`, left: "20%", width: "60%", rotation: "0deg", zIndex: 6 },
                { top: `${index * 140}px`, left: "0%", width: "60%", rotation: "0deg", zIndex: 7 },
              ];
            } else {
              // Desktop: cascade horizontale avec espacement consistent
              positions = [
                { top: "0%", left: "0%", width: "30%", rotation: "0deg", zIndex: 5 },
                { top: "40%", left: "18%", width: "30%", rotation: "0deg", zIndex: 5 },
                { top: "5%", left: "36%", width: "30%", rotation: "0deg", zIndex: 6 },
                { top: "45%", left: "54%", width: "30%", rotation: "0deg", zIndex: 6 },
                { top: "10%", left: "72%", width: "30%", rotation: "0deg", zIndex: 7 },
              ];
            }

            const pos = positions[index % positions.length];

            return (
              <div
                key={event.id}
                data-index={index}
                className={`absolute cursor-pointer transition-all duration-300 ${
                  isVisible ? `upcoming-card-animate upcoming-card-animate-${index}` : ""
                }`}
                style={{
                  top: pos.top,
                  left: pos.left,
                  width: pos.width,
                  aspectRatio: "3/4",
                  transform: `rotate(${pos.rotation}) ${
                    hoveredCard === event.id ? "scale(1.05) translateZ(0)" : "scale(1)"
                  }`,
                  zIndex: hoveredCard === event.id ? 100 : pos.zIndex,
                }}
                onMouseEnter={() => setHoveredCard(event.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Carte */}
                <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/20 shadow-2xl group">
                  {/* Image de fond */}
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Gradient overlay pour le texte */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />

                  {/* Contenu texte - overlay en haut et bas */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-5">
                    {/* Titre en haut à gauche - vertical */}
                    <div className="flex flex-col">
                      <h3
                        className="text-xs md:text-lg font-bold uppercase tracking-widest leading-tight writing-vertical-lr"
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                          transform: "rotate(180deg)",
                          color: "white",
                        }}
                      >
                        {event.name}
                      </h3>
                    </div>

                    {/* Infos en bas */}
                    <div className="space-y-2">
                      <p
                        className="text-xs uppercase tracking-wider text-gray-300"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        {event.artist}
                      </p>
                      <p
                        className="text-xs uppercase tracking-widest text-gray-400 whitespace-pre-line leading-tight"
                        style={{ fontFamily: "'Jost', sans-serif" }}
                      >
                        {event.date}
                      </p>
                    </div>
                  </div>

                  {/* Glow effect on hover */}
                  <div
                    className="absolute inset-0 rounded-lg transition-all duration-300 pointer-events-none"
                    style={{
                      boxShadow:
                        hoveredCard === event.id
                          ? "inset 0 0 30px rgba(220, 38, 38, 0.3), 0 0 30px rgba(220, 38, 38, 0.2)"
                          : "inset 0 0 0px transparent",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-12 md:mt-16 lg:mt-24 pt-6 md:pt-8">
          <Link
            href={`/${locale}/events`}
            className="header-link text-lg md:text-xl font-bold uppercase tracking-wider transition-all duration-300"
            style={{ 
              fontFamily: "'Jost', sans-serif",
              color: "var(--brand-accent)"
            }}
          >
            {t("upcoming.view_all")}
          </Link>
        </div>
      </div>
    </section>
  );
}
