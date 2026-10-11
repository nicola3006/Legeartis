# RAB Werkbank · Prototyp lokal ausführen

`rab-werkbank.html` ist eine einzelne HTML-Datei. Sie läuft ohne Server,
ohne Datenbank und ohne Verbindung zu Claude oder einem anderen Dienst.

**Öffnen**

1. Datei herunterladen oder das Repository klonen.
2. `docs/rab-werkbank.html` im Browser öffnen (Doppelklick genügt).

Für ein Team im Intranet reicht ein beliebiger Webserver, zum Beispiel:

```bash
cd docs
python3 -m http.server 8080
# dann http://localhost:8080/rab-werkbank.html
```

**Abhängigkeiten**

- Schriften werden von Google Fonts geladen (Instrument Serif, Geist, Geist
  Mono). Ohne Internet oder bei gesperrtem Zugriff greifen die
  Systemschriften; die Seite funktioniert unverändert. Für ein geschlossenes
  Netz können die Schriften lokal abgelegt und die `<link>`-Zeile im Kopf
  angepasst werden.
- Der Browser speichert nur ein Kennzeichen, ob das Hilfefenster schon
  gezeigt wurde (`localStorage`). Sonst wird nichts gespeichert; ein Neuladen
  setzt alle Eingaben zurück.

**Inhalt**

Alle Fälle, Personen, Firmen, Zahlen und Verfügungen sind erfunden. Echt sind
nur die zitierten Urteile des Bundesverwaltungs- und Bundesgerichts und die
Normen. Der Prototyp ist kein Produkt der RAB.

**Weiterentwicklung**

Die Seite besteht aus einem `<style>`-Block, einer HTML-Hülle und einem
`<script>`-Block mit den Daten (Konstanten am Anfang) und den Ansichten
(`heute`, `zulassung`, `pruefung`, `enforcement`, `wissen`, `recht`). Für
einen echten Betrieb wären Datenhaltung, Benutzerverwaltung und die
KI-Aufrufe serverseitig zu bauen; das Konzept dazu steht in
`rab-ki-konzept.md`, Abschnitt 4 und 5.
