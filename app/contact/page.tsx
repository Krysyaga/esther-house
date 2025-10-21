import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Esther House",
  description: "Contactez-nous pour toute demande ou information.",
};

export default function ContactPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">Contact</h1>
      <p className="text-gray-600">Page en construction...</p>
    </div>
  );
}
