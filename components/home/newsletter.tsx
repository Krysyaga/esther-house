"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Placeholder for newsletter signup logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("Merci de vous être inscrit!");
      setEmail("");
    } catch {
      setMessage("Une erreur s&apos;est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container max-w-2xl">
        <div className="text-center mb-8">
          <Mail className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Restez Informé
          </h2>
          <p className="text-lg opacity-90">
            Inscrivez-vous à notre newsletter pour recevoir les meilleures
            actualités d&apos;Esther House.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-white/90 disabled:opacity-50"
          >
            {loading ? "..." : "S&apos;inscrire"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm opacity-90">{message}</p>
        )}
      </div>
    </section>
  );
}
