"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

// 🔎 Erzählen: die Datei heißt error.tsx und liegt neben page.tsx. Mehr
//    braucht es nicht, Next hängt die Boundary selbst darum.
export default function ErrorPage({ error, retry }: ErrorPageProps) {
  return (
    <div className={"flex flex-col items-start gap-y-4"}>
      <h2 className={"text-2xl font-bold"}>
        Die Pflanzen konnten nicht geladen werden
      </h2>
      {/* 🔎 Erzählen: im Produktionsbau steht hier ein anonymer Text, damit
          nichts vom Server nach außen dringt. */}
      <p className={"error-message"}>{error.message}</p>
      <button type={"button"} className={"secondary"} onClick={retry}>
        Erneut versuchen
      </button>
    </div>
  );
}
