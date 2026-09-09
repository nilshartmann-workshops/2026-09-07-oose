import { ReactNode } from "react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

type PlantErrorBoundaryProps = {
  children: ReactNode;
};

export default function PlantErrorBoundary({
                                             children,
                                           }: PlantErrorBoundaryProps) {
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
      <p className={"error-message"}>{error?.toString()}</p>
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
