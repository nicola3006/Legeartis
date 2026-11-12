# Legeartis als Plattform: Analyse, Leitentscheide, Gestaltung, Datengrundlage

Stand 12. November 2026. Begleitdokument zum Prototyp in `prototype/`.

## 0. Vorbehalt zur Recherche

Die Websites der untersuchten Anbieter waren aus der Entwicklungsumgebung nicht direkt abrufbar.
Die Angaben stammen aus Websuche, aus Anbieter- und Drittquellen sowie aus direkten Abfragen der
MCP-Server von Fedlex, Opencaselaw und Onlinekommentar. Was nicht selbst geprüft werden konnte,
ist mit «unbestätigt» markiert. Zur Qualität der Leseansichten der kostenpflichtigen Datenbanken
liess sich nichts belegen; diese Spalte fehlt deshalb in der Matrix.

## 1. Vergleichsmatrix

| Angebot | Inhalte | Suche und KI | Verlinkung, Zitieren | Sprachen | Zugang, Lizenz |
|---|---|---|---|---|---|
| Swisslex | Entscheide Bund/Kantone, Erlasse, Kommentare, Zeitschriften | KI-gestützte Suche und Dokumentanalyse (unbestätigt) | nicht belegt | DE/FR/IT | Abo, Preise nicht öffentlich; Hochschulzugang «LEX campus» |
| Legalis | Basler Kommentare, Handbücher, weitere Verlage, nach Fachmodulen | «Swiss-Noxtua» 2025 angekündigt, Betrieb nicht belegt | nicht belegt | DE/FR | Abo je Modul |
| Weblaw | Push-Service Entscheide (laut Flyer über 500'000), Jusletter | Lawsearch AI mit Quellenlinks (unbestätigt) | Normen, Entscheide, AS/BBl automatisch verlinkt | DE/FR/IT | kostenpflichtig |
| Justement | rund 940'000 Entscheide, Erlasse | KI-Assistent | nicht belegt | DE/FR/IT | CHF 99 pro Monat |
| Libra (Wolters Kluwer) | Stämpfli-Inhalte exklusiv; bindet Opencaselaw und Entscheidsuche ein | KI-Arbeitsplatz | nicht belegt | DE | kostenpflichtig |
| Omnilex, Lawcodex | eigene Bestände, «über 1 Mio. Quellen» (Omnilex) | semantische Recherche | nicht belegt | DE/FR | Omnilex CHF 2'000 pro Nutzer und Jahr (Preisseite) |
| opencaselaw.ch | 1'053'441 Entscheide aus 137 Gerichten, Erlasse Bund und Kantone, Materialien, Verwaltungspraxis | Volltext, Zitiergraph, Prüfwerkzeug für Zitate; MCP | Erwägungsanker, Zitierstrings BGE/ATF/DTF | DE/FR/IT | frei; Daten CC0, Code MIT (Drittquelle) |
| entscheidsuche.ch | rund 650'000 Entscheide (Stand 2024) | Volltext, offene API | nicht belegt | DE/FR/IT | frei; keine formelle Lizenz, Quellenangabe erbeten |
| Fedlex | AS, SR, BBl | Titel- und Volltextsuche, SPARQL | ELI-URI, Artikelanker; XML bis Ziffer und Buchstabe | DE/FR/IT, teils EN | frei; Erlasse nach Art. 5 URG nicht geschützt |
| Bundesgericht | BGE ab 1875, weitere Urteile ab 2000 | Volltext, Normen, Deskriptoren | nicht belegt | nur Verfahrenssprache | frei |
| onlinekommentar.ch | 399 Kommentierungen (DE-Ausgabe) | Volltext | Zitiervorschlag | DE/FR/IT/EN, zitierfähig nur Original | frei, CC BY 4.0 |
| LexFind | Bundes- und kantonales Recht, Fassungen ab ca. 2005 | Titel, Volltext | Fassungsvergleich nicht belegt | je Kanton | frei |
| dejure.org | deutsches Recht | Norm und zitierende Rechtsprechung vernetzt | Zitiervorschläge | DE | frei |
| RIS (AT) | Bundes- und Landesrecht, Judikatur mit Rechtssätzen | Volltext, offene API | stabile Links | DE | frei, CC BY 4.0 |
| Légifrance | französisches Recht, alle historischen Fassungen | Volltext, API | Fassungsvergleich «Comparer» | FR | frei, Licence Ouverte 2.0 |
| Doctrine.fr | französische Rechtsprechung und Doktrin | KI; 2026 Bericht über fehlerhafte KI-Zusammenfassung | nicht belegt | FR | kostenpflichtig |
| CourtListener | US-Rechtsprechung | semantische Suche, Citation-Lookup-API gegen Halluzinationen | Zitiernetz | EN | frei, API-Limits an Mitgliedschaft |

## 2. Die zehn grössten Reibungspunkte

Belegt sind die Punkte mit Quellenangabe. Die übrigen beschreiben den Arbeitsablauf und sind als
Annahmen zu prüfen, bevor man darauf baut.

1. Ein Zitat mit Erwägung, etwa BGE 129 III 335 E. 5.2, führt selten direkt an die Stelle. Man
   landet am Anfang des Entscheids und scrollt. Erwägungsanker bietet im freien Bereich
   Opencaselaw.
2. Die Kommentarliteratur ist exklusiv verteilt: Stämpfli bei Libra, Helbing Lichtenhahn bei
   Legalis. Keine Plattform hat alles, und nichts davon ist frei (belegt).
3. Urteile des Bundesgerichts erscheinen nur in der Verfahrenssprache. BGE 123 III 466, ein
   Leitentscheid zu Art. 333 OR, ist französisch; amtlich übersetzt ist nur die Regeste (belegt).
4. Ob ein Entscheid noch gilt, sieht man ihm nicht an. BGE 129 III 335 und BGE 137 III 487 tragen
   keinen Hinweis, dass seit 1.1.2014 Art. 333b OR den Fall regelt.
5. Ältere Fassungen sind lückenhaft. Für SR 220 liefert Fedlex die Fassung vom 28.5.2013 nicht
   maschinenlesbar; der Wortlaut von Art. 333 OR vor dem 1.5.1994 war nicht abrufbar (im
   Prototyp festgestellt). Einen Fassungsvergleich wie bei Légifrance gibt es nicht.
6. Trefferlisten enthalten Dubletten. Die Suche zu Art. 333 OR lieferte drei Urteile vom
   20.4.2001 je doppelt, mit zwei Schreibweisen der Geschäftsnummer, und BGE 137 III 487
   zusätzlich als 5A_113/2011 (im Prototyp festgestellt).
7. Kantonales Recht ist zersplittert: eigenes Portal je Kanton, erstinstanzliche Entscheide nur
   in einem Teil der Kantone publiziert, Abdeckung der freien Sammlungen ungleich (belegt).
8. Die drei Sprachfassungen einer Norm stehen nirgends nebeneinander, obwohl sie gleichwertig
   sind. Bei Art. 333 Abs. 3 und Art. 333b OR weichen sie im Satzbau ab.
9. Materialien sind von der Norm getrennt. Die Botschaft findet man über die Fussnote, die
   Seite im PDF sucht man selbst. Für alte Normen fehlt die Verknüpfung ganz.
10. Das Gewicht einer Aussage bleibt unsichtbar. Ob eine Stelle gefestigte Praxis, umstritten
    oder inzwischen Gesetz ist, erschliesst man aus Folgeurteilen und Lehre von Hand. KI-Angebote
    verschärfen das, wenn sie Antworten ohne Stelle liefern (belegter Fehlerfall bei Doctrine).

## 3. Leitentscheide

1. **Jede Fundstelle ist eine Adresse.** Absatz und Erwägung sind Anker. Jede Eingabe eines
   Zitats führt an die Stelle; jedes Zitat im Text ist ein Link.
2. **Der Primärtext steht in der Mitte, alles Erschlossene am Rand.** Randtitel, Fussnoten,
   Verweise, Hinweise. Maschinell Erzeugtes ist gekennzeichnet und nie selbst Quelle.
3. **Die Fundstelle wandert mit.** Die Standzeile zeigt immer das zitierfähige Zitat der Stelle,
   an der man liest, in DE/FR/IT.
4. **Geltung ist sichtbar.** Ein Entscheid zeigt, wenn sich die Rechtslage seither geändert hat;
   eine Norm zeigt, welche Fassung am Stichtag galt.
5. **Gewicht wird ausgewiesen und begründet.** Die Form trägt die Bedeutung, die Begründung
   steht daneben und führt zu den Stellen.
6. **Keine Aussage ohne Beleg, und Lücken werden gesagt.** Das gilt für KI-Antworten wie für
   den Bestand: «nicht geladen», «kein Beleg», «Zuordnung unsicher».
7. **Bund und Kantone in einer Liste, nach Bedeutung.** Dubletten werden zusammengeführt und
   die Zusammenführung offengelegt.
8. **Tastatur zuerst, ohne Konto.** Mappen liegen im Browser; nichts verlässt das Gerät.

## 4. Gestaltungsrichtung: Satzspiegel

Vorbild ist die gesetzte Gesetzesausgabe mit Arbeitsrand, übersetzt in ein Werkzeug. Der Text
steht als ruhiger Block in einer Leseschrift (Literata), die Ziffern der Absätze und Erwägungen
hängen links heraus, der Rand trägt alles Erschlossene. Die Oberfläche spricht in einer schmalen
Grotesk (Archivo), Fundstellen in einer Festbreitenschrift, weil man sie abtippt und vergleicht.
Die Fläche ist kühl und papierhell, die Tinte fast schwarz. Es gibt eine einzige Farbe, das Blau
des Kopierstifts, für alles, was ein Verweis ist, und das Gelb des Leuchtstifts für die Stelle,
zu der man gesprungen ist. Linien statt Karten, Kanten statt Rundungen, keine Symbole. Gewicht
zeigt sich als Form (volles, halbes, schraffiertes, leeres Quadrat), damit es ohne Farbe und im
Ausdruck lesbar bleibt. Maschinelles liegt hinter einem schraffierten Rand.

Das eine Wagnis ist die schwarze Standzeile unter dem Kopf: ein lebender Kolumnentitel, der die
aktuelle Fundstelle als kopierbares Zitat führt.

## 5. Was der Prototyp zeigt

Lauffähig im Browser, ohne Abhängigkeiten: `prototype/index.html` öffnen. Vier Dateien
(`index.html`, `css/legeartis.css`, `js/data.js`, `js/app.js`); `build-single.py` baut daraus
eine einzige HTML-Datei.

| Arbeitsablauf | Im Prototyp |
|---|---|
| Zitat auflösen | Feld erkennt BGE mit Erwägung, Artikel mit Absatz, Geschäftsnummer; Sprung an die Stelle, hervorgehoben. Unbekannte Zitate werden erkannt und als nicht geladen gemeldet. |
| Norm in die Tiefe | Art. 333, 333a, 333b OR: Rechtsprechung je Absatz und nach Bedeutung, Botschaft mit Seite, verwandte Normen. |
| Rechtsfrage | Praxisübersicht mit sieben Aussagen, je Gewicht, Belege, Begründung. |
| Rechtsprechungslinie | 1971 bis 2014, Gericht und Gesetzgeber unterschieden, endet mit der Kodifikation. |
| Gewicht | Acht Stufen als Formen, mit Legende. |
| Zeitreise | Stichtag und drei Fassungen; zeigt, was neu war und ob Art. 333a/333b schon bestanden. |
| Mehrsprachigkeit | DE/FR/IT nebeneinander, mit Hinweis auf Abweichungen. |
| Sammeln | Mappen, Notizen, Zitat in DE/FR/IT mit oder ohne Seite, Zitat mit Wortlaut, Export. |
| Kantone | Eine Liste für Bund und Kantone, Kantonsleiste auf der Startseite. |

Tastatur: `/` Suche, `Ctrl/⌘ K` Befehle, `j` `k` bewegen, `c` kopieren, `m` Mappe, `s` geteilte
Ansicht, `t` Hell/Dunkel, `?` Übersicht.

### Echt und nicht echt

Echt und wörtlich übernommen (Opencaselaw und Fedlex, 12.11.2026): die Normtexte in drei
Sprachen samt Fussnoten, vier Regesten, acht Erwägungen von BGE 129 III 335, E. 4.3 von
BGE 137 III 487, die Botschaftsstellen, die Suchtreffer, die Zitierzahlen, die zitierenden und
zitierten Entscheide. Die Beispielantwort der Recherche wurde mit `attest_response` geprüft.

Redaktionell und als solches bezeichnet: die Gewichtung, die Rechtsprechungslinie, die Randtitel,
der Gang der Begründung, die Sprachhinweise. Sie stammen von mir und sind keine geprüfte
Kommentierung.

Nicht geladen und so bezeichnet: zehn Erwägungen von BGE 129 III 335 (nur Anfang), die übrigen
Entscheide ausser der Regeste, der Wortlaut vor 1994, das Amtliche Bulletin, freie Kommentare
zu Art. 333 OR. Seitenzahlen stehen nur dort, wo sie aus dem Seitenumbruch gesichert sind.

## 6. Datengrundlage und Lizenzen

| Quelle | Inhalt | Rechtslage |
|---|---|---|
| Fedlex (ELI, SPARQL, Akoma Ntoso) | SR, AS, BBl | Erlasse und amtliche Sammlungen sind nach Art. 5 Abs. 1 lit. a und Abs. 2 URG nicht geschützt. Eine ausdrückliche Lizenzseite war nicht auffindbar. |
| Bundesgericht, kantonale Gerichte | Entscheide | Nach Art. 5 Abs. 1 lit. c URG nicht geschützt. Anonymisierung und Publikationspraxis sind Sache der Gerichte. |
| opencaselaw.ch | Entscheide, Zitiergraph, Erwägungsstruktur | Daten CC0, Code MIT (Drittquelle, vor Übernahme zu bestätigen). |
| entscheidsuche.ch | Entscheide | Keine formelle Lizenz; Quellenangabe erbeten. Vor Übernahme Kontakt aufnehmen. |
| onlinekommentar.ch | Kommentare | CC BY 4.0: Übernahme mit Namensnennung zulässig. |
| LexFind | kantonale Erlasse | Erlasse frei; Nutzungsbedingungen der Sammlung zu klären. |
| Swisslex, Legalis, Weblaw, Stämpfli | Kommentare, Zeitschriften, redaktionelle Regesten | Urheberrechtlich geschützt, nicht nutzbar. Zulässig bleibt der Nachweis der Fundstelle, etwa wenn ein Entscheid sie zitiert. |

## 7. Architektur in Kürze

- **Aufnahme.** Tägliche Übernahme aus Fedlex (Fassungen als eigene Objekte mit Geltungsdauer)
  und aus den Entscheidsammlungen. Jede Einheit bekommt eine stabile Adresse bis auf Absatz,
  Buchstabe und Erwägung.
- **Zitat-Erkennung.** Regelbasierter Parser für BGE/ATF/DTF, Geschäftsnummern alter und neuer
  Schreibweise, Artikelzitate in drei Sprachen, BBl und AS. Jedes erkannte Zitat wird gegen den
  Bestand aufgelöst; Unaufgelöstes bleibt als solches sichtbar. Alte Artikelnummern werden über
  die Fassungsgeschichte auf die heutige Norm abgebildet.
- **Verknüpfungsgraph.** Kanten Entscheid zu Entscheid (mit Erwägung), Entscheid zu Norm (mit
  Absatz und Fassung), Norm zu Material. Daraus entstehen Bedeutung, Linie und der Hinweis
  «Rechtslage seither geändert» (Norm nach dem Urteilsdatum geändert oder ergänzt).
- **Suche.** Volltext (BM25) und semantische Suche kombiniert, Bedeutung als eigenes Signal,
  Dubletten über Datum, Gericht und Textanfang zusammengeführt.
- **Belegte Recherche.** Feste Abfolge wie im bestehenden Python-Werkzeug dieses Repositorys:
  Plan, Suche, Auswahl, Antwort nur mit Beleg-IDs, danach Prüfung der Zitate und der Deckung.
  Ohne Freigabe wird nichts als geprüft ausgegeben.
- **Gewichtung.** Redaktionell geführt, maschinell vorgeschlagen (Zitierhäufigkeit, Instanz,
  Signalwörter wie «Praxisänderung», «offen gelassen»), immer mit Begründung und Datum.

## 8. Selbstkritik aus drei Blickwinkeln

**Studentin, fünftes Semester, vor einer Falllösung.** Sie fand sich im Entscheid nicht zurecht,
weil 18 Erwägungen ohne Orientierung untereinander standen. Nachgebessert: Randtitel je
Erwägung, «Gang der Begründung» im Kopf, Kernstellen in der Gliederung markiert, methodischer
Hinweis bei E. 5.8 (teleologische Reduktion). Offen: Die Plattform sagt nicht, wie eine
KI-Recherche in einer Arbeit zu kennzeichnen ist; das bestehende Werkzeug hat dafür einen
Vermerk, der hier fehlt. Die Praxisübersicht nimmt ihr Denken ab, wenn sie sie zuerst liest.

**Anwalt, zwanzig Minuten bis zur Eingabe.** Ihn störte, dass ein Sprung den Text erst nach
einer Animation zeigte und dass in der geteilten Ansicht die linke Hälfte beim Öffnen eines
Verweises an den Anfang zurücksprang. Nachgebessert: Sprünge sind sofort, die andere Hälfte
bleibt stehen, «mit Wortlaut» kopiert das Zitat in Guillemets samt Fundstelle, der Hinweis auf
Art. 333b OR steht zuoberst. Offen: Seitenzahlen fehlen bei den meisten Erwägungen; kein
Export nach Word; kein Hinweis auf Übergangsrecht zu Art. 333b OR.

**Gerichtsschreiberin, prüft die Praxis ihrer Abteilung.** Das Zitationsnetz zeigte nur
Gerichtsebenen. Nachgebessert: Gruppierung nach Gericht und Abteilung; so fällt auf, dass
2025/26 vor allem die II. öffentlich-rechtliche Abteilung den Entscheid zitiert. Offen: Es sind
14 von 178 zitierenden Entscheiden geladen; zu welcher Erwägung sie zitieren, ist nicht
ausgewertet; unpublizierte Praxis und Entscheide vor 2000 fehlen im freien Bestand.

## 9. Grenzen

- Der Prototyp deckt einen Fall ab. Suche, Recherche und Zeitreise arbeiten auf diesem
  Ausschnitt, nicht auf einem Index.
- Barrierefreiheit: Tastaturbedienung, Fokus, Kontraste und reduzierte Bewegung sind umgesetzt,
  ein Test mit Bildschirmleser steht aus. WCAG 2.2 AA ist damit angestrebt, nicht nachgewiesen.
- Geprüft wurde in Chromium bei 1440 und 400 Pixeln Breite, hell und dunkel, ohne
  Skriptfehler und ohne seitliches Überlaufen. Andere Browser sind nicht getestet.
