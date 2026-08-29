import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,

  // Hält die Anwendung mit der SPA gleich, die den Compiler ebenfalls an hat.
  // Braucht "babel-plugin-react-compiler" als devDependency.
  reactCompiler: true,

  // Ohne diese Zeile laufen die Effekte im Devserver doppelt und die
  // Render-Zähler zählen doppelt. Sie stehen neben denen der SPA, die
  // StrictMode aus hat, und müssen dieselbe Zahl zeigen.
  reactStrictMode: false,

  // Nimmt die Blase unten links weg, die sonst in jedem Screenshot über der
  // Anwendung liegt und die Route als statisch oder dynamisch beschriftet.
  devIndicators: false,

  // Schreibt jeden fetch des Servers mit vollständiger Adresse ins Terminal,
  // als Gegenprobe zum leeren Network-Tab im Browser.
  logging: { fetches: { fullUrl: true } },
};

export default nextConfig;
