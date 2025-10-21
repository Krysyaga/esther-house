import { CalendarDays, MapPin } from "lucide-react";

export function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: "Concert Jazz",
      date: "15 novembre 2024",
      location: "Salle principale",
      image: "/placeholder.jpg",
    },
    {
      id: 2,
      title: "Théâtre Classique",
      date: "20 novembre 2024",
      location: "Salle principale",
      image: "/placeholder.jpg",
    },
    {
      id: 3,
      title: "Exposition Photo",
      date: "25 novembre 2024",
      location: "Galerie",
      image: "/placeholder.jpg",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Événements à Venir
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre programmation culturelle riche et variée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-muted" />
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <CalendarDays className="h-4 w-4" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </div>
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90">
                  Réserver
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10">
            Voir Tous les Événements
          </button>
        </div>
      </div>
    </section>
  );
}
