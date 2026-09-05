# TabBar, Variante: Compound Components mit Context

## Dateien

- `src/shared/TabBar.tsx`
- `src/App.tsx`

## Aufgabe

Die `TabBar` aus dem Startpunkt reicht dieselben zwei Properties an jeden `Tab` und jedes `Panel` durch. Das räumst du jetzt weg: Die `TabBar` verwaltet den aktiven Reiter selbst und legt ihn in einen **Context**, `Tab` und `Panel` holen sich die Werte von dort.

Weil die drei Komponenten nur zusammen funktionieren und über den Context miteinander reden, nennt man das Muster **Compound Components**. Aus dem `<select>` und seinen `<option>`-Elementen kennst du dieselbe Idee aus HTML.

So soll `App.tsx` am Ende aussehen:

```tsx
<TabBar>
  <Tab tabId={"list"}>Pflanzen</Tab>
  <Panel tabId={"list"}>
    <PlantList />
  </Panel>
</TabBar>
```

## Schritte

1. Du baust `src/shared/TabBar.tsx` um. Alle drei Komponenten darin ändern sich, und der Rest der Anwendung merkt davon nichts.
2. Beschreib, was im Context steht, und leg ihn an:

   ```tsx
   type TabBarContextValue = {
     activeTabId: string;
     onTabChange: (tabId: string) => void;
   };

   const TabBarContext = createContext<TabBarContextValue | null>(null);
   ```

   Der Startwert `null` heißt: Außerhalb einer `TabBar` gibt es keinen aktiven Reiter. Das ist ehrlicher als ein erfundener Wert wie `""`, denn davon merkt niemand etwas, wenn der Provider fehlt.
3. Bau `TabBar` um. Sie hält jetzt den State, den bisher `App` gehalten hat, und packt ihre Kinder in den Context:

   ```tsx
   <TabBarContext value={{ activeTabId, onTabChange: setActiveTabId }}>
     <div className={"TabBar"}>{children}</div>
   </TabBarContext>
   ```

   `children` ist wieder eine normale `ReactNode`. Seit React 19 ist der Context selbst der Provider, die ältere Form `<TabBarContext.Provider value={...}>` funktioniert weiterhin und steht in den meisten Beispielen im Netz.
4. Schreib einen kleinen Hook, den `Tab` und `Panel` benutzen. Er wird nicht exportiert, denn er ist nur für diese Datei:

   ```tsx
   function useTabBarContext() {
     const context = useContext(TabBarContext);

     if (context === null) {
       throw new Error("Tab and Panel must be used inside a TabBar");
     }

     return context;
   }
   ```

   Dafür lohnt sich der Aufwand mit `null`: Ohne die Prüfung bekämst du weiter unten ein `Cannot read properties of null`, und die Ursache stünde nirgends. Nach der Prüfung weiß auch TypeScript, dass der Wert nicht `null` ist, und niemand braucht ein `?.`.
5. Bau `Tab` und `Panel`. Ihre Properties schrumpfen auf `tabId` und `children`, die restlichen Werte kommen aus `useTabBarContext()`.
6. Stell `src/App.tsx` um: `useState` und die beiden durchgereichten Properties fallen weg, jeder `Tab` und jedes `Panel` behält allein seine `tabId`. Sichtbar ändert sich nichts.
7. 🧐 Bau absichtlich einen Fehler: Zieh in `App.tsx` einen `<Tab>` aus der `<TabBar>` heraus. Die Seite bleibt leer, denn ein Fehler beim Rendern reißt den ganzen Baum ab. Deine Meldung steht in der Konsole, und React rät dazu, eine Error Boundary einzubauen. Mach die Änderung danach rückgängig.
8. 🧐 Optional (wenn du noch Zeit hast): `App.tsx` ist kürzer geworden, aber etwas ist auch verlorengegangen. Woran siehst du beim Lesen von `<Tab tabId={"list"}>`, woher die Komponente ihre Werte bekommt? Und was passiert, wenn du zwei `TabBar` ineinander verschachtelst?

## Material

- `createContext`: https://react.dev/reference/react/createContext
- `useContext`: https://react.dev/reference/react/useContext
- Daten tief durchreichen mit Context: https://react.dev/learn/passing-data-deeply-with-context
- Context als Provider (React 19): https://react.dev/blog/2024/12/05/react-19#context-as-a-provider

## 🧐 Zum Nachlesen

### Warum der Hook und nicht `useContext` direkt

`Tab` könnte auch selbst `useContext(TabBarContext)` aufrufen. Der eigene Hook nimmt der Komponente aber drei Dinge ab, und zwar an einer Stelle statt an jeder: die Prüfung auf `null` samt einer Meldung, die den Namen der Komponente nennt, die Verengung des Typs und die Freiheit, den Context später anders zu füllen. Wenn du in einer fremden Codebasis `useDialogContext` oder `useFormField` siehst, steckt fast immer dieses Muster dahinter.

### So sehen es auch die Bibliotheken

Mit dieser `TabBar` arbeiten wir bis zum Ende weiter, denn so bauen die Komponentenbibliotheken ihre zusammengesetzten Komponenten. Radix, Headless UI und Base UI sehen von außen aus wie unsere `TabBar`, und die Bibliotheken mit einem headless Hook (TanStack Table, Downshift) benutzen innen ebenfalls Context, sobald mehrere Komponenten beteiligt sind.

### Was Context nicht ist

Context löst das Durchreichen, nicht das Verwalten. Er ist ein Transportweg und kein Speicher: Der Zustand liegt weiterhin in einer Komponente, hier in `TabBar`.

Daraus folgt eine Grenze, die man erst bei größeren Anwendungen merkt. Ändert sich der Wert im Context, rendert jede Komponente neu, die ihn liest, auch die, die nur ein Feld daraus benutzt. Bei dieser TabBar fällt das nicht auf, bei einem Context mit dem halben Anwendungszustand schon. Das schauen wir uns als Nächstes an.
