# Das Beet: der Compiler zum Anfassen

Ablauf für die Vorführung. Keine Übung, kein Text für die Teilnehmer.

## Vorbereitung

Der Compiler ist im vorigen Schritt eingeschaltet worden, `enableReactCompiler` steht in `vite.config.ts` auf `true`. Der Reiter heißt "Compiler (Spielwiese)".

In der Zeile über dem Beet steht ein rotes "Compiler: aus". So fängt die Vorführung an, denn in `Beet` steht die Direktive `"use no memo"`, und der Compiler lässt die Komponente deshalb aus. Die Anzeige liest am Rumpf von `Beet` ab, ob er sie umgeschrieben hat, und wechselt auf ein grünes "Compiler: an", sobald die Zeile auskommentiert ist. Sie nimmt einem bei jedem Umschalten die Frage ab, ob die Änderung schon angekommen ist.

Beet zurücksetzen, bevor es losgeht, sonst stehen noch die nassen Pflanzen vom Ausprobieren da. Beim Wechsel auf einen anderen Reiter und zurück passiert dasselbe von allein, und der Zähler fängt dann ebenfalls bei null an. Zwischendurch setzt ihn der Knopf "Zähler zurücksetzen" auf null, ohne das Beet anzufassen.

Der Regler steht auf dem Wert, der zuletzt eingestellt war, denn er liegt im localStorage. Das Ein- und Ausschalten des Compilers verlangt ein Neuladen der Seite, und die Einstellung übersteht das.

## Stufe 1: nur mit der Maus über das Beet fahren

Die Maustaste bleibt oben, die Kanne wandert einmal quer über das Beet. Es wird keine Pflanze nass, die Kanne hängt trotzdem an der Maus hinterher, und der Zähler springt in die Zehntausende.

Die Frage in die Runde: 576 Pflanzen stehen im Beet, keine davon hat sich geändert, und `Pflanze` steckt in `memo()`. Warum rendert das ganze Beet bei jeder Mausbewegung mit?

Jetzt in `Beet` die Zeile `"use no memo";` auskommentieren. Der Devserver tauscht die Datei sofort aus, ein Neustart ist nicht nötig, und die Anzeige springt auf "Compiler: an".

Dieselbe Bewegung noch einmal. Die Kanne klebt an der Maus, und der Zähler bleibt auf 0. Keine einzige Pflanze rendert mit.

Gemessen im Container am 06.09.2026, 90 Mausbewegungen quer über das Beet, Maustaste oben:

| | Pflanzen-Renders | Dauer der Bewegung | längste Pause |
|---|---|---|---|
| ohne Compiler, 1500 Runden | 51840 | 2,9 s | 50 ms |
| ohne Compiler, 5500 Runden | 51840 | 8,5 s | 108 ms |
| mit Compiler, 1500 Runden | 0 | 1,5 s | 24 ms |
| mit Compiler, 5500 Runden | 0 | 1,5 s | 39 ms |

51840 sind 576 je Bewegung, also das ganze Beet, jedes Mal.

**Läuft es auf deinem Rechner auch ohne Compiler flüssig**, zieh den Regler "Arbeit je Pflanze" nach rechts. Er stellt ein, wie viele Runden eine einzelne Pflanze beim Rendern rechnet, und die Zahl daneben zeigt den eingestellten Wert. Mit Compiler ändert der Regler an der Zeit nichts, denn es rechnet ja keine Pflanze. Er macht nicht die Anwendung langsam, sondern allein die Seite ohne Compiler.

## Stufe 2: gießen

Der Compiler bleibt an, die Zeile also auskommentiert. Beet und Zähler zurücksetzen.

Gießkanne bei gedrückter Maustaste quer über das Beet ziehen. Die Spur wird nass, es läuft flüssig, und der Zähler steht danach auf der Zahl der gegossenen Pflanzen. Diesmal rendert also etwas, und zwar genau so viel, wie sich geändert hat.

Wer den Gegensatz noch einmal zeigen will, kommentiert die Zeile wieder ein und zieht dieselbe Spur. Das Ziehen hakt, und der Zähler zeigt wieder das ganze Beet je Bewegung.

Gemessen im Container am 05.09.2026, 90 Mausbewegungen quer über das Beet, Regler auf dem Startwert:

| | Pflanzen-Renders | Dauer der Geste | längste Pause |
|---|---|---|---|
| ohne Compiler | 48960 | 4,5 s | 40 bis 41 ms |
| mit Compiler | 78 | 1,5 s | 20 bis 27 ms |

78 ist genau die Zahl der gegossenen Pflanzen.

## Was zu erzählen ist

Der Compiler arbeitet hier auf zwei Stufen, und die beiden Stufen sind genau die beiden Vorführungen von oben.

Beim reinen Drüberfahren ändert sich allein die Position der Kanne. `gegossen` und `runden` bleiben, wie sie waren, und deshalb gibt der Compiler dieselbe Liste von Pflanzen-Elementen zurück wie beim Render davor. React sieht dieselben Elemente und lässt den ganzen Teilbaum aus. Es rendert nur die Gießkanne, und der Zähler bleibt auf 0.

Beim Gießen ändert sich `gegossen`, die Liste wird also neu gebaut. Jetzt zählt die zweite Stufe, nämlich `onGiessen={giessen}`. `giessen` ist eine Funktion, die im Rumpf von `Beet` steht, und mit Compiler bleibt sie dieselbe. `Pflanze` ist in `memo()` gewickelt, `memo` vergleicht die Properties, und ungleich ist nur `gegossen` bei der einen Pflanze, die gerade nass wird. Also rendert nur sie.

Ohne Compiler fällt beides weg. Die Liste entsteht bei jedem Render neu, und `giessen` ist bei jedem Render eine andere Funktion. `memo` vergleicht, findet eine neue Funktion und rendert die Pflanze mit. Das gilt für jede der 576, bei jeder Mausbewegung.

Das ist derselbe Satz wie auf der Render-Spielwiese, nur 576-fach: Von Hand memoisieren muss man nicht mehr.

Zwei Stellen im Code lohnen einen Blick, wenn jemand fragt:

- `zieht` ist ein Ref und kein State. Aus einem State hinge `giessen` daran, und die Funktion wäre bei jedem Druck der Maustaste eine andere. Dann rendert das ganze Beet, auch mit Compiler, und zwar genau zweimal je Geste.
- `arbeit()` ist die Rechnung, die eine echte Komponente beim Rendern hat. Ohne sie wären 576 leere `div` zu billig, um den Unterschied zu fühlen.

Wer wissen will, woran die Anzeige "Compiler: an" den Stand erkennt: Der Compiler schreibt den Rumpf der Komponente um und legt darin die Slots `$[0]`, `$[1]` und so weiter an. `Beet.toString()` gibt den umgeschriebenen Rumpf heraus, und darin stehen die Slots. Im Produktions-Build sind die Namen wegminifiziert, dort taugt der Griff nicht mehr.
