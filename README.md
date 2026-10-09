# Legeartis

Werkzeug zur effizienten Lösung von Schweizer Rechtsfragen für Jurist:innen
und Studierende der Rechtswissenschaft. Es findet zu einer Rechtsfrage die
einschlägigen Normen und die Rechtsprechung in **Opencaselaw**, **Fedlex** und
**Onlinekommentar**, antwortet im Gutachtenstil und gibt die Antwort erst
frei, wenn jede Fundstelle nachgeprüft ist. Wo die Antwort an der Reichweite
einer umstrittenen Norm hängt, bietet es die vertiefte Auslegung nach den vier
Elementen (Art. 1 ZGB) an.

## Zwei Wege

| | `legeartis frage` | `legeartis auslegen` |
|---|---|---|
| Wofür | Rechtsfrage lösen (Normalfall) | Reichweite einer einzelnen Norm klären (Streitfall) |
| Ablauf | Rechercheplan, Normen- und Entscheidsuche, Auswahl, Antwort | Dossier, vier getrennte Gutachter, Abwägung, Kritik, Schluss |
| Modellaufrufe | 3 | 7 |
| Ergebnis | Kurzantwort, Prüfung im Gutachtenstil, Sicherheit, Auslegungsbedarf, offene Recherche | Element, Richtung, Stärke, Grund; Einstufung; Schritt beim Namen |

`frage` meldet unter «Auslegungsbedarf», bei welchen Normen die Antwort von
einer unklaren oder umstrittenen Reichweite abhängt, und nennt den passenden
`auslegen`-Aufruf. So bleibt die teure Methode dem Streitfall vorbehalten.

Stand: Version 0.1, Gerüst mit Quellenschicht, Auslegungs-Pipeline und
Tests gegen aufgezeichnete Serverantworten. Die Live-Verbindung zu den
MCP-Servern ist noch nicht getestet (siehe ARCHITECTURE.md, «Risiken»).

`auslegen` kennt `--modus praxis` (Standard) und `--modus lernen`
(Methode mit Glossar und KI-Vermerk nach dem Merkblatt der RW-Fakultät Bern,
für studentische Arbeiten). Der Prüfumfang ist überall derselbe: geprüft
werden die eigenen Fundstellen, Zitate und Normverweise des Textes, nicht die
Vollständigkeit der Recherche.

## Was das Tool anders macht als ein Chat

| Chat mit Datenbankzugriff | Legeartis |
|---|---|
| Modell entscheidet, was es sucht | Feste Reihenfolge: Normtext, Entstehung, System, Rechtsprechung, Lehre |
| Zitate entstehen im Text | Zitate kommen nur aus `cite` und `get_erwaegung`; jeder Befund trägt eine Beleg-ID |
| Ein Kopf kennt Frage, Wunsch und Befund | Vier getrennte Gutachter je Element, dann Abwägung, dann Kritik |
| Antwort wird gesendet | Antwort wird vorher durch `attest_response` und ein lokales Zitat-Gate geprüft |
| «Die Norm bedeutet X» | «Element, Richtung, Stärke, Grund» und eine Einstufung: überzeugend, vertretbar aber offen, offen |

## Installation

```bash
uv sync --group dev
export ANTHROPIC_API_KEY=...            # für die Auslegung (Sprachmodell)
export LEGEARTIS_OPENCASELAW_URL=https://mcp.opencaselaw.ch   # Standard
export LEGEARTIS_FEDLEX_URL=...          # optional, URL des Fedlex-MCP-Servers
export LEGEARTIS_ONLINEKOMMENTAR_URL=... # optional
```

## Benutzung

```bash
# Rechtsfrage lösen
uv run legeartis frage "Haftet die Erwerberin eines Betriebs aus der Konkursmasse für vor der Übernahme fällige Löhne?" \
  --sachverhalt-datei fall.txt --out antwort.md

# Normtext in drei Sprachen
uv run legeartis norm ZGB 2

# Quellen-Dossier ohne Sprachmodell (JSON)
uv run legeartis dossier ZGB 2 --json

# Vertiefte Auslegung einer Norm mit Frage und Lesarten
uv run legeartis auslegen OR 333 \
  --frage "Erfasst Art. 333 Abs. 3 OR auch den Erwerb eines Betriebs aus der Konkursmasse?" \
  --lesart "Ja, jeder Betriebsübergang ist erfasst." \
  --lesart "Nein, der Erwerb aus der Konkursmasse ist ausgenommen." \
  --out auslegung.md

# Ohne Netz, mit aufgezeichneten Antworten (nur für Art. 2 ZGB vorhanden)
uv run legeartis dossier ZGB 2 --fixtures tests/fixtures

# Freier Recherche-Chat mit den Opencaselaw-Werkzeugen
uv run legeartis chat
```

## Tests

```bash
uv run pytest
```

Die Tests laufen ohne Netz gegen `tests/fixtures`: echte Antworten der drei
Server vom 9. Oktober 2026, aufgezeichnet für Art. 2 ZGB (Auslegung) und für
die Praxisfrage zur Haftung der Betriebserwerberin im Konkurs (Art. 333 und
333b OR, BGE 129 III 335). Darunter eine
`attest_response`-Antwort auf einen Entwurf mit einer absichtlich erfundenen
Fundstelle, die der Server korrekt zurückgewiesen hat.

## Aufbau

```
src/legeartis/
  config.py              Endpunkte und Modell aus Umgebungsvariablen
  sources/               Quellenschicht
    protocol.py          ToolCaller-Schnittstelle, Fehlerklasse
    mcp_client.py        MCP-Client (Streamable HTTP, SSE)
    recorder.py          Aufzeichnen und Abspielen von Antworten
    models.py            Typisierte Quellenobjekte mit Beleg-IDs
    opencaselaw.py       Adapter: get_law, find_leading_cases, cite, get_erwaegung, ...
    fedlex.py            Adapter: get_article, get_legislation_versions
    onlinekommentar.py   Adapter: search_commentaries, get_commentary
    registry.py          Verbindet Konfiguration und Adapter
  frage/                 Rechtsfrage lösen (Normalfall, 3 Modellaufrufe)
    schema.py            Rechercheplan, Normauswahl, Antwort
    akte.py              Fallakte: Normen im Wortlaut, Entscheide, Erwägungen
    pipeline.py          Plan, Suche, Auswahl, Antwort, Gates
    render.py            Markdown-Ausgabe
  auslegung/             Vertiefte Auslegung einer Norm (Streitfall, 7 Modellaufrufe)
    methodik.py          Vier Elemente, Hilfskriterien, Gewichtung, Lückenprüfung
    schema.py            Strukturierte Ausgaben der Gutachter, Abwägung, Kritik, Ergebnis
    dossier.py           Baut das Quellen-Dossier (deterministisch, ohne Sprachmodell)
    llm.py               Anbindung an die Claude API mit strukturierter Ausgabe
    gate.py              Lokales Zitat-Gate und attest_response
    pipeline.py          Ablauf: Frage, Gutachter, Abwägung, Kritik, Schluss, Freigabe
    render.py            Markdown-Ausgabe
  cli.py                 Kommandozeile
```

Die Methodik stammt aus dem Skill «auslegung-schweizer-recht» (Vorlesung
Privatrecht II, Unibe, und Berner Kommentar zu Art. 1 ZGB). Rechtsprechung
und Normtexte stammen ausschliesslich aus den angeschlossenen Datenbanken.
Kommentare von Onlinekommentar stehen unter CC BY 4.0 und werden mit
Autorennamen und URL ausgewiesen.
