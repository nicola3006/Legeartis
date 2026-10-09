# Architektur und kritische Begründung

Dieses Dokument hält fest, was entschieden wurde, warum, und was ich an der
Ausgangsidee hinterfrage. Jede Entscheidung ist umkehrbar, solange das Projekt
klein ist. Die Punkte unter «Offene Fragen» brauchen deine Antwort.

## 1. Ziel, wie ich es verstanden habe

Ein Werkzeug für Einsteigerinnen und Einsteiger, das zu einer Schweizer
Rechtsnorm auf Knopfdruck die Datenbanken durchsucht, die Norm methodisch
auslegt, sie erklärt und dabei nichts behauptet, was nicht belegt ist.

## 2. Was ich an der Idee hinterfrage

**«Rechtsfragen direkt beantworten» ist für Einsteiger das falsche Versprechen.**
Wer die Methode noch nicht kennt, kann eine selbstbewusste Falschantwort nicht
erkennen. Deshalb liefert das Tool keine Antwort, sondern eine Prüfung:
je Element Richtung und Stärke, dann eine Einstufung (überzeugend, vertretbar
aber offen, offen). «Offen» ist ein vollwertiges Ergebnis.

**Zwei Fedlex-Quellen sind nur sinnvoll, wenn sie sich gegenseitig prüfen.**
Opencaselaw spiegelt Fedlex bereits (`get_law`). Ein eigener Fedlex-MCP bringt
zwei Dinge: eine unabhängige Zweitquelle für den Normtext und die Liste der
Fassungen mit Geltungsdauer. Das Dossier vergleicht beide Texte und warnt bei
Abweichungen. Ob dir das die zusätzliche Verbindung wert ist, entscheidest du.
Die URL des Fedlex-MCP-Servers kenne ich nicht; sie muss aus deinem
Konnektor übernommen werden.

**Die Datenbanken sind bei alten Normen dünn, und das muss sichtbar sein.**
Beim Test mit Art. 2 ZGB lieferte die Botschaftssuche nur Zufallstreffer
(Volltext-Kookkurrenzen, vom Server selbst so gekennzeichnet), und die
Onlinekommentar-Suche fand keine Kommentierung des Artikels, nur Kommentare
anderer Artikel, die Art. 2 ZGB erwähnen. Das Tool kennzeichnet beides:
Materialien tragen die Qualität «volltexttreffer», Kommentare die Art
«erwähnung». Ein historisches Element darf deshalb «unergiebig» sein.

**Ein freier Agent sucht, bis er etwas findet.** Das ist der
Bestätigungsfehler in Reinform. Deshalb ist die Auslegung eine feste
Pipeline mit vorgegebener Recherchereihenfolge, und die Gutachter kennen
weder Sachverhalt noch Wunschergebnis. Der freie Chat bleibt als Werkzeug
für die Exploration, nicht für das Ergebnis.

**Getrennte Gutachter sind dasselbe Modell.** Die Trennung verhindert, dass
das Wunschergebnis die Befunde färbt. Sie verhindert keinen gemeinsamen
blinden Fleck. Das steht im Ergebnis.

**Kosten.** Eine Auslegung braucht sieben Modellaufrufe. Mit Claude Opus 5.5
sind das grob 1 bis 3 Franken je Lauf, je nach Umfang des Dossiers. Für
Studierende ist das viel. Ein Modellwechsel ist per Umgebungsvariable möglich,
und ein Test mit Sonnet 5.5 für die Gutachter bei Opus für Abwägung und
Kritik ist der erste Sparversuch, den ich vorschlage.

## 3. Entscheidungen

| Frage | Entscheidung | Verworfene Alternative und Grund |
|---|---|---|
| Sprache | Python 3.12 | TypeScript wäre für eine spätere Web-Oberfläche näher. Python hat die reifere MCP- und Pydantic-Unterstützung und ist im Umfeld Legal Tech geläufiger. Umkehrbar, solange keine Oberfläche existiert. |
| Modellanbindung | Anthropic SDK direkt, strukturierte Ausgaben (`output_config.format`) | Claude Agent SDK: bringt Dateisystem-Werkzeuge und Subagents mit, aber weniger Kontrolle über jeden Schritt und jede Ausgabe. MCP-Connector (serverseitig): Beta, keine Möglichkeit, Serverantworten vor dem Modell zu prüfen (z.B. den `_hint` der Botschaftssuche). |
| Ablauf | Code-gesteuerte Pipeline mit sieben Modellschritten | Freier Agent mit Werkzeugen: schneller gebaut, aber nicht überprüfbar, siehe oben. |
| Zitate | Ausschliesslich aus `cite` und `get_erwaegung`; Modell nennt nur Beleg-IDs aus dem Dossier | Modell zitiert frei und wird nachträglich geprüft: Prüfung ist dann die einzige Verteidigung. Mit Beleg-IDs ist Erfinden strukturell unmöglich, die Prüfung ist die zweite Linie. |
| Freigabe | Lokales Zitat-Gate und `attest_response`; ohne Freigabe wird der Text als «nicht freigegeben» markiert, nicht verworfen | Stillschweigend senden: unvertretbar für Einsteiger. |
| Tests | Aufgezeichnete echte Serverantworten | Mocks aus dem Kopf: hätten die Markdown-Antworten von `find_leading_cases` und die Volltext-Falle der Botschaftssuche nicht gezeigt. |
| Oberfläche | Zuerst Kommandozeile | Web-UI zuerst: bindet Aufwand, bevor der Kern stimmt. |

## 4. Datenfluss einer Auslegung

```
Norm (z.B. ZGB 2), Frage, Lesarten
  │
  ├─ Dossier (deterministisch, kein Modell)
  │    get_law de/fr/it ─ Fedlex get_article (Vergleich) ─ get_legislation_versions
  │    get_article_purpose (Qualität markiert) ─ find_leading_cases → cite je Entscheid
  │    get_erwaegung für die in der Regeste genannten Erwägungen
  │    get_commentary ─ Onlinekommentar search (Kommentierung vs. Erwähnung)
  │
  ├─ Stufe 0  Frage abstrakt und Lesarten (Modell, nur wenn nicht gegeben)
  ├─ Stufe 1  grammatikalisch ‖ historisch ‖ systematisch (drei getrennte Aufrufe)
  ├─ Gate     Befunde ohne gültige Beleg-ID werden gestrichen und ausgewiesen
  ├─ Stufe 2  teleologisch (erhält nur die Befunde, nicht Richtung oder Stärke)
  ├─ Stufe 4  Abwägung (erhält die vier Berichte und die Gewichtungsregeln)
  ├─ Stufe 5  Kritik (Kipptest, unbegründete Gewichte, dritte Lesart, Nicht-Lücke)
  ├─ Stufe 6  Schluss mit Einstufung, einfacher Erklärung und Glossar
  │
  └─ Freigabe: Zitate im Text gegen das Dossier, dann attest_response
```

Die Stufen folgen dem Gremiumsmodus des Skills «auslegung-schweizer-recht».
Stufe 3 (Verifikation durch einen weiteren Agenten) ist im Code durch das
Beleg-ID-Gate und `attest_response` ersetzt; ein separater Prüf-Aufruf mit
`check_claim_support` je tragender Fundstelle ist der nächste Ausbauschritt.

## 5. Risiken, offen benannt

- **Der MCP-Client ist nicht live getestet.** Aus der Entwicklungsumgebung
  waren mcp.opencaselaw.ch, fedlex.admin.ch und onlinekommentar.ch nicht
  erreichbar. Alle Adapter sind gegen aufgezeichnete Antworten getestet. Der
  erste Lauf bei dir wird zeigen, ob der Transport (Streamable HTTP oder SSE)
  und das Antwortformat (`structuredContent` oder Text) stimmen.
- **Markdown-Antworten.** `find_leading_cases` und `get_commentary` antworten
  als Markdown. Der Parser ist auf das heutige Format geschrieben; ändert der
  Server das Format, bricht die Leitentscheid-Liste. Deshalb geht jeder
  Entscheid zusätzlich durch `cite`, das strukturiert antwortet.
- **Erwägungen ohne Pinpoint.** Nennt die Regeste keine Erwägung, holt das
  Dossier keine. `find_relevant_erwaegung` wäre der nächste Schritt.
- **Strukturierte Ausgaben.** Die JSON-Schemata werden mit aufgelösten
  Referenzen gesendet. Ob die API alle Konstrukte (Literal, optionale Felder)
  akzeptiert, zeigt der erste Lauf mit Schlüssel.

## 6. Offene Fragen an dich

1. Wer genau ist «Einsteiger»: Studierende im ersten Jahr, oder Laien ohne
   juristische Ausbildung? Davon hängt ab, wie viel Methode sichtbar sein soll.
2. Hast du die URL des Fedlex-MCP-Konnektors? Ohne sie läuft das Dossier
   nur über den Opencaselaw-Spiegel.
3. Sollen Sachverhalte (mögliche Personendaten) an die Claude API gehen? Für
   Falllösungen ja, für ein öffentliches Tool braucht es eine Datenschutz-
   Entscheidung. Das bettercallclaude-Plugin zeigt mit Ollama einen lokalen Weg.
4. Reicht die Kommandozeile für die erste Erprobung mit echten Studierenden,
   oder brauchst du früh eine Web-Oberfläche?
5. Akzeptierst du die Kosten von Opus für alle sieben Schritte, oder soll ich
   den gemischten Betrieb (Sonnet für Gutachter) als Erstes messen?

## 7. Nächste Schritte, in dieser Reihenfolge

1. Live-Test des MCP-Clients gegen Opencaselaw bei dir; Fixtures mit dem
   `RecordingCaller` erweitern (OR 333 als zweite Norm, weil dort Botschaft
   und Erwägungen reichhaltig sind).
2. Erster Lauf mit API-Schlüssel; Schemata und Prompts anhand der Ausgabe
   nachschärfen.
3. `check_claim_support` je tragender Fundstelle als Stufe 3.
4. Evaluationsset: zehn Normen mit bekannten Lesarten (aus Vorlesung oder BK),
   damit Änderungen an Prompts messbar werden.
