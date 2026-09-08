/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";

const enableReactCompiler = false;

const reactPluginOptions = enableReactCompiler
  ? { babel: { plugins: ["babel-plugin-react-compiler"] } }
  : {};

// https://vite.dev/config/
export default defineConfig({
  // Vite bündelt eine Abhängigkeit erst vor, wenn sie zum ersten Mal importiert
  // wird, und lädt die Seite danach neu. Mitten in einer Vorführung wäre der
  // Zustand der Anwendung damit weg. Diese Liste nennt deshalb alles, was im
  // Laufe des Workshops noch dazukommt, damit der Devserver es beim Start
  // erledigt.
  optimizeDeps: {
    include: [
      "@hookform/devtools",
      "@hookform/resolvers/zod",
      "@tanstack/react-query",
      "@tanstack/react-query-devtools",
      "@tanstack/react-router",
      "clsx",
      "dayjs",
      "immer",
      "react",
      "react-dom/client",
      "react-error-boundary",
      "react-hook-form",
      "tailwind-merge",
      "zod",
      "zustand",
    ],
  },
  plugins: [
    // https://tailwindcss.com/docs/installation/using-vite
    tailwindcss(),
    tanstackRouter({
      target: "react",
      // Ohne die Aufteilung bleibt je Route eine Datei, und die ist im
      // Workshop das, was wir lesen und zeigen.
      autoCodeSplitting: false,
    }),
    react(reactPluginOptions),
  ],
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["src/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: ["src/**/*.{browsertest,spec}.?(c|m)[jt]s?(x)"],
          browser: {
            enabled: true,
            provider: playwright(),
            // https://vitest.dev/guide/browser/playwright
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
