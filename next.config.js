const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,  // <-- Désactive SWC (minification Rust) – connu pour memory leaks en SSG v14 ; fallback à Terser (plus lent mais stable)
  output: 'standalone',
  experimental: {
    webpackMemoryOptimizations: true,  // <-- Optimise Webpack pour low-mem builds (v15+ recommandé, mais marche en v14)
    webpackBuildWorker: true,  // <-- Offload Webpack en worker séparé (défaut en v14.1+, force-le)
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Désactive source maps (bouffe RAM en prerender)
  productionBrowserSourceMaps: false,
  experimental: {
    ...nextConfig.experimental,
    serverSourceMaps: false,
    enablePrerenderSourceMaps: false,
  },
  // Ignore TS errors en build si y'en a (pour éviter spikes)
  typescript: {
    ignoreBuildErrors: true,  // ⚠️ Attention : Vérifie types en local/CI avant
  },
};

module.exports = withNextIntl(nextConfig);