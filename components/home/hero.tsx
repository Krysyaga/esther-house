export function Hero() {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/10 to-transparent">
      <div className="container text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Bienvenue à Esther House
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Découvrez un lieu unique dédié à la culture, à l'art et aux événements
          mémorables.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90">
            Découvrir les Événements
          </button>
          <button className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10">
            En Savoir Plus
          </button>
        </div>
      </div>
    </section>
  );
}
