// Dynamic route - doesn't render during SSG (prevents SIGABRT)
export const dynamic = 'force-dynamic';

export default function ErrorTest() {
  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Test Error Page</h1>
        <p className="text-gray-400">
          Cette page est en mode dynamic et ne s&apos;affiche que côté client.
        </p>
        <p className="text-sm text-gray-500">
          Le rendu SSG n&apos;essaiera pas de la générer, donc pas de crash SIGABRT.
        </p>
      </div>
    </div>
  );
}
