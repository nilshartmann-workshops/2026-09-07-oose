import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () => {
  // Diese QueryClient-Einstellungen sind nur für unseren Workshop
  // gewählt.
  // Für eine "echte" Anwendung können auch die Default-Einstellungen
  // des QueryClients verwendet werden (s. https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
  // aber die finde ich zum Lernen zu verwirrend, deswegen habe ich das Verhalten vereinfacht
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: true, // true ist der Default
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: false,
        // Der Default sind drei Versuche mit wachsender Pause dazwischen. Ein
        // Fehler wäre damit erst nach mehreren Sekunden zu sehen, und beim
        // Lernen will man ihn sofort sehen.
        retry: false,
      },
    },
  });
};

/**
 * Die Instanz, die die Anwendung benutzt. Tests bauen sich mit
 * `createQueryClient` eine eigene, damit sie sich keinen Cache teilen.
 */
export const queryClient = createQueryClient();
