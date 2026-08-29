# Vorführung: der Effekt, der zu viel weiß

Der Ablauf für `WateringNotifications.tsx`, bevor `useEffectEvent` hineinkommt.

## Ausgangslage

ESLint warnt, `soundEnabled` fehle im Dependency-Array.

## Stufe 1: die Warnung stehen lassen

Häkchen bei „Ton bei neuer Meldung" wegnehmen. Die Toasts zeigen weiterhin 🔔,
der Ton spielt weiter. Der Effekt kennt nur den Wert von damals, und das ist
eine stale closure.

## Stufe 2: der Warnung folgen

Dependencies auf `[location, updatesEnabled, soundEnabled]` erweitern. Häkchen
umlegen, dann erscheint in der Konsole

```
🔌 Verbindung geschlossen: bedroom
🔌 Verbindung geöffnet: bedroom
```

und der Drei-Sekunden-Takt springt sichtbar zurück auf Anfang. Eine
Anzeige-Einstellung reißt die Serververbindung ab. Ein Rendern zu viel ist
ärgerlich, ein Effekt, der zu oft läuft, ist ein Fehler.

Zum Gegenbeispiel daneben: Das Häkchen bei „Meldungen empfangen" **soll** die
Verbindung schließen, und `updatesEnabled` steht deshalb zu Recht in den
Dependencies.

## Frage in die Runde: Hilft hier `useCallback`?

Nein. Eine mit `useCallback` stabilisierte Funktion bräuchte `soundEnabled` in
ihren eigenen Dependencies und wäre bei jedem Umschalten wieder neu. Das
Problem wandert nur eine Ebene tiefer.

## Frage: Und wenn `soundEnabled` in einen Ref kommt?

Funktioniert, baut aber von Hand nach, was `useEffectEvent` kann, ohne
Lint-Unterstützung und ohne dass jemand erkennt, warum.

## Überleitung

Gebraucht wird ein Wert, der aktuell gelesen wird, ohne reaktiv zu sein. Genau
dafür gibt es `useEffectEvent`.
