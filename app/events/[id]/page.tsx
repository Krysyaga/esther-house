import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Événement - Esther House",
  description: "Détails de l'événement et réservation.",
};

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-4">Détail Événement</h1>
      <p className="text-gray-600">ID: {(params as any).id}</p>
      <p className="text-gray-600">Page en construction...</p>
    </div>
  );
}
