# Rendern, Virtual DOM und `memo`

## Dateien

- `src/App.tsx` (hier hängst du die Spielwiese ein)

Angeschaut werden `src/spielwiese/RenderSpielwiese.tsx` (eine Eltern-Komponente mit zwei States), `Child.tsx` (eine Kind-Komponente, die ihre Renders mitzählt) und `MemoChild.tsx` (dasselbe Kind in `memo()`).

## Vorbereitung

- Starte im `workspace` den Devserver: `npm run dev`
- Öffne die Browser-Konsole und lass sie geöffnet. Jede Komponente der Spielwiese schreibt beim Rendern eine Zeile dorthin, und dieselbe Zahl steht auch unter der Komponente auf der Seite. Mehr brauchst du für diese Übung nicht.

## Aufgabe

Du hängst die Spielwiese ein und beobachtest, wann eine Komponente rendert und wann sich dabei wirklich etwas im DOM ändert. Danach siehst du, was `memo` daran ändert.

## Schritte

1. Trag in `src/App.tsx` einen dritten `Tab` "Rendern (Spielwiese)" mit eigener `tabId` und das passende `Panel` ein, wie bei den beiden davor. Ins Panel kommt die `RenderSpielwiese` (Default-Export).
2. Lies `RenderSpielwiese.tsx` und `Child.tsx`. Zwei Stellen sind Absicht: Der State `text` wird nirgends benutzt, und der Render-Zähler steckt in einem `useRef`, weil ein `useState` hier eine Endlosschleife wäre. Daher auch das `eslint-disable` ganz oben.
3. Beobachte die Render-Zähler **und** die Konsole:
   - Klick auf den Zähler-Button: Rendert auch "Kind B", dessen `value` fest verdrahtet ist?
   - Tipp ins Textfeld: Warum rendern die Kinder, obwohl `text` nirgends benutzt wird?
   - Wechsel den Reiter und komm zurück: Warum fangen die Zähler wieder bei 1 an?
4. Wechsel in den **Elements**-Tab der Browser-Werkzeuge, stell ihn auf die Spielwiese und klick mehrfach auf den Zähler. Beide Kinder haben gerendert. Wird auch beide Male das `div` neu gebaut, oder blinkt nur der Textknoten mit der Zahl?
5. Das **Memo-Kind** unterscheidet sich nur in der letzten Zeile von `MemoChild.tsx`: Der Export ist in `memo(...)` eingepackt. Tipp ins Textfeld, klick auf den Zähler, sein Zähler bleibt stehen. React vergleicht vor dem Rendern die Properties mit den alten.
6. 🧐 Optional (wenn du noch Zeit hast): Hier steht ein zusätzliches Konzept im Code, damit eine Komponente nicht rendert, deren Rendern ungefähr nichts kostet. Woran würdest du festmachen, ob sich das lohnt?

## Material

- Render und Commit: https://react.dev/learn/render-and-commit
- `useRef`: https://react.dev/reference/react/useRef
- `memo`, insbesondere "Should you add memo everywhere?": https://react.dev/reference/react/memo#should-you-add-memo-everywhere
- React Developer Tools: https://react.dev/learn/react-developer-tools

## 🧐 Zum Nachlesen

### Rendern und DOM sind zwei verschiedene Dinge

Eine Komponente rendern heißt: React ruft ihre Funktion noch einmal auf. Heraus kommt eine Beschreibung aus einfachen JavaScript-Objekten, der Virtual DOM. React vergleicht sie mit der vorherigen und ändert im Browser nur den Unterschied. Beim Klick auf den Zähler rendern deshalb beide Kinder, im DOM ändert sich aber nur eine Zahl. Die Funktion erneut aufzurufen ist billig, Layout und Anzeige neu zu berechnen ist teuer.

Ändert sich der State einer Komponente, rendert React sie und alles darunter gleich mit, unabhängig von deren Properties.

### Die React Developer Tools

Die Render-Zähler in dieser Spielwiese sind selbst gebaut, damit die Übung ohne Zusatzwerkzeug läuft. In einem echten Projekt nimmt man dafür die React Developer Tools, eine Erweiterung für Chrome und Firefox. Sie bringen zwei Dinge mit, die hier passen:

- Unter ⚙️ steht **"Highlight updates when components render"**. Damit blinkt jede Komponente auf, sobald sie rendert, und man sieht das Ausbreiten durch den Baum, ohne eine Zeile Code zu schreiben.
- Der **Profiler** zeichnet auf, welche Komponente wie lange gerendert hat und warum. Das ist das Werkzeug für die Frage, ob sich ein `memo` lohnt.

Installiert ist die Erweiterung schnell, nötig ist sie für den Workshop nicht. Wer sie hat, probiert Schritt 3 gern noch einmal mit eingeschaltetem Highlighting.

### Wann `memo` überhaupt etwas bringt

`memo` hilft nur, wenn alle diese Bedingungen erfüllt sind:

1. Die Eltern-Komponente rendert neu und erzeugt dabei ein neues Element für dieses Kind.
2. Die Properties sind im Sinne von `===` unverändert. Eine Inline-Funktion oder ein Literal als Property macht `memo` auf der Stelle wirkungslos.
3. Die Komponente bezieht ihre Daten über Properties. Es gibt einen zweiten Weg, und der geht an `memo` vorbei.

Schon die erste Bedingung ist seltener erfüllt, als man denkt. React ist meistens schnell genug, und `memo` kostet selbst etwas. Erst messen, dann optimieren, und messen kannst du mit dem Profiler in den React DevTools.
