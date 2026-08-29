# React Workshop "Webanwendungen mit React - Fortgeschrittene Konzepte"

Dieses Repository enthält den Workspace, in dem wir während des Workshops arbeiten und die Übungen machen.

> [!IMPORTANT]
> Bitte führe die Installationsanleitung unbedingt **einige Tage vor** dem Workshop aus, damit wir sicher sind, dass es keine (unlösbaren) technischen Probleme während der Schulung gibt.

## Technische Voraussetzungen

Für den Workshop brauchst du:

- **einen Editor oder eine IDE**
  - wenn du bei der Arbeit bereits eine IDE verwendest, die JavaScript- und TypeScript-Support bietet, kannst du diese auch im Workshop verwenden
    - abgesehen von JavaScript/TypeScript-Unterstützung gibt es keine weiteren Anforderungen an IDE/Editor
    - ich würde nicht empfehlen, während der Schulung eine für dich neue IDE bzw. einen neuen Editor auszuprobieren. Nimm lieber die Tools, die du kennst, vorausgesetzt, sie bieten JavaScript- und TypeScript-Support.
  - wenn du noch keine hast, empfehle ich eines dieser Werkzeuge:
    - [WebStorm](https://www.jetbrains.com/webstorm/download/) (die Evaluierungsversion reicht)
    - [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) (Achtung: Nur die _Ultimate Edition_ hat JavaScript-Unterstützung. Eine Evaluierungsversion davon ist aber ausreichend)
    - [Visual Studio Code](https://code.visualstudio.com/)
    - **Eclipse** würde ich _nicht_ empfehlen, weil der JavaScript- und TypeScript-Support dort nicht ausgereift ist (jedenfalls nach meinem letzten Kenntnisstand)
  - bei JetBrains-IDEs (IntelliJ oder Webstorm) bitte darauf achten, dass du eine **Version von mindestens 2025** verwendest. Ältere Versionen haben Probleme mit der TypeScript-Version, die wir im Workshop verwenden, und das ist leider nicht immer auf den ersten Blick zu sehen.
  - in jedem Fall empfehle ich, in der IDE die **KI-Unterstützung auszuschalten** (Copilot, AI Assistant, etc.).
    - bei einer Schulung sind die Vorschläge meistens eher irritierend denn hilfreich
    - außerdem ist der Sinn der Schulung ja gerade, dass wir Code selbst schreiben, um zu lernen, und uns den Code nicht schreiben lassen...
    - in IntelliJ gehört die "Inline Completion" dazu (Settings -> Editor -> General -> Inline Completion)
- **Node.js (mind. Version 24.x)**
  - wir benötigen mindestens die **Node.js-Version 24.x**. Das ist die aktuelle "long-term support" (LTS) Version von Node.js (also die aktuelle "stabile" Version).
    - Node.js kannst du hier für alle Betriebssysteme runterladen und installieren: https://nodejs.org/en/download
    - Wenn Node.js bei dir installiert ist, kannst du mit `node -v` die Version ausgeben und überprüfen
  - enthalten in der Node.js-Installation ist der Node Package Manager (**npm**), den wir zur Installation der JavaScript Packages verwenden
    - Auch hier kannst du die installierte Version überprüfen: `npm -v` (bei mir zzt. 11.x)
- **einen Git-Client**
  - damit du das Repository klonen kannst
- **einen Webbrowser**
- **Internetzugang und Berechtigungen**
  - Du musst auf deinem Computer mit npm Pakete installieren können (dürfen)
  - Du musst dieses Git Repository von github.com klonen können (dürfen). Zur Not kannst du es dir dort auch als zip-Datei herunterladen.
  - Du musst auf deinem Computer Node.js ausführen können (dürfen)
  - Wenn du an der Schulung nicht in deiner "gewohnten" Umgebung teilnimmst, denk dran, zu prüfen, ob es **Einschränkungen bzgl. VPN, Firewall etc.** gibt

> [!CAUTION]
> Wenn es Probleme mit Berechtigungen gibt und du die Tools oder Pakete nicht installieren darfst, kann ich dir leider nicht helfen. Deswegen stell bitte unbedingt vor der Schulung sicher, dass die Installation bei dir durchläuft 🙏

## Extensions und Dev Tools

Die React Developer Tools sind nicht notwendig für den Workshop, können aber ganz hilfreich sein. Links zum Installieren findest du auf dieser Seite in der React-Dokumentation: https://react.dev/learn/react-developer-tools

## Installation des Workspaces

### Repository-Struktur

Nach dem Klonen des Repositories (s.u.) findest du diese Verzeichnisse:

- `backend`: eine kleine, in Node.js geschriebene Anwendung, die das Backend für unsere Anwendung als REST-API zur Verfügung stellt. In diesem Verzeichnis machen wir keine Änderungen, wir starten nur das Backend, das sich darin befindet.
- `workspace`: hierin befindet sich unsere React-Anwendung (bzw. der Ausgangspunkt davon). Hierin werden wir im wesentlichen arbeiten und Übungen machen.
- `nextjs-app`: eine Next.js-Anwendung, mit der wir uns im letzten Block des Workshops beschäftigen. Bis dahin brauchst du das Verzeichnis nicht.
- `AUFGABEN`: hier liegen während des Workshops die Aufgabenbeschreibungen (s.u.). Im Ausgangsstand, den du klonst, ist das Verzeichnis noch leer.

Wir arbeiten die meiste Zeit nur im Verzeichnis `workspace`. Deshalb bitte **nur dieses** Verzeichnis in deiner IDE öffnen (**nicht** das _ganze_ Repository). Für den letzten Block öffnest du dann zusätzlich `nextjs-app`.

- In IntelliJ oder Webstorm kannst du das `workspace`-Verzeichnis nach dem Klonen jeweils mit `File -> Open` auswählen und dann öffnen

> [!IMPORTANT]
> Bitte führe die untenstehenden Schritte **vor der Schulung** aus, damit wir sicher sind, dass alles bei der Schulung funktioniert. Gerade fehlende Berechtigungen, eingeschränkter Internet-Zugang (im Schulungsraum) etc. lassen sich während der Schulung meist nicht kurzfristig beheben.

### Schritt 1: Klonen des Repositories

- Bitte dieses Repository von GitHub klonen: https://github.com/nilshartmann-workshops/2026-09-07-oose

### Schritt 2: Backend

- Im Verzeichnis `backend` die JavaScript Packages installieren:
  - ```bash
    cd backend
    npm install
    ```
- Dieses Verzeichnis brauchst du _nicht_ in deiner IDE zu öffnen, da wir hier keine Änderungen machen.

### Schritt 3: Frontend

- Im Verzeichnis `workspace` die Packages installieren:
  - ```bash
    cd workspace
    npm install
    ```
- Während der Schulung musst du dieses Verzeichnis in deiner IDE öffnen. Wir werden die meiste Zeit nur hier in diesem Verzeichnis arbeiten.

### Schritt 4: Next.js-Anwendung

- Im Verzeichnis `nextjs-app` die Packages installieren:
  - ```bash
    cd nextjs-app
    npm install
    ```
- Diese Anwendung brauchen wir erst im letzten Block. Bitte installiere die Packages trotzdem jetzt schon mit, denn während des Workshops ist dafür keine Zeit.

## Starten der Anwendung (zum Prüfen, ob alles funktioniert)

Nach der Installation der Packages prüfe bitte, ob die Installation geklappt hat und alles funktioniert.

### Schritt 1: Starten des Backends

- Während der Schulung benötigen wir das Backend, um daraus Daten zu lesen und zu schreiben
- Das Backend läuft auf Port **7200**, d.h. dieser Port muss bei dir frei sein.
- Zum Starten im `backend`-Verzeichnis `npm start` verwenden
  - ```bash
    cd backend
    npm start
    ```
- Zum Testen ruf im Browser http://localhost:7200/api/plants auf
  - Du solltest eine Liste von Pflanzen im JSON-Format sehen. Damit arbeiten wir später im Workshop.

### Schritt 2: Starten des Frontends

- Das Frontend läuft auf Port **3000**, d.h. dieser Port muss bei dir frei sein.
- Zum Starten im `workspace`-Verzeichnis `npm run dev` verwenden
  - ```bash
    cd workspace
    npm run dev
    ```
- Ruf dann http://localhost:3000 im Browser auf
  - Du solltest eine Anwendung mit zwei Reitern sehen: "Pflanzen" mit einer Liste von Pflanzen-Karten und "Neue Pflanze" mit einem Formular.

### Schritt 3: Starten der Next.js-Anwendung

- Die Next.js-Anwendung läuft auf Port **3001**, d.h. auch dieser Port muss bei dir frei sein.
- Zum Starten im `nextjs-app`-Verzeichnis `npm run dev` verwenden
  - ```bash
    cd nextjs-app
    npm run dev
    ```
- Ruf dann http://localhost:3001 im Browser auf. Du solltest die Überschrift "Plant Manager" sehen, mehr ist dort noch nicht.
- Beim ersten Start weist Next.js auf seine anonyme Telemetrie hin. Wenn du sie abschalten willst, geht das mit `npx next telemetry disable` im Verzeichnis `nextjs-app`. Die Einstellung gilt für deinen Rechner und landet nicht im Repository.

Du kannst Backend und Frontend jetzt bis zur Schulung wieder beenden :-)

> [!TIP]
> Falls der Port 7200 bei dir belegt ist, kannst du das Backend auf einem anderen Port starten (`SERVER_PORT=... npm start`). Dann musst du im Workshop allerdings jede Stelle anpassen, an der wir `http://localhost:7200` in den Code schreiben. Sag mir am besten kurz Bescheid, wenn das bei dir so ist.

## Übungen während des Workshops

Im Workshop zeige ich euch jedes Thema direkt bei mir im Editor (Live Coding). Nach jedem Thema macht ihr dann eine Übung (in der Regel genau das gleiche, was ihr vorher bei mir gesehen habt). Dazu committe ich nach jedem Thema "meinen" Code und eine Aufgabenbeschreibung und pushe beides auf einen eigenen Branch im GitHub-Repository.

Um die Übung dann zu machen, müsstest du also dann:

- den Stand in GitHub öffnen (s.u.)
- dort die Aufgabenbeschreibung lesen
- meine Änderungen dort kannst du als "Spickzettel" verwenden, wenn du mit einer Übung nicht weiterkommst.

Am besten öffnest du während des Workshops den GitHub-Branch (`live_coding`) im Browser in zwei Tabs, die du während des gesamten Workshops offen lässt:

1. Die Branch-Ansicht vom `live_coding`-Branch. Nützlich, wenn du eine Übersicht des Projektes im aktuellen Stand haben willst: https://github.com/nilshartmann-workshops/2026-09-07-oose/tree/live_coding
   - Die Aufgaben-Beschreibungen findest du dann jeweils im Verzeichnis `AUFGABEN`: https://github.com/nilshartmann-workshops/2026-09-07-oose/tree/live_coding/AUFGABEN
2. Die Commit-Ansicht. Nützlich, wenn du genau die Änderungen sehen willst, die beim letzten Thema entstanden sind: https://github.com/nilshartmann-workshops/2026-09-07-oose/commits/live_coding/

> [!TIP]
> **Wichtig:** Den `live_coding`-Branch brauchst du nicht bei dir lokal auszuchecken. Es ist am einfachsten, wenn du dir den Stand in GitHub ansiehst.

## Bei Fragen und Problemen

Wenn du Fragen oder Probleme bei der Installation hast, kannst du mich gerne kontaktieren. Meine Kontaktdaten findest du hier: https://nilshartmann.net/kontakt

Ich wünsche dir viel Spaß und Erfolg bei unserem Workshop!
