import { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos - Esther House",
  description: "Découvrez l'histoire et les valeurs d'Esther House.",
};

export default function AboutPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">À Propos</h1>
      <p className="text-gray-600">Page en construction...</p>
    </div>
  );
}
