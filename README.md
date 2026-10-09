# Legeartis

Schweizer Rechtsrecherche für Einsteiger: Das Tool holt zu einer Norm den
Gesetzestext in drei Sprachen, die Fassungen, Botschaftsstellen, Leitentscheide
mit Erwägungen und Kommentierungen aus **Opencaselaw**, **Fedlex** und
**Onlinekommentar**, legt die Norm nach der Methodik der Gesetzesauslegung
(Art. 1 ZGB) aus und gibt das Ergebnis erst frei, wenn jede Fundstelle
nachgeprüft ist.

Stand: Version 0.1, Gerüst mit Quellenschicht, Auslegungs-Pipeline und
Tests gegen aufgezeichnete Serverantworten. Die Live-Verbindung zu den
MCP-Servern ist noch nicht getestet (siehe ARCHITECTURE.md, «Risiken»).

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
# Normtext in drei Sprachen
uv run legeartis norm ZGB 2

# Quellen-Dossier ohne Sprachmodell (JSON)
uv run legeartis dossier ZGB 2 --json

# Auslegung einer Norm mit Frage und Lesarten
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
Server vom 9. Oktober 2026, aufgezeichnet für Art. 2 ZGB. Darunter eine
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
  auslegung/             Methodik und Pipeline
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
