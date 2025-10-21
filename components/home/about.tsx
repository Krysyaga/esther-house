import { Building2, Users, Award } from "lucide-react";

export function About() {
  const features = [
    {
      icon: Building2,
      title: "Un Lieu Unique",
      description: "Architecture remarquable et ambiance chaleureuse pour tous.",
    },
    {
      icon: Users,
      title: "Communauté Active",
      description: "Une communauté passionnée d'artistes et de spectateurs.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Programmation de qualité et événements mémorables.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              À Propos d'Esther House
            </h2>
            <p className="text-muted-foreground mb-4">
              Depuis sa fondation, Esther House s'est établie comme un centre
              culturel incontournable, dédié à la promotion des arts, de la
              musique et du théâtre.
            </p>
            <p className="text-muted-foreground mb-8">
              Notre mission est de créer un espace inclusif où la culture peut
              s'épanouir et où chacun peut découvrir la richesse artistique.
            </p>
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90">
              En Savoir Plus
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
