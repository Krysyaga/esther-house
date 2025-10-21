import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galerie - Esther House",
  description: "Découvrez la galerie photos et vidéos de nos événements.",
};

export default function GalleryPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">Galerie</h1>
      <p className="text-gray-600">Page en construction...</p>
    </div>
  );
}
