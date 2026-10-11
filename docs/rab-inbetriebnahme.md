# Inbetriebnahme der RAB Werkbank: Vorgehen

Vom klickbaren Prototyp zum produktiven System bei der Eidgenössischen
Revisionsaufsichtsbehörde. Stand: 11. Oktober 2026. Ergänzt das Konzeptpapier
`rab-ki-konzept.md` (Abschnitte 4 bis 7) und den Prototyp `rab-werkbank.html`.

Der Plan folgt der Projektmethode des Bundes (HERMES) mit vier Phasen und
Entscheidungspunkten, an denen die Geschäftsleitung oder der Verwaltungsrat
freigibt. Der Grundsatz bleibt: **Die Datenklasse bestimmt, wo ein Werkzeug
läuft und wann es produktiv geht.** Werkzeuge auf öffentlichen Daten gehen
früh produktiv, Werkzeuge auf Akten erst nach Pilot auf Bundesinfrastruktur.

---

## Übersicht

| Phase | Dauer | Ergebnis | Entscheidungspunkt |
|---|---|---|---|
| 0 Sofortmassnahmen | 0–3 Monate | KI-Weisung, Datenklassifizierung, Evaluationsset, erste Werkzeuge auf öffentlichen Daten | G0 Projektauftrag |
| 1 Konzept | 3–8 Monate | Anforderungen, Rechtsgutachten, Datenschutz-Folgenabschätzung, Schutzbedarf, Betriebsmodell, Beschaffung | G1 Konzeptfreigabe |
| 2 Realisierung und Pilot | 8–18 Monate | Praxisdatenbank, Werkbank-Kern, Pilot mit drei Fallführenden im Schattenbetrieb | G2 Pilotfreigabe, G3 Produktionsfreigabe je Werkzeug |
| 3 Einführung | 18–24 Monate | Schrittweise Freigabe, Betriebsreglement, Schulung, Übergabe an den Betrieb | G4 Betriebsübernahme |
| Betrieb | laufend | Re-Evaluation, Modellpflege, Berichterstattung | jährliche Überprüfung |

Die Dauern sind Richtwerte für eine Behörde dieser Grösse. Die Beschaffung
und die Anbindung des Aktensystems sind die beiden Posten, die den Plan am
ehesten verlängern.

---

## Phase 0: Sofortmassnahmen (ohne neue Infrastruktur)

Ziel: Risiko senken, Grundlagen schaffen, erste Wirkung zeigen.

1. **KI-Weisung der Direktion.** Übersetzt das Merkblatt der Bundeskanzlei
   auf die vier Datenklassen der RAB: Klasse 0 frei, Klasse 1 nur in
   gebundenen Diensten, Klasse 2 und 3 nur auf Bundesinfrastruktur, kein
   Training, keine automatisierten Verfügungen. Schliesst die reale Gefahr,
   dass Aktenauszüge in öffentliche Werkzeuge kopiert werden. Schulung aller
   Mitarbeitenden in einer Stunde.
2. **Datenklassifizierung der Bestände.** Register, Vorlagen, Zulassungsakten,
   Überprüfungsakten, Enforcement-Akten, Amtshilfe je einer Klasse zuordnen,
   abgestimmt mit der Informationssicherheitsbeauftragten. Diese Liste ist
   die Grundlage für alles Weitere.
3. **Evaluationsset anlegen.** Zehn bis zwanzig abgeschlossene Fälle (Zulassung
   mit Nachforderung, Überprüfung mit Feststellungen, Enforcement mit Urteil)
   als Goldstandard: Was hat die Fallführung gefunden, was hat das Gericht
   korrigiert. Ohne dieses Set lässt sich kein Werkzeug abnehmen. Es wird
   einmal angelegt und bei jeder Modell- oder Promptänderung wieder
   verwendet.
4. **Erste Werkzeuge auf öffentlichen Daten** (Klasse 0, gebundener Dienst):
   Rechtsprechungs-Monitor über die Opencaselaw-Schnittstelle, Sanktionsraster
   als gepflegte Tabelle, Mutations-Radar gegen das Handelsregister (Zefix).
   Sie liefern Nutzen, bevor eine Zeile Infrastruktur steht.
5. **Gespräche aufnehmen**: mit dem BIT über die Nutzung seines
   KI-Assistenten und der Swiss Government Cloud; mit EXPERTsuisse über die
   Lizenz der Prüfungsstandards als Datenquelle; mit dem EDÖB informell über
   die geplante Folgenabschätzung.

**G0 Projektauftrag** durch die Geschäftsleitung, zur Kenntnis an den
Verwaltungsrat: Ziel, Umfang (welche Werkzeuge in welcher Reihenfolge),
Budget für Phase 1, Projektleitung, Fachverantwortung.

---

## Phase 1: Konzept

Ziel: Alles entscheiden, was später teuer zu ändern wäre.

### Fachlich

- **Anforderungen aus dem Prototyp ableiten.** Der Prototyp wird mit den
  Fallführenden durchgespielt; jede Ansicht wird bestätigt, gestrichen oder
  ergänzt. Daraus entstehen Anwendungsfälle mit Abnahmekriterien, die am
  Evaluationsset messbar sind (zum Beispiel: Der File-Review-Leser findet
  mindestens 80 Prozent der Feststellungen der Inspektorinnen und erfindet
  keine Fundstelle).
- **Erschliessungsschema der Praxisdatenbank** festlegen (Abschnitt 4.1 des
  Konzepts) und an fünf Verfügungen erproben. Entscheiden, wie weit zurück
  erschlossen wird.
- **Rangfolge der Werkzeuge**: zuerst Praxisdatenbank und Wissen, dann
  Verfügungs-Editor und Sachverhaltserfassung, dann tabellarische Zulassung,
  zuletzt File-Review-Leser. Diese Reihenfolge folgt dem Nutzen und dem
  Risiko.

### Rechtlich

- **Rechtsgutachten** zu Art. 34 RAG und Art. 320 StGB: Unter welchen
  vertraglichen und technischen Bedingungen ist ein KI-Betreiber Hilfsperson
  und kein Dritter; Anforderungen aus Art. 20 RAG (Unabhängigkeit von den
  Beaufsichtigten, Geheimhaltung). Das Gutachten legt fest, welche
  Betriebsformen für welche Klassen überhaupt in Frage kommen.
- **Datenschutz-Folgenabschätzung** nach Art. 22 DSG für die Werkzeuge der
  Klassen 2 und 3, Konsultation des EDÖB nach Art. 23 DSG, wenn ein hohes
  Restrisiko bleibt. Die Datenschutzberaterin der RAB (Art. 10 DSG) führt
  sie.
- **Schutzbedarfsanalyse** nach ISG-Logik mit der
  Informationssicherheitsbeauftragten; Ergänzung des Betriebsreglements nach
  Art. 25 RAV um Zugriffsrechte, Protokollierung und Störfallregeln für die
  KI-Systeme.
- **Verfahrensfragen vorab klären**: Sind Eingaben und Ausgaben der KI
  Verfahrensakten mit Akteneinsicht; wie wird in der Verfügung offengelegt,
  was maschinell vorbereitet wurde; Aufbewahrung und Archivierung der
  Protokolle nach Archivgesetz, abgestimmt mit dem Bewertungsentscheid des
  Bundesarchivs für die RAB.

### Technisch

- **Betriebsmodell wählen.** Drei Optionen, zu bewerten nach Datenklasse,
  Kosten, Zeit und Abhängigkeit:
  - A: Bundesinfrastruktur des BIT (KI-Assistent auf offenem Modell, Swiss
    Government Cloud). Vorteil: Klasse 3 zulässig, Governance geteilt,
    kein eigener Modellbetrieb. Nachteil: Abhängigkeit vom Angebot und
    Fahrplan des BIT.
  - B: Eigener Betrieb eines offenen Modells (zum Beispiel Apertus) auf
    Infrastruktur der RAB oder eines Schweizer Rechenzentrums. Vorteil:
    volle Kontrolle. Nachteil: Betriebskompetenz, die die RAB heute nicht
    hat.
  - C: Gebundener Schweizer Anbieter mit Auftragsbearbeitungsvertrag,
    Schweiz-Hosting, keine Speicherung, kein Training. Vorteil: schnell.
    Nachteil: nur für Klasse 0 bis 2 vertretbar, Unabhängigkeit nach Art. 20
    Abs. 2 RAG streng zu prüfen.
  Empfehlung: A für Klasse 2 und 3, C für Klasse 0 und 1, B als Rückfall.
- **Schnittstellen inventarisieren**: Aktensystem der RAB, Register,
  Extranet der Revisionsunternehmen, Handelsregister (Zefix), Opencaselaw
  und Fedlex, Prüfungsstandards. Die Anbindung des Aktensystems entscheidet
  darüber, ob die Werkzeuge der Klasse 3 ohne Medienbruch arbeiten.
- **Architekturentscheid**: Die Werkbank ist eine Oberfläche über einem
  Dienst, der Akten liest, Modelle aufruft, jede Ausgabe mit Quellen
  versieht und protokolliert. Zitate kommen nur aus Quellen, jede Aussage
  trägt eine Belegkennung, ein Prüfschritt blockiert Ausgaben ohne Beleg.
  Dieses Muster ist in Legeartis umgesetzt und übertragbar.

### Beschaffung

Die RAB ist Auftraggeberin nach dem Bundesgesetz über das öffentliche
Beschaffungswesen. Je nach Auftragswert: freihändig, Einladungsverfahren
oder offenes Verfahren mit entsprechenden Fristen. Die Beschaffung von
Entwicklungsleistungen und, falls Option C, des KI-Dienstes ist früh zu
planen, weil sie den kritischen Pfad bestimmt. Anbieter, die zugleich für
beaufsichtigte Revisionsunternehmen arbeiten, sind nach Art. 20 Abs. 2 RAG
auszuschliessen.

**G1 Konzeptfreigabe** durch die Geschäftsleitung, Genehmigung des Budgets
für Phase 2 durch den Verwaltungsrat: Betriebsmodell, Rangfolge der
Werkzeuge, Ergebnisse von Rechtsgutachten und Folgenabschätzung,
Beschaffungsplan.

---

## Phase 2: Realisierung und Pilot

Ziel: Den Kern bauen, am Evaluationsset messen, im Schattenbetrieb
beweisen.

1. **Praxisdatenbank und Wissen zuerst.** Erschliessung der eigenen
   Verfügungen und Überprüfungsberichte nach Schema, Anbindung der Urteile,
   Suche mit Facetten und Passagen. Nutzen ab dem ersten Tag, geringes
   Risiko, weil nichts automatisch entsteht.
2. **Verfügungs-Editor und Sachverhaltserfassung.** Chronologie mit Belegen,
   Vorbringen-Matrix, Einstufung gegen Raster und Muster, Blatt mit
   Quellenverzeichnis, Verfügungsreife. Erst lesend, dann mit Entwürfen.
3. **Tabellarische Zulassung.** Dossier-Vorprüfer und Fachpraxis-Rechner;
   Strafregister- und Betreibungsdaten bleiben ausserhalb des Modells.
4. **File-Review-Leser zuletzt**, mit einem zweiten Modell oder einem
   regelbasierten Prüfer als Kontrolle der Fundstellen.

**Schattenbetrieb**: Drei Fallführende arbeiten drei Monate wie bisher, die
Werkbank läuft parallel. Verglichen werden: gefundene gegen übersehene
Feststellungen, Zeit pro Dossier, Anteil der Ausgaben ohne Beleg, Anteil der
Vorschläge, die die Fallführung ändert. Erst wenn die Abnahmekriterien aus
Phase 1 erfüllt sind, wird ein Werkzeug für die produktive Nutzung
freigegeben.

**Sicherheit**: Angriffsversuche auf die Werkbank (Prompt-Injektion über
eingereichte Dokumente, Datenabfluss über Ausgaben) werden vor der
Pilotfreigabe getestet. Dokumente von Beaufsichtigten gelten als nicht
vertrauenswürdige Eingaben.

**G2 Pilotfreigabe** je Werkzeug durch die Geschäftsleitung nach
Abnahmekriterien; **G3 Produktionsfreigabe** je Werkzeug nach Schattenbetrieb.

---

## Phase 3: Einführung

- **Schrittweise Freigabe** in der Reihenfolge der Risiken: Wissen und
  Praxisdatenbank für alle, Editor für Fallführende, Zulassung für den
  Zulassungsbereich, File-Review-Leser für Inspektorinnen.
- **Rollen und Berechtigungen**: Fallführung, Zweitperson, Geschäftsleitung
  (Unterschrift), Lesezugriff; Trennung nach Bereich; Protokoll für jede
  Aktion.
- **Schulung** in zwei Stufen: Bedienung, dann Urteilskraft (wann einem
  Vorschlag nicht zu folgen ist; Beispiele aus dem Evaluationsset).
- **Transparenz nach aussen**: Grundsätze zum KI-Einsatz der RAB im
  Geschäftsbericht; Hinweis in Verfügungen, dass Entwürfe maschinell
  vorbereitet und vollständig geprüft wurden. Die RAB verlangt dieselbe
  Transparenz von den Revisionsunternehmen und sollte sie vorleben.
- **Prüfung durch die EFK** als Revisionsstelle der RAB einplanen; der
  EFK-Bericht zur FINMA zeigt, was geprüft wird: institutionalisierter Rahmen
  für vertrauenswürdige KI.

**G4 Betriebsübernahme**: Betriebsorganisation, Störfallprozess,
Verantwortlichkeiten, Budget für den laufenden Betrieb.

---

## Betrieb

- **Re-Evaluation** am Evaluationsset bei jeder Modell- oder
  Promptänderung; Ergebnisse werden protokolliert.
- **Rechtsprechungs-Monitor** aktualisiert Sanktionsraster und markiert
  überholte Muster automatisch.
- **Jährliche Überprüfung** der Datenschutz-Folgenabschätzung, der
  KI-Weisung und der Zugriffsrechte; Bericht an Verwaltungsrat und in den
  Geschäftsbericht.
- **Beobachtung des Rechtsrahmens**: Umsetzung der KI-Konvention des
  Europarats (Vernehmlassung Ende 2026), Rechtsrahmen der Bundeskanzlei,
  Vorgaben zur Swiss Government Cloud.

---

## Rollen

| Rolle | Aufgabe |
|---|---|
| Verwaltungsrat | Strategische Ziele, Budget, Genehmigung G1 und G4 |
| Geschäftsleitung | Projektauftrag, Freigaben G0, G2, G3, Unterschrift der Verfügungen |
| Projektleitung | Plan, Beschaffung, Lieferanten, Berichterstattung |
| Fachverantwortung (Recht, Aufsicht, Zulassung) | Anforderungen, Evaluationsset, Abnahme, Schulung |
| Datenschutzberaterin | Folgenabschätzung, EDÖB, jährliche Überprüfung |
| Informationssicherheitsbeauftragte | Schutzbedarf, Betriebsreglement, Sicherheitstests |
| IT / BIT | Infrastruktur, Schnittstellen, Betrieb |
| EFK | Prüfung als Revisionsstelle |

---

## Stolpersteine

1. **Kein Evaluationsset, keine Abnahme.** Wer ohne Goldstandard baut, kann
   nicht sagen, ob das Werkzeug besser oder schlechter wird. Deshalb steht
   das Set in Phase 0.
2. **Aktensystem ohne Schnittstelle.** Dann bleibt der File-Review-Leser ein
   Werkzeug mit Medienbruch. Früh klären, notfalls mit Export nach Schema.
3. **Beschaffungsdauer.** Offene Verfahren dauern Monate. Phase 0 und die
   Praxisdatenbank lassen sich mit kleinen Aufträgen beginnen.
4. **Lizenz der Prüfungsstandards.** Ohne sie fehlt dem File-Review-Leser
   der Massstab. Gespräch mit EXPERTsuisse in Phase 0.
5. **Pilot wird stillschweigend zum Betrieb.** Deshalb Freigabe je Werkzeug
   mit dokumentierten Kriterien und Protokoll.
6. **Anbieter mit Interessenkonflikt.** Art. 20 Abs. 2 RAG als
   Ausschlusskriterium in jeder Ausschreibung.
7. **Vertrauen in die Ausgabe statt in die Quelle.** Schulung der
   Urteilskraft, Doppelprüfung, und die Regel, dass nichts ohne Beleg
   übernommen wird.

---

## Was nächste Woche beginnen kann

- Entwurf der KI-Weisung auf einer Seite.
- Liste der Datenbestände mit Klasse.
- Auswahl der ersten zehn Fälle für das Evaluationsset.
- Terminanfrage an BIT, EXPERTsuisse und EDÖB.
- Durchspielen des Prototyps mit zwei Fallführenden und einer Inspektorin,
  Notizen zu jeder Ansicht.
