import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

import { HttpError } from "../shared/HttpError.ts";

type PlantErrorBoundaryProps = {
  children: ReactNode;
};

export default function PlantErrorBoundary({
  children,
}: PlantErrorBoundaryProps) {
  // 🔎 Zeigen: onReset weglassen, dann tut der Knopf im Fallback nichts. Der
  //    Fehler steht im Query-Cache, und die Query wirft ihn sofort wieder.
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      onError={(error) => console.error("[PlantErrorBoundary]", error)}
      FallbackComponent={PlantErrorFallback}
    >
      {children}
    </ErrorBoundary>
  );
}

function PlantErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className={"flex flex-col items-start gap-y-4"}>
      <h2 className={"text-2xl font-bold"}>
        Die Pflanzen konnten nicht geladen werden
      </h2>
      <p className={"error-message"}>{describeError(error)}</p>
      <button
        type={"button"}
        className={"secondary"}
        onClick={resetErrorBoundary}
      >
        Erneut versuchen
      </button>
    </div>
  );
}

// 🔎 Erzählen: error ist ein unknown, denn die Boundary fängt alles. Ohne
//    HttpError bliebe nur der Meldungstext, und daran hinge die Oberfläche.
function describeError(error: unknown) {
  if (error instanceof HttpError) {
    return error.status === 404
      ? "Das Backend kennt diese Adresse nicht (404)."
      : `Das Backend hat mit dem Status ${error.status} geantwortet.`;
  }

  return error instanceof Error ? error.message : "Unbekannter Fehler";
}
