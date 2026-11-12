/* Legeartis-Prototyp: Datenbestand.
   Alle Normtexte, Regesten, Erwägungen, Zitierstrings und Treffer wurden am 12.11.2026 über die
   MCP-Server Opencaselaw und Fedlex abgerufen und wörtlich übernommen. «⟦S. n⟧» markiert einen
   Seitenwechsel der amtlichen Sammlung. Redaktionelle Einordnungen (Gewichtung, Linie) sind als
   solche gekennzeichnet; sie sind Prototyp-Beispiele, keine geprüfte Kommentierung. */
var LA = window.LA = window.LA || {};
LA.stand = "12.11.2026";

LA.normen = {
  "OR-333": {
    id: "OR-333", erlass: "OR", sr: "220", art: "333", stand: "1.10.2026",
    titel: { de: "Obligationenrecht", fr: "Code des obligations", it: "Codice delle obbligazioni" },
    gliederung: "Zehnter Titel: Der Arbeitsvertrag",
    hinweisGliederung: "Marginalie im Prototyp nicht geladen",
    eli: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_333",
    abs: [
      { nr: "1", fn: 1,
        de: "Überträgt der Arbeitgeber den Betrieb oder einen Betriebsteil auf einen Dritten, so geht das Arbeitsverhältnis mit allen Rechten und Pflichten mit dem Tage der Betriebsnachfolge auf den Erwerber über, sofern der Arbeitnehmer den Übergang nicht ablehnt.",
        fr: "Si l’employeur transfère l’entreprise ou une partie de celle-ci à un tiers, les rapports de travail passent à l’acquéreur avec tous les droits et les obligations qui en découlent, au jour du transfert, à moins que le travailleur ne s’y oppose.",
        it: "Se il datore di lavoro trasferisce l’azienda o una parte di essa a un terzo, il rapporto di lavoro passa con tutti i diritti e gli obblighi all’acquirente al momento del trasferimento dell’azienda, in quanto il lavoratore non vi si opponga." },
      { nr: "1bis", fn: 2,
        de: "Ist auf das übertragene Arbeitsverhältnis ein Gesamtarbeitsvertrag anwendbar, so muss der Erwerber diesen während eines Jahres einhalten, sofern er nicht vorher abläuft oder infolge Kündigung endet.",
        fr: "Si les rapports de travail transférés sont régis par une convention collective, l’acquéreur est tenu de la respecter pendant une année pour autant qu’elle ne prend pas fin du fait de l’expiration de la durée convenue ou de sa dénonciation.",
        it: "Se al rapporto di lavoro oggetto del trasferimento è applicabile un contratto collettivo, l’acquirente è tenuto ad osservarlo per un anno, sempreché non cessi prima per scadenza o disdetta." },
      { nr: "2",
        de: "Bei Ablehnung des Überganges wird das Arbeitsverhältnis auf den Ablauf der gesetzlichen Kündigungsfrist aufgelöst; der Erwerber des Betriebes und der Arbeitnehmer sind bis dahin zur Erfüllung des Vertrages verpflichtet.",
        fr: "En cas d’opposition, les rapports de travail prennent fin à l’expiration du délai de congé légal; jusque-là, l’acquéreur et le travailleur sont tenus d’exécuter le contrat.",
        it: "Nel caso di opposizione, il rapporto di lavoro è sciolto alla scadenza del termine legale di disdetta; sino a tale momento, l’acquirente dell’azienda e il lavoratore sono tenuti ad adempiere il contratto." },
      { nr: "3",
        de: "Der bisherige Arbeitgeber und der Erwerber des Betriebes haften solidarisch für die Forderungen des Arbeitnehmers, die vor dem Übergang fällig geworden sind und die nachher bis zum Zeitpunkt fällig werden, auf den das Arbeitsverhältnis ordentlicherweise beendigt werden könnte oder bei Ablehnung des Überganges durch den Arbeitnehmer beendigt wird.",
        fr: "L’ancien employeur et l’acquéreur répondent solidairement des créances du travailleur échues dès avant le transfert jusqu’au moment où les rapports de travail pourraient normalement prendre fin ou ont pris fin par suite de l’opposition du travailleur.",
        it: "Il precedente datore di lavoro e l’acquirente dell’azienda rispondono solidalmente dei crediti del lavoratore divenuti esigibili prima del trasferimento e dopo sino al momento in cui il rapporto di lavoro possa essere sciolto normalmente od è sciolto per opposizione del lavoratore al trasferimento." },
      { nr: "4",
        de: "Im übrigen ist der Arbeitgeber nicht berechtigt, die Rechte aus dem Arbeitsverhältnis auf einen Dritten zu übertragen, sofern nichts anderes verabredet ist oder sich aus den Umständen ergibt.",
        fr: "Au surplus, l’employeur ne peut pas transférer à un tiers les droits découlant des rapports de travail, à moins que le contraire n’ait été convenu ou ne résulte des circonstances.",
        it: "Per altro, il datore di lavoro non può trasferire a un terzo i diritti derivanti dal rapporto di lavoro, in quanto il contrario non risulti da un accordo o dalle circostanze." }
    ],
    fussnoten: {
      1: { de: "Fassung gemäss Ziff. I des BG vom 17. Dez. 1993, in Kraft seit 1. Mai 1994 (AS 1994 804; BBl 1993 I 805).",
           fr: "Nouvelle teneur selon le ch. I de la LF du 17 déc. 1993, en vigueur depuis le 1er mai 1994 (RO 1994 804; FF 1993 I 757).",
           it: "Nuovo testo giusta la cifra I della LF del 17 dic. 1993, in vigore dal 1° mag. 1994 (RU 1993 804; FF 1993 I 609)." },
      2: { de: "Eingefügt durch Ziff. I des BG vom 17. Dez. 1993, in Kraft seit 1. Mai 1994 (AS 1994 804; BBl 1993 I 805).",
           fr: "Introduit par le ch. I de la LF du 17 déc. 1993, en vigueur depuis le 1er mai 1994 (RO 1994 804; FF 1993 I 757).",
           it: "Introdotto dalla cifra I della LF del 17 dic. 1993, in vigore dal 1° mag. 1994 (RU 1993 804; FF 1993 I 609)." }
    },
    sprachbefund: [
      { abs: "3", text: "Abs. 3 ist im Deutschen und Italienischen zweigliedrig gebaut («vor dem Übergang fällig geworden … und die nachher … fällig werden» / «prima del trasferimento e dopo sino al momento»), im Französischen einteilig («échues dès avant le transfert jusqu’au moment où»). Die drei Fassungen sind gleichwertig; die Abweichung ist ein Ansatzpunkt für das grammatikalische Element." },
      { abs: "1", text: "Die italienische Fussnote nennt «RU 1993 804», die deutsche und französische «AS/RO 1994 804». Abweichung in den Fedlex-Daten, an der Quelle zu prüfen." }
    ]
  },
  "OR-333a": {
    id: "OR-333a", erlass: "OR", sr: "220", art: "333a", stand: "1.10.2026",
    titel: { de: "Obligationenrecht" }, gliederung: "Zehnter Titel: Der Arbeitsvertrag",
    eli: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_333a",
    abs: [
      { nr: "1", de: "Überträgt ein Arbeitgeber den Betrieb oder einen Betriebsteil auf einen Dritten, so hat er die Arbeitnehmervertretung oder, falls es keine solche gibt, die Arbeitnehmer rechtzeitig vor dem Vollzug des Übergangs zu informieren über:",
        lit: [ { l: "a", de: "den Grund des Übergangs;" }, { l: "b", de: "die rechtlichen, wirtschaftlichen und sozialen Folgen des Übergangs für die Arbeitnehmer." } ] },
      { nr: "2", de: "Sind infolge des Übergangs Massnahmen beabsichtigt, welche die Arbeitnehmer betreffen, so ist die Arbeitnehmervertretung oder, falls es keine solche gibt, sind die Arbeitnehmer rechtzeitig vor dem Entscheid über diese Massnahmen zu konsultieren." }
    ],
    artFn: { de: "Eingefügt durch Ziff. I des BG vom 17. Dez. 1993, in Kraft seit 1. Mai 1994 (AS 1994 804; BBl 1993 I 805)." }
  },
  "OR-333b": {
    id: "OR-333b", erlass: "OR", sr: "220", art: "333b", stand: "1.10.2026",
    titel: { de: "Obligationenrecht", fr: "Code des obligations", it: "Codice delle obbligazioni" },
    gliederung: "Zehnter Titel: Der Arbeitsvertrag",
    eli: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_333b",
    abs: [
      { nr: "",
        de: "Wird der Betrieb oder der Betriebsteil während einer Nachlassstundung, im Rahmen eines Konkurses oder eines Nachlassvertrages mit Vermögensabtretung übertragen, so geht das Arbeitsverhältnis mit allen Rechten und Pflichten auf den Erwerber über, wenn dies mit dem Erwerber so vereinbart wurde und der Arbeitnehmer den Übergang nicht ablehnt. Im Übrigen gelten die Artikel 333, ausgenommen dessen Absatz 3, und 333a sinngemäss.",
        fr: "Lorsque l’entreprise ou une partie de celle-ci est transférée à un tiers durant un sursis concordataire dans le cadre d’une faillite ou dans celui d’un concordat par abandon d’actifs, les rapports de travail passent à l’acquéreur avec tous les droits et les obligations qui en découlent pour autant que ce transfert ait été convenu avec l’acquéreur et que le travailleur ne s’y oppose pas. Pour le reste, les art. 333, à l’exception de l’al. 3, et 333a sont applicables par analogie.",
        it: "Se l’azienda o una parte di essa è trasferita a un terzo nel corso di una moratoria concordataria a seguito di un fallimento o di un concordato con abbandono dell’attivo, il rapporto di lavoro passa con tutti i diritti e gli obblighi all’acquirente se tale trasferimento è stato concordato con l’acquirente e il lavoratore non vi si oppone. Per il resto si applicano per analogia gli articoli 333, eccettuato il capoverso 3, e 333a." }
    ],
    artFn: { de: "Eingefügt durch Anhang des BG vom 21. Juni 2013, in Kraft seit 1. Jan. 2014 (AS 2013 4111; BBl 2010 6455).",
             fr: "Introduit par l’annexe de la LF du 21 juin 2013, en vigueur depuis le 1er janv. 2014 (RO 2013 4111; FF 2010 5871).",
             it: "Introdotto dall’all. della LF del 21 giu. 2013, in vigore dal 1° gen. 2014 (RU 2013 4111; FF 2010 5667)." },
    sprachbefund: [
      { abs: "", text: "Deutsch: «während einer Nachlassstundung, im Rahmen eines Konkurses oder eines Nachlassvertrages» (drei Fälle, Komma). Französisch: «durant un sursis concordataire dans le cadre d’une faillite ou dans celui d’un concordat» (ohne Komma). Italienisch: «nel corso di una moratoria concordataria a seguito di un fallimento o di un concordato». Die romanischen Fassungen lassen sich enger lesen als die deutsche." }
    ]
  }
};

/* Zeitachse zu Art. 333 ff. OR. Quellen: Fussnoten Fedlex; BGE 129 III 335 E. 2.2 und 5.1. */
LA.zeitachse = [
  { von: "0000-00-00", bis: "1994-04-30", label: "Fassung vom 25. Juni 1971", kurz: "bis 30.4.1994",
    text333: null,
    hinweis: "Wortlaut dieser Fassung ist bei Fedlex nicht maschinenlesbar verfügbar. Nach BGE 129 III 335 E. 5.1 konnte der Betriebserwerber «nach altem Recht den Übergang der Arbeitsverhältnisse ablehnen».",
    beleg: { typ: "entscheid", id: "BGE-129-III-335", e: "5.1" }, a333a: false, a333b: false },
  { von: "1994-05-01", bis: "2013-12-31", label: "Revision vom 17. Dezember 1993", kurz: "1.5.1994 bis 31.12.2013",
    aenderung: "Abs. 1 neu gefasst, Abs. 1bis und Art. 333a eingefügt (AS 1994 804; BBl 1993 I 805). Abs. 3 unverändert (BGE 129 III 335 E. 5.2).",
    geaendert: ["1", "1bis"], a333a: true, a333b: false,
    hinweis: "Der Konkursfall ist im Gesetz nicht geregelt. BGE 129 III 335 (2003) schliesst die Solidarhaftung des Erwerbers bei Übernahme aus der Konkursmasse richterlich aus." },
  { von: "2014-01-01", bis: "9999-12-31", label: "Sanierungsrecht, BG vom 21. Juni 2013", kurz: "seit 1.1.2014",
    aenderung: "Art. 333b eingefügt (AS 2013 4111; BBl 2010 6455). Art. 333 unverändert.",
    geaendert: [], a333a: true, a333b: true,
    hinweis: "Der Gesetzgeber regelt die Übertragung in Nachlassstundung, Konkurs und Nachlassvertrag mit Vermögensabtretung. Art. 333 Abs. 3 ist dort ausdrücklich ausgenommen." }
];
LA.pending = { datum: "2027-07-01", text: "Für SR 220 ist eine Änderung per 1.7.2027 angekündigt. Ob Art. 333 ff. betroffen sind, ist im Prototyp nicht geprüft." };

LA.materialien = [
  { id: "BBl-2010-6455", zitat: "BBl 2010 6455", titel: "Botschaft zur Änderung des Bundesgesetzes über Schuldbetreibung und Konkurs (Sanierungsrecht)", datum: "12.10.2010", zu: "Art. 333b OR",
    eli: "https://fedlex.data.admin.ch/eli/fga/2010/1144",
    stellen: [
      { s: 6494, text: "Art. 333b Übergang der Arbeitsverhältnisse bei Betriebsübernahme\nNach geltendem Recht tritt der Übergang der Arbeitsverhältnisse bei Betriebsveräusserungen von Gesetzes wegen ein. Der bisherige Arbeitgeber wird auf dem Wege einer Einzelrechtsnachfolge durch den neuen Arbeitgeber ersetzt.", art: "wörtlich" },
      { s: 6495, text: "…Artikel 333 OR sei − mit Ausnahme der in Absatz 3 geregelten Solidarhaftung des Übernehmers − auch im Falle der Betriebsübernahme aus dem Konkurs zur…", art: "Ausschnitt der Volltextsuche" },
      { s: 6496, text: "…Artikel 333b OR hält deshalb fest, dass dann, wenn der Betrieb während der Nachlasstundung, im Rahmen eines Konkurses oder eines Nachlassvertrages mit Vermö…", art: "Ausschnitt der Volltextsuche" },
      { s: 6465, text: "Die mit dem Vorentwurf vorgeschlagene Revision von Artikel 333 OR wurde in der Vernehmlassung vonseiten der Arbeitnehmerverbände scharf kritisiert. Die vorgeschlagene Regelung bildet aber nach Ansicht des Bundesrates unentbehrlicher Bestandteil eines effektiven Sanierungsrechts, sodass darauf nicht verzichtet werden kann. Als Ausgleich für diese Neuerung wird vorgeschlagen, eine allgemeine Sozialplanpflicht ins Obligationenrecht einzuführen.", art: "wörtlich" }
    ] },
  { id: "BBl-1993-I-805", zitat: "BBl 1993 I 805", titel: "Botschaft über das Folgeprogramm nach der Ablehnung des EWR-Abkommens («Swisslex»)", datum: "24.2.1993", zu: "Art. 333 Abs. 1 und 1bis, Art. 333a OR",
    eli: "https://fedlex.data.admin.ch/eli/fga/1993/1_805_757_609", stellen: [],
    hinweis: "Fundstelle aus der Fedlex-Fussnote und aus BGE 129 III 335 E. 5.1 (dort S. 880 f.). Text im Prototyp nicht geladen." },
  { id: "BBl-1967-II-241", zitat: "BBl 1967 II 241", titel: "Botschaft zum Entwurf eines Bundesgesetzes über die Revision des Zehnten Titels und des Zehnten Titelsbis des Obligationenrechts (Der Arbeitsvertrag)", datum: "25.8.1967", zu: "Art. 333 OR in der Fassung von 1971",
    stellen: [], hinweis: "Fundstelle aus BGE 129 III 335 E. 5.1 (dort S. 371). Text im Prototyp nicht geladen." }
];

LA.entscheide = {
  "BGE-129-III-335": {
    id: "BGE-129-III-335", zitat: { de: "BGE 129 III 335", fr: "ATF 129 III 335", it: "DTF 129 III 335" },
    gericht: "Bundesgericht", abteilung: "I. Zivilabteilung", datum: "25.3.2003", jahr: 2003, sprache: "de",
    docket: "4C.316/2002", art: "Leitentscheid (BGE)", zitiertVon: 178, startseite: 335,
    parteien: "Öffentliche Arbeitslosenkasse des Kantons Solothurn gegen Metallbau X. GmbH (Berufung)",
    url: "https://mcp.opencaselaw.ch/entscheid/bge_129%20III%20335",
    rechtslage: { text: "Rechtslage seither geändert: Seit 1.1.2014 regelt Art. 333b OR die Übertragung im Konkurs ausdrücklich und nimmt Art. 333 Abs. 3 OR aus.", ziel: { typ: "norm", id: "OR-333b" } },
    regeste: {
      de: "Anwendbarkeit von Art. 333 Abs. 3 OR bei Erwerb eines Betriebes aus dem Konkurs des früheren Inhabers. Wer einen Betrieb erwirbt und mit den Arbeitnehmern die im Zeitpunkt der Übernahme bestehenden Arbeitsverhältnisse weiterführt, haftet nicht für offene, vor der Übernahme fällig gewordene Lohnforderungen aus den Arbeitsverhältnissen, wenn die Übernahme des Betriebes aus der Konkursmasse des bisherigen Arbeitgebers erfolgt ist. Auslegung von Art. 333 OR nach Wortlaut, Sinn und Zweck und den ihm zugrunde liegenden Wertungen und Zielsetzungen (E. 4 und 5). Europarechtskonforme Auslegung und Berücksichtigung von Reformbestrebungen des schweizerischen Gesetzgebers (E. 6 und 7).",
      fr: "Applicabilité de l'art. 333 al. 3 CO lors de l'acquisition d'une entreprise après la faillite du précédent propriétaire. Celui qui acquiert une entreprise et poursuit avec les travailleurs les rapports de travail existant avant la reprise ne répond pas des créances de salaire pendantes, qui étaient devenues exigibles avant la reprise, si la reprise de l'entreprise est survenue à la suite de la faillite du précédent employeur. Interprétation de l'art. 333 CO d'après son texte, son esprit et son but ainsi que d'après les valeurs sur lesquelles il repose (consid. 4 et 5). Interprétation conforme au droit européen et prise en considération des aspirations de réforme du législateur suisse (consid. 6 et 7).",
      it: "Applicabilità dell'art. 333 cpv. 3 CO in caso di acquisto di un'azienda nel quadro del fallimento del precedente proprietario. Chi acquista un'azienda dalla massa fallimentare del precedente proprietario e prosegue i rapporti di lavoro esistenti al momento del trasferimento non risponde dei crediti salariali insoluti, divenuti esigibili prima del trasferimento. Interpretazione letterale, sistematica, teleologica e storica dell'art. 333 CO, tenuto conto dei valori su cui si fonda tale norma (consid. 4 e 5). Interpretazione conforme al diritto europeo e considerazione delle tendenze riformative del legislatore svizzero (consid. 6 e 7)."
    },
    sachverhalt: [
      { l: "A.", text: "Am 29. Juni 2000 wurde über den Inhaber der Einzelfirma Metallbau E.X. der Konkurs eröffnet. Das Inventar der Einzelfirma wurde von der am 26. Mai 2000 gegründeten Metallbau X. GmbH (Beklagten) zwecks Fortführung der Betriebstätigkeit aus der Konkursmasse übernommen. Der zwischen dem für die Konkursmasse ⟦S. 336⟧ handelnden Konkursamt Lebern und der Beklagten abgeschlossene Vertrag vom 21. Juli 2000 sah vor, dass das Inventar zunächst in Miete übernommen, jedoch später käuflich erworben würde. Am 29. November und 21. Dezember 2000 wurden entsprechende Kaufverträge abgeschlossen. Der Metallbaubetrieb ist im Anschluss an die Konkurseröffnung lediglich einen Tag stillgestanden." },
      { l: "B.", text: "Die Öffentliche Arbeitslosenkasse des Kantons Solothurn (Klägerin) bezahlte im Zusammenhang mit dem Konkurs der Einzelfirma Insolvenzentschädigungen und darauf zu entrichtende Sozialversicherungsbeiträge von insgesamt Fr. 80'912.90.", rest: true }
    ],
    erw: [
      { nr: "1", tiefe: 1, anfang: "Die Klägerin macht die nach Art. 54 Abs. 1 des Bundesgesetzes vom 25. Juni 1982 über die obligatorische Arbeitslosenversicherung und die Insolvenzentschädigung (AVIG; SR 837.0) zufolge Ausrichtung der Insolvenzentschädigungen auf sie übergegangenen L…" },
      { nr: "2.1", tiefe: 2, anfang: "Überträgt der Arbeitgeber den Betrieb oder einen Betriebsteil auf einen Dritten, geht nach Art. 333 Abs. 1 OR das Arbeitsverhältnis mit allen Rechten und Pflichten mit dem Tage der Betriebsnachfolge auf den Erwerber über, sofern der Arbeitnehmer den …" },
      { nr: "2.2", tiefe: 2, thema: "Meinungsstand vor dem Entscheid",
        text: "Die Antwort auf die Frage, ob Art. 333 OR auch bei Übernahme eines Betriebs nach der Konkurseröffnung über den ursprünglichen Inhaber anwendbar ist, lässt sich dem Gesetzestext nicht unmittelbar entnehmen. Der Konkursfall wird weder in der ursprünglichen, bis zum 30. April 1994 geltenden, noch in der revidierten Fassung der Bestimmung erwähnt, was je nach Betrachtungsweise sowohl dessen Einschluss wie auch Ausschluss bedeuten kann. Ebenso wenig liefern die Materialien klare Anhaltspunkte, was dazu beiträgt, dass die Lehrmeinungen zur Frage geteilt sind:\nEin Teil der Lehre befürwortet eine uneingeschränkte Geltung von Art. 333 OR bei einem Betriebserwerb aus Konkurs oder im Nachlassverfahren (STAEHELIN, a.a.O., N. 3 zu Art. 333 OR; FRANCO LORANDI, Betriebsübernahmen gemäss Art. 333 OR im Zusammenhang mit Sanierungen und Zwangsvollstreckungsverfahren, in: Angst/Cometta/Gasser [Hrsg.], Schuldbetreibung und Konkurs im Wandel, Festschrift 75 Jahre Konferenz der Betreibungs- und Konkursbeamten der Schweiz, Basel 2000, S. 95 ff.; KURT MEIER, Betriebsübergang im Nachlass und Konkurs, Plädoyer 2003 1 S. 26 ff., 31 ff.). Andere Autoren vertreten die Ansicht, Art. 333 OR sei im Konkurs- und Nachlassverfahren nicht anwendbar (VOLLMAR, Basler Kommentar, N. 18 zu Art. 298 SchKG; SPÜHLER/INFANGER, Betriebsübergänge und Arbeitsverträge in der Zwangsvollstreckung - Anwendung von Art. 333 OR im Konkurs und Nachlassvertrag?, in: Angst/Cometta/Gasser [Hrsg.], Schuldbetreibung und ⟦S. 339⟧ Konkurs im Wandel, Festschrift 75 Jahre Konferenz der Betreibungs- und Konkursbeamten der Schweiz, Basel 2000, S. 225 ff.; für das Nachlassverfahren differenzierend: WYLER, a.a.O., S. 312; modifiziert auch AUBERT, Insolvence et transfert d'entreprise, in: Bénédict Foëx et Luc Thévenoz [Hrsg.], Insolvence, désendettement et redressement, Etudes réunies en l'honneur de Louis Dallèves, Basel 2000, S. 11 [im Folgenden als \"AUBERT, 2000\" zitiert]). RICO A. CAMPONOVO (Übernahme von Arbeitsverhältnissen gemäss Art. 333 OR bei Unternehmenssanierungen, Der Schweizer Treuhänder 1998 S. 1417 ff.) lehnt eine Anwendung von Art. 333 gar in jedem Sanierungsfall ab. Nach einer differenzierenden Lehrmeinung gehen die Arbeitsverhältnisse bei einer Betriebsübernahme aus einer Konkursmasse nach Art. 333 OR zwar auf den Erwerber über, allerdings unter Ausschluss von dessen Solidarhaft für vor der Konkurseröffnung verfallene Lohnforderungen (GEISER, Betriebsübernahme, a.a.O., S. 103; derselbe, Betriebsübernahme der X AG durch die Y AG - Gutachten zur Frage der Anwendbarkeit von Art. 333 OR, Nr. 68 der Reihe Diskussionspapiere des Forschungsinstituts für Arbeit und Arbeitsrecht an der Universität St. Gallen, St. Gallen 2001, Rz. 2.46 [www.faa.unisg.ch/projekte/projekte_juristische_abteilung_site.htm; im Folgenden zitiert als \"GEISER, Gutachten\"]; HANS HOFSTETTER, Zur Anwendbarkeit von Art. 333 OR bei Unternehmenssanierungen, AJP 1998 S. 926 ff. [im Folgenden als \"HOFSTETTER, 1998\" zitiert]; derselbe, Anwendbarkeit von Art. 333 in Sanierungssituationen, AJP 2003 S. 153 [im Folgenden: \"HOFSTETTER, 2003\" zitiert]).",
        rand: [ { art: "lehre", text: "Drei Lager: uneingeschränkte Geltung (Staehelin, Lorandi, Meier), keine Anwendung (Vollmar, Spühler/Infanger, Camponovo), Übergang ohne Solidarhaft (Geiser, Hofstetter)." } ] },
      { nr: "3", tiefe: 1, anfang: "Die Beklagte hat die Betriebsaktiven der Einzelfirma Metallbau E.X. zunächst mietweise und anschliessend als Käuferin übernommen. Die mit der Einzelfirma bestehenden Arbeitsverhältnisse wurden von ihr nach der Betriebsübernahme unbestrittenermassen w…" },
      { nr: "4", tiefe: 1, thema: "Methode der Auslegung",
        text: "Das Gesetz ist in erster Linie aus sich selbst, d.h. nach Wortlaut, Sinn und Zweck und den ihm zugrunde liegenden Wertungen und Zielsetzungen auszulegen; dabei hat sich die Gesetzesauslegung vom Gedanken leiten zu lassen, dass nicht schon der Wortlaut die Rechtsnorm darstellt, sondern erst das an Sachverhalten verstandene und konkretisierte Gesetz. Gefordert ist die sachlich richtige Entscheidung im normativen Gefüge, ausgerichtet auf ein befriedigendes Ergebnis aus der ratio legis (grundlegend: BGE 121 III 219 E. 1d/aa S. 225 f.; BGE 128 I 34 E. 3b S. 40 f.; BGE 128 III 113 E. 2a; BGE 125 II 192 E. 3a; BGE 124 IV 106 E. 3a, je mit Hinweisen)." },
      { nr: "5", tiefe: 1, anfang: "Wie bereits erwähnt, äussern sich weder der Wortlaut von Art. 333 Abs. 3 OR noch die Materialien explizit darüber, ob der Erwerber für vor der Betriebsübernahme fällig gewordene Lohnforderungen haftet, wenn die Übernahme aus einer Konkursmasse erfolg…" },
      { nr: "5.1", tiefe: 2, thema: "Zweck von Abs. 1; Revision 1993",
        text: "Der Zweck von Art. 333 Abs. 1 OR in der Fassung vom 25. Juni 1971 bestand nur darin, den Übergang von Unternehmen zu erleichtern und dem Erwerber des Betriebes die eingearbeiteten Arbeitskräfte nach Möglichkeit zu sichern (BGE 127 V 183 E. 4b; ⟦S. 341⟧ AUBERT, 1994, a.a.O., S. 703). Der unveränderte Übergang des Arbeitsverhältnisses liegt grundsätzlich auch im Interesse der Arbeitnehmer, weil gewisse Ansprüche, wie diejenigen auf Ferien, auf Lohnzahlung bei Verhinderung an der Arbeitsleistung oder auf Abgangsentschädigung sowie die Kündigungsfrist von der Dauer des Arbeitsverhältnisses abhängig sind, die durch den Übergang nicht unterbrochen wird (sog. \"Besitzstandswahrung\" BGE 127 V 183 E. 4c; Botschaft des Bundesrates vom 25. August 1967 zum Entwurf eines Bundesgesetzes über die Revision des Zehnten Titels und des Zehnten Titelsbis des Obligationenrechts [Der Arbeitsvertrag], BBl 1967 II 241ff., S. 371; HOFSTETTER, 1998, a.a.O., S. 927). Allerdings konnte der Betriebserwerber nach altem Recht den Übergang der Arbeitsverhältnisse ablehnen. In diesem Fall wurden die genannten Interessen der Arbeitnehmer beeinträchtigt. Mit der Revision vom 17. Dezember 1993, in Kraft seit 1. Mai 1994 (im Folgenden: \"Revision 1993\") wurde Art. 333 Abs. 1 OR daher im Rahmen des so genannten \"Swisslex-Programms\" in der Weise abgeändert, dass die im Zeitpunkt der Übertragung des Betriebes auf einen Dritten bestehen Arbeitsverhältnisse von Gesetzes wegen auf den Erwerber übergehen, selbst wenn dies gegen seinen Willen geschehen sollte (BGE 127 V 183 E. 4d; BGE 123 III 466 E. 3b). Damit wurde das schweizerische Recht insoweit der Richtlinie Nr. 77/187 des EWG-Rates vom 14. Februar 1977 zur Angleichung der Rechtsvorschriften der Mitgliedstaaten über die Wahrung von Ansprüchen der Arbeitnehmer beim Übergang von Unternehmen, Betrieben oder Betriebsteilen (ABl. L 61 vom 5. März 1977, S. 26 ff.) angepasst, mit der die umfassende Wahrung der Interessen der betroffenen Arbeitnehmer beim Betriebsübergang angestrebt wird (BGE 127 V 183 E. 4b mit zahlreichen Hinweisen; Botschaft I über die Anpassung des Bundesrechts an das EWR-Recht vom 27. Mai 1992 [\"Eurolex\"], BBl 1992 V 1, S. 394 ff., 400 f.; Botschaft über das Folgeprogramm nach der Ablehnung des EWR-Abkommens vom 24. Februar 1993 [\"Swisslex\"], BBl 1993 I 805ff., S. 880 f.; vgl. auch AUBERT, 1994, a.a.O., S. 699)." },
      { nr: "5.2", tiefe: 2, seite: "341 f.", thema: "Wortlaut von Abs. 3; relativ zwingend",
        text: "Der Absatz 3 von Art. 333 OR über die Solidarhaftung von Betriebsveräusserer und Betriebserwerber für Lohnforderungen wurde in der Revision 1993 nicht geändert. Da der Erwerber den Übergang der Arbeitsverhältnisse nach der neuen Regelung nicht mehr ablehnen kann, hat Art. 333 OR seinem Wortlaut nach zur Folge, dass ein Erwerber stets für die vor der Betriebsübernahme fällig gewordenen Lohnforderungen solidarisch haftet. Aufgrund ⟦S. 342⟧ der relativ zwingenden Natur von Art. 333 Abs. 3 OR (Art. 362 OR) ist es nicht möglich, diese Haftung in einer Vereinbarung zwischen den Arbeitnehmern und dem Erwerber auszuschliessen." },
      { nr: "5.3", tiefe: 2, thema: "Auffassung der Vorinstanz und der überwiegenden Lehre",
        text: "Die Vorinstanz ging mit einem überwiegenden Teil der Lehre davon aus, dass dieser Umstand Übernahmen aus dem Konkurs erschweren oder verunmöglichen könne, da der bisherige Arbeitgeber insbesondere in Konkursfällen oftmals mit Lohnzahlungen stark im Rückstand sei und eine Solidarhaftung für den Betriebserwerber mit schwerwiegenden Belastungen verbunden wäre (vgl. insbes. VOLLMAR, a.a.O., N. 18 zu Art. 298 SchKG; GEISER, Betriebsübernahme, a.a.O., S. 103, 111; derselbe, Sanierungen, a.a.O., S. 132; HOFSTETTER, 1998, a.a.O., S. 926 f., 929; derselbe, 2003, a.a.O., S. 156; SPÜHLER/INFANGER, a.a.O., S. 226 f., 229; LORANDI, a.a.O., S. 95; MEIER, a.a.O., S. 28). Die Annahme einer Solidarhaftung getreu dem Wortlaut von Art. 333 Abs. 3 OR auch im Fall, in dem die Betriebsübernahme aus einer Konkursmasse erfolge, widerspreche damit dem Sinn und Zweck der Norm. Damit würde die Absicht des Gesetzgebers, den Schutz der Arbeitnehmer bei Übergang eines Betriebes zu verstärken, in ihr Gegenteil verkehrt. Den Arbeitnehmern und der Volkswirtschaft sei mehr gedient, wenn ein neuer Arbeitgeber gefunden werde, der zwar für ausstehende Lohnforderungen nicht hafte, aber immerhin den Betrieb weiterführe und die Arbeitsplätze erhalte. Ausstehende Lohnforderungen dürften in der Regel durch die Insolvenzentschädigung gedeckt sein und die Arbeitnehmer in dieser Hinsicht daher keinen Schaden erleiden. Aufgrund des gesetzlichen Konkursprivilegs bestehe für die in die Lohnforderungen subrogierende Arbeitslosenkasse die reelle Möglichkeit, zumindest für einen Teil der bezahlten Gelder nachträglich aus der Konkursmasse befriedigt zu werden." },
      { nr: "5.4.1", tiefe: 3, anfang: "Zweck der solidarischen Haftung der alten und neuen Arbeitgeber nach Art. 333 Abs. 3 OR, wie sie in der Fassung vom 25. Juni 1971 statuiert wurde, war der Schutz der Arbeitnehmer vor neuen Arbeitgebern, deren Bonität sie nicht kannten (…" },
      { nr: "5.4.2", tiefe: 3, anfang: "Eine weitere Funktion der Solidarhaftung des Betriebserwerbers nach Art. 333 Abs. 3 OR neben derjenigen, den Arbeitnehmer vor Insolvenz des neuen Arbeitgebers zu schützen, kann darin gesehen werden, zu verhindern, dass sich der bisherige Arbeitgeber …" },
      { nr: "5.5", tiefe: 2, anfang: "Die Klägerin bestreitet nicht grundsätzlich, dass eine Übernahme eines Betriebes aus der Konkursmasse für einen potentiellen Erwerber uninteressant werden könnte, wenn er für ausstehende Lohnforderungen aus der Zeit vor der Konkurseröffnung einzusteh…" },
      { nr: "5.6", tiefe: 2, anfang: "Auch bei systematischer Betrachtung im Zusammenhang mit dem Konkursrecht kann nicht davon ausgegangen werden, dass es bei der Revision 1993 der Wille des Gesetzgebers war, bei Übernahmen eines Betriebes aus einer Konkursmasse eine unabdingbare Solida…" },
      { nr: "5.7", tiefe: 2, anfang: "Die Klägerin befürchtet, dass die Verneinung der Solidarhaft des Erwerbers bei Übernahmen aus der Konkursmasse im Ergebnis dazu führt, dass im Rahmen von Sanierungen Lohnkosten missbräuchlich auf die Arbeitslosenversicherung abgewälzt werden können. …" },
      { nr: "5.8", tiefe: 2, thema: "Ergebnis: Auslegung contra verba legis", kern: true,
        text: "Im Hinblick auf den mit der Revision 1993 angestrebten Zweck der Regelung von Art. 333 OR, ist nach dem Dargelegten eine Solidarhaft des Erwerbers eines Betriebes aus der Konkursmasse im Sinne von Art. 333 Abs. 3 OR in Auslegung contra verba legis auszuschliessen (vgl. BGE 121 III 219 E. 1d/aa S. 226; Erwägung 4 vorne; ähnlich HOFSTETTER, 1998, a.a.O., S. 930 f.; derselbe, 2003, a.a.O., S. 156). ⟦S. 350⟧",
        rand: [ { art: "methode", text: "Der Schritt heisst teleologische Reduktion: Der Fall ist vom Wortlaut erfasst (E. 5.2), wird aber wegen des Normzwecks ausgenommen. Redaktioneller Hinweis." } ] },
      { nr: "6", tiefe: 1, anfang: "Für eine Nichtanwendung von Art. 333 Abs. 3 OR im Konkursfall spricht auch eine europarechtskonforme Auslegung der Bestimmung. Das Recht der Europäischen Union entfaltet zwar keine unmittelbaren verbindlichen Auswirkungen auf das schweizerische Recht…" },
      { nr: "7", tiefe: 1, thema: "Reformbestrebungen des Gesetzgebers",
        text: "Einer entsprechenden Auslegung ist auch deshalb der Vorzug zu geben, weil Bestrebungen zu einer Reform von Art. 333 Abs. 3 OR im Gange sind, die nach ihrem gegenwärtigen Stand in dieselbe Richtung weisen: Die Rechtskommission des Nationalrats hat am 15. November 1999 einen Gesetzesentwurf gutgeheissen, wonach die solidarische Haftung nach Art. 333 Abs. 3 OR nicht greifen soll, wenn der Betrieb aus einem Konkurs übernommen wird (vgl. LORANDI, a.a.O., S. 115; AUBERT, 2000, a.a.O., S. 14 f. Fn. 23; HOFSTETTER, 2003, a.a.O., S. 157; KARAGJOZI, a.a.O., S. 61 und 75). Auch wenn dem Vorschlag teilweise Kritik erwachsen ist (LORANDI, a.a.O., S. 115 f. sowie S. 111 und ihm scheinbar folgend HOFSTETTER, 2003, a.a.O., S. 158 sowie MEIER, a.a.O., S. 35), zeigt er doch, dass die massgebende vorberatende Kommission des Nationalrats die hier vertretene Auffassung teilt. Zur hauptsächlichen Kritik von LORANDI und MEIER, der Gesetzesentwurf schiesse über das Ziel hinaus, weil er die Solidarhaftung auch in Fällen ausschliesse, in denen sie die Betriebsübernahme nicht zum Scheitern bringen würde, kann auf das in vorstehender Erwägung 5.5.5 Gesagte verwiesen werden." },
      { nr: "8", tiefe: 1, thema: "Ergebnis",
        text: "Zusammenfassend hat die Vorinstanz kein Bundesrecht verletzt, indem sie die solidarische Haftung der Beklagten für die vor der Konkurseröffnung über den Inhaber der Einzelfirma E.X. Metallbau fällig gewordenen Lohnforderungen aus den nach der Betriebsübernahme weitergeführten Arbeitsverhältnissen verneinte. Die Berufung ist daher abzuweisen. (...)" }
    ],
    gang: [ ["4", "Methode"], ["5.1", "Entstehung und Zweck von Abs. 1"], ["5.2", "Wortlaut von Abs. 3"], ["5.3", "Zweck: Vorinstanz und Lehre"], ["5.6", "Systematik: Konkursrecht"], ["5.8", "Ergebnis"], ["6", "Europarechtskonforme Auslegung"], ["7", "Reformbestrebungen"] ],
    dispositiv: "In der amtlichen Sammlung nicht abgedruckt. Aus E. 8: Die Berufung wird abgewiesen. Vollständiges Urteil: 4C.316/2002 vom 25. März 2003.",
    zitiert: [
      { ref: "BGE 127 V 183", n: 8, jahr: 2001, id: "BGE-127-V-183" }, { ref: "BGE 121 III 219", n: 2, jahr: 1995 },
      { ref: "BGE 123 III 466", n: 2, jahr: 1997, id: "BGE-123-III-466" }, { ref: "BGE 128 I 34", n: 1, jahr: 2001 },
      { ref: "BGE 128 III 113", n: 1, jahr: 2001 }, { ref: "BGE 112 II 51", n: 1, jahr: 1986 },
      { ref: "BGE 124 IV 106", n: 1, jahr: 1998 }, { ref: "BGE 125 II 192", n: 1, jahr: 1999 }, { ref: "BGE 125 II 293", n: 1, jahr: 1999 },
      { ref: "4C.37/1999", n: 2, offen: true }, { ref: "4C.54/1996", n: 1, offen: true }, { ref: "4P.66/1996", n: 1, offen: true }
    ],
    zitiertVonListe: [
      { ref: "2C_380/2025", gericht: "BGer", datum: "29.7.2026", ebene: "BGer" }, { ref: "2C_353/2025", gericht: "BGer", datum: "14.4.2026", ebene: "BGer" },
      { ref: "2C_492/2025", gericht: "BGer", datum: "14.4.2026", ebene: "BGer" }, { ref: "2C_47/2025", gericht: "BGer", datum: "27.3.2026", ebene: "BGer" },
      { ref: "2C_403/2024", gericht: "BGer", datum: "12.3.2026", ebene: "BGer" }, { ref: "BGE 152 II 124", gericht: "BGE", datum: "2.5.2025", ebene: "BGE" },
      { ref: "2C_26/2023", gericht: "BGer", datum: "2.5.2025", ebene: "BGer" }, { ref: "4A_506/2023", gericht: "BGer", datum: "19.2.2025", ebene: "BGer" },
      { ref: "VB.2023.00618", gericht: "Verwaltungsgericht ZH", datum: "7.11.2024", ebene: "Kanton", kt: "ZH" }, { ref: "A-4873/2021", gericht: "BVGer", datum: "11.4.2024", ebene: "BVGer" },
      { ref: "CAPH/54/2023", gericht: "Gerichte GE", datum: "26.5.2023", ebene: "Kanton", kt: "GE" }, { ref: "C/14115/2019", gericht: "Gerichte GE", datum: "23.5.2023", ebene: "Kanton", kt: "GE" },
      { ref: "ATAS/924/2021", gericht: "Gerichte GE", datum: "13.9.2021", ebene: "Kanton", kt: "GE" },
      { ref: "12.2021.39", gericht: "Gerichte TI", datum: "15.9.2021", ebene: "Kanton", kt: "TI", unsicher: "Zitat lautet «BGE 129 III 351»; Zuordnung unsicher (Konfidenz 0.65)" }
    ],
    netzHinweis: "14 von 178 zitierenden Entscheiden geladen (die jüngsten). Die II. öffentlich-rechtliche Abteilung (2C) zitiert den Entscheid 2025/26 gehäuft; zu welcher Erwägung, ist im Prototyp nicht ausgewertet."
  },
  "BGE-137-III-487": {
    id: "BGE-137-III-487", zitat: { de: "BGE 137 III 487", fr: "ATF 137 III 487", it: "DTF 137 III 487" },
    gericht: "Bundesgericht", abteilung: "II. zivilrechtliche Abteilung", datum: "15.8.2011", jahr: 2011, sprache: "de",
    docket: "5A_113/2011", art: "Leitentscheid (BGE)", zitiertVon: 30, startseite: 487,
    parteien: "X. gegen Swissair Schweizerische Luftverkehr-Aktiengesellschaft in Nachlassliquidation (Beschwerde in Zivilsachen)",
    url: "https://mcp.opencaselaw.ch/entscheid/bge_137%20III%20487",
    rechtslage: { text: "Rechtslage seither geändert: Für Übertragungen während der Nachlassstundung gilt seit 1.1.2014 Art. 333b OR (Übergang nur bei Vereinbarung mit dem Erwerber).", ziel: { typ: "norm", id: "OR-333b" } },
    regeste: {
      de: "Art. 293 ff. SchKG, Art. 333 OR; Betriebsübernahme während der Nachlassstundung. Überträgt ein Arbeitgeber während der Nachlassstundung den Betrieb, so geht das Arbeitsverhältnis auf den Erwerber über (Art. 333 Abs. 1 OR) und haftet der bisherige Arbeitgeber nach Art. 333 Abs. 3 OR für die Forderungen des Arbeitnehmers (E. 2-5). Prüfung, wann das Arbeitsverhältnis ordentlicherweise beendigt werden könnte und damit des Zeitraumes, für welchen der bisherige Arbeitgeber nach der Betriebsübernahme haftet (E. 6). Prüfung, ob der bisherige Arbeitgeber trotz Übergang des Arbeitsverhältnisses und Neuanstellung durch den Betriebserwerber eine Abfindungszahlung schuldet (E. 7).",
      fr: "Art. 293 ss LP, art. 333 CO; transfert d'entreprise durant le sursis concordataire. Si un employeur transfère l'entreprise durant le sursis concordataire, le rapport de travail passe à l'acquéreur (art. 333 al. 1 CO) et l'ancien employeur répond selon l'art. 333 al. 3 CO des créances du travailleur (consid. 2-5). Examen du délai dans lequel le rapport de travail pourrait être résilié de façon ordinaire et, ainsi, de la période durant laquelle l'ancien employeur répond après le transfert d'entreprise (consid. 6). Examen de l'obligation de l'ancien employeur de verser une indemnité, malgré le transfert du rapport de travail et le nouvel engagement par l'acquéreur de l'entreprise (consid. 7).",
      it: "Art. 293 segg. LEF, art. 333 CO; trasferimento d'azienda durante la moratoria concordataria. Se un datore di lavoro trasferisce l'azienda durante la moratoria concordataria, il rapporto di lavoro passa all'acquirente (art. 333 cpv. 1 CO) ed il precedente datore di lavoro risponde dei crediti del lavoratore giusta l'art. 333 cpv. 3 CO (consid. 2-5). Esame del termine entro il quale il rapporto di lavoro potrebbe essere sciolto normalmente e, con ciò, del periodo per il quale il precedente datore di lavoro risponde dei crediti del lavoratore dopo il trasferimento d'azienda (consid. 6). Esame dell'obbligo del precedente datore di lavoro di versare un'indennità malgrado il trasferimento del rapporto di lavoro e la nuova assunzione da parte dall'acquirente dell'azienda (consid. 7)."
    },
    sachverhalt: [],
    erw: [
      { nr: "4.3", tiefe: 2, seite: "492 f.", thema: "Aufnahme von BGE 129 III 335 in Lehre und kantonaler Praxis", kern: true,
        text: "Das Ergebnis von BGE 129 III 335 ff. - die Ablehnung der Haftung des Erwerbers bei Betriebsübernahmen im Konkurs - ist grundsätzlich auf Zustimmung gestossen (vgl. zuletzt BAISCH, Arbeitnehmerschutz bei M&A Transaktionen und Sanierungen, in: jusletter 20. Juni 2011, S. 23, Rz. 82, mit weiteren Hinweisen). Die seither geäusserten Auffassungen zur Frage der grundsätzlichen Anwendbarkeit von Art. 333 OR in Konkurs- und Nachlassverfahren sind weiterhin uneinheitlich (u.a. eine grundsätzliche bzw. durch das Bundesgerichtsurteil modifizierte Anwendbarkeit bejahend PORTMANN, in: Basler Kommentar, Obligationenrecht, Bd. I, 4. Aufl. 2007, N. 12 zu Art. 333 OR; KRADOLFER, Der Betriebsübergang - Auswirkungen auf das Individualarbeitsverhältnis, 2008, S. 322, 327; STREIFF/VON KAENEL, Arbeitsvertrag, Praxiskommentar [...], 6. Aufl. 2006, N. 7 zu Art. 333 OR, S. 551; JEANDIN, L'insolvabilité en relation avec les contrats de bail et de travail, ZSR 2005 I S. 217; ablehnend TERCIER/FAVRE, Contrats spéciaux, 4. Aufl. 2009, Rz. 3896, betreffend Konkurs; differenzierend SUBILIA/DUC, Droit du travail, 2010, S. 478 Rz. 28: keine Anwendung im Konkurs und bei Nachlassvertrag mit Vermögensabtretung, jedoch während der Nachlassstundung). Aus der kantonalen Praxis ist das Urteil der Vorinstanz vom 10. September 2003 bekannt, welches unter Bezugnahme auf BGE 129 III 335 ff. zum Schluss gelangt ist, dass Art. 333 OR - mit Ausnahme der Haftung des Erwerbers - im Falle der Betriebsübernahme im Konkurs anwendbar ist (ZR 2004 Nr. 71 S. 276, 278). Im ⟦S. 493⟧ angefochtenen Entscheid hat die Vorinstanz diese Praxis bestätigt und auf das Nachlassverfahren übertragen." }
    ],
    nurAuszug: "Im Prototyp ist nur E. 4.3 im Wortlaut geladen (Geschwister: E. 4.1 bis 4.8).",
    dispositiv: null, zitiert: [ { ref: "BGE 129 III 335", n: 2, jahr: 2003, id: "BGE-129-III-335" } ], zitiertVonListe: []
  },
  "BGE-123-III-466": {
    id: "BGE-123-III-466", zitat: { de: "BGE 123 III 466", fr: "ATF 123 III 466", it: "DTF 123 III 466" },
    gericht: "Bundesgericht", datum: "20.8.1997", jahr: 1997, sprache: "fr", art: "Leitentscheid (BGE)", zitiertVon: 135, startseite: 466,
    url: "https://mcp.opencaselaw.ch/entscheid/bge_BGE_123_III_466",
    regeste: {
      de: "Übergang des Arbeitsverhältnisses (Art. 333 OR). Definition dieses Begriffes (E. 3a). Folgen einer Übertragung des Betriebs für die zu diesem Zeitpunkt bestehenden Arbeitsverhältnisse (E. 3b).",
      fr: "Transfert des rapports de travail (art. 333 CO). Définition de cette notion (consid. 3a). Conséquences d'un transfert d'entreprise pour les rapports de travail noués lors du transfert (consid. 3b)."
    },
    sachverhalt: [], erw: [], nurAuszug: "Originalsprache Französisch. Im Prototyp ist nur die amtliche Regeste geladen (IT nicht geladen).", zitiert: [], zitiertVonListe: []
  },
  "BGE-127-V-183": {
    id: "BGE-127-V-183", zitat: { de: "BGE 127 V 183", fr: "ATF 127 V 183", it: "DTF 127 V 183" },
    gericht: "Eidgenössisches Versicherungsgericht", datum: "20.4.2001", jahr: 2001, sprache: "de", art: "Leitentscheid (BGE)", zitiertVon: 162, startseite: 183,
    url: "https://mcp.opencaselaw.ch/entscheid/bge_127%20V%20183",
    regeste: { de: "Art. 51 AVIG; Art. 333 OR: Insolvenzentschädigung. Arbeitnehmer können unabhängig davon, ob ein Anwendungsfall von Art. 333 OR (Übergang des Arbeitsverhältnisses bei Übertragung des Betriebes oder eines Betriebsteiles auf einen Dritten) vorliegt, Insolvenzentschädigung beanspruchen, sofern die Voraussetzungen gemäss Art. 51 AVIG in Bezug auf den bisherigen Arbeitgeber oder die bisherige Arbeitgeberin erfüllt sind." },
    sachverhalt: [], erw: [], nurAuszug: "Im Prototyp ist nur die deutsche Regeste geladen.", zitiert: [], zitiertVonListe: []
  }
};

/* Echte Treffer der Suche «"Art. 333 OR" Betriebsübergang Arbeitsverhältnis» (Opencaselaw, 12.11.2026, 14 von mind. 87). */
LA.treffer = [
  { id: "BGE-129-III-335", ref: "BGE 129 III 335", instanz: "BGE", kt: "CH", gebiet: "Zivilrecht", jahr: 2003, datum: "25.3.2003", spr: "de", leit: true, cit: 157, citNorm: 36,
    text: "Anwendbarkeit von Art. 333 Abs. 3 OR bei Erwerb eines Betriebes aus dem Konkurs des früheren Inhabers. Wer einen Betrieb erwirbt und mit den Arbeitnehmern die im Zeitpunkt der Übernahme bestehenden Arbeitsverhältnisse weiterführt, haftet nicht für offene, vor der Übernahme fällig gewordene Lohnforderungen …", pin: "5.2", quelle: "Leitentscheidliste zu Art. 333 OR" },
  { id: "BGE-123-III-466", ref: "BGE 123 III 466", instanz: "BGE", kt: "CH", gebiet: "Zivilrecht", jahr: 1997, datum: "20.8.1997", spr: "fr", leit: true, cit: 135, citNorm: 39,
    text: "Übergang des Arbeitsverhältnisses (Art. 333 OR). Definition dieses Begriffes (E. 3a). Folgen einer Übertragung des Betriebs für die zu diesem Zeitpunkt bestehenden Arbeitsverhältnisse (E. 3b).", quelle: "Leitentscheidliste zu Art. 333 OR" },
  { id: "BGE-127-V-183", ref: "BGE 127 V 183", instanz: "BGE", kt: "CH", gebiet: "Sozialversicherungsrecht", jahr: 2001, datum: "20.4.2001", spr: "de", leit: true, cit: 162, citNorm: 36,
    text: "Art. 51 AVIG; Art. 333 OR: Insolvenzentschädigung. Arbeitnehmer können unabhängig davon, ob ein Anwendungsfall von Art. 333 OR […] vorliegt, Insolvenzentschädigung beanspruchen, sofern die Voraussetzungen gemäss Art. 51 AVIG in Bezug auf den bisherigen Arbeitgeber oder die bisherige Arbeitgeberin erfüllt sind.",
    gruppe: { n: 6, text: "6 Einträge desselben Tages zusammengeführt: C 283/00, C 322/99 und C 321/99 erscheinen in der Quelle je doppelt (zwei Schreibweisen der Geschäftsnummer). Maschinell gruppiert nach Datum und gleichlautendem Textanfang." } },
  { id: "BGE-137-III-487", ref: "BGE 137 III 487", instanz: "BGE", kt: "CH", gebiet: "Zivilrecht", jahr: 2011, datum: "15.8.2011", spr: "de", leit: true, cit: 30,
    text: "Art. 293 ff. SchKG, Art. 333 OR; Betriebsübernahme während der Nachlassstundung. Überträgt ein Arbeitgeber während der Nachlassstundung den Betrieb, so geht das Arbeitsverhältnis auf den Erwerber über (Art. 333 Abs. 1 OR) und haftet der bisherige Arbeitgeber nach Art. 333 Abs. 3 OR für die Forderungen des Arbeitnehmers (E. 2-5).", pin: "4.3",
    gruppe: { n: 2, text: "Mit dem Urteil 5A_113/2011 vom 15. August 2011 zusammengeführt (gleicher Entscheid, publizierte und unpublizierte Fassung)." } },
  { ref: "BGer 4A_399/2013 vom 17. Februar 2014", instanz: "BGer", kt: "CH", gebiet: "Zivilrecht", jahr: 2014, datum: "17.2.2014", spr: "de", leit: false, cit: 2,
    text: "Übergang des Arbeitsverhältnisses; missbräuchliche Kündigung | Vertragsrecht", meta: "I. zivilrechtliche Abteilung; Beschwerde gegen das Urteil des Obergerichts des Kantons Zürich" },
  { ref: "AGer-Z 2012 Nr. 12 vom 11. Oktober 2012", instanz: "Kantonal", kt: "ZH", gericht: "Arbeitsgericht Zürich", gebiet: "Zivilrecht", jahr: 2012, datum: "11.10.2012", spr: "de", leit: false,
    titel: "OR 333; Konkurs und Betriebsübergang",
    text: "Z. war seit 1. November 2007 für die A. AG tätig. Am 18. Dezember 2008 wurde ihm auf Ende März 2009 gekündigt. Im Juli 2009 machte Z. beim Arbeitsgericht Zürich verschiedene arbeitsrechtliche Ansprüche gegenüber der A. AG geltend. Im September 2009 wurde über die A. AG der Konkurs eröffnet. …" },
  { ref: "TVR 2011 Nr. 33 vom 31. August 2011", instanz: "Kantonal", kt: "TG", gericht: "Obergericht Thurgau", gebiet: "Sozialversicherungsrecht", jahr: 2011, datum: "31.8.2011", spr: "de", leit: false,
    titel: "Insolvenzentschädigung nach Betriebsübergang gemäss Art. 333 OR",
    text: "Art. 51 Abs. 1 lit. a AVIG. Forderungen für Arbeitsleistungen, die nach Betriebsübergang bei der neuen Arbeitgeberin entstanden sind, können nicht mittels Insolvenzentschädigung geltend gemacht werden." },
  { ref: "OGVE 2014/15 Nr. 3 vom 3. Dezember 2014", instanz: "Kantonal", kt: "OW", gericht: "Obergericht Obwalden", gebiet: "Zivilrecht", jahr: 2014, datum: "3.12.2014", spr: "de", leit: false,
    text: "Art. 333 Abs. 1 und Art. 336c Abs. 1 lit. b OR. Die Dauer des Kündigungsschutzes infolge Krankheit hängt davon ab, ob das Arbeitsverhältnis bei Übernahme eines Betriebs auf den Erwerber übergegangen ist. Wurde das Arbeitsverhältnis vor der Betriebsübernahme gültig gekündigt, so führt die spätere Betriebsübernahme nicht zum Wiederaufleben des Arbeitsverhältnisses, es sei denn, die Kündigung sei lediglich zur Umgehung von Art. 333 OR ausgesprochen worden." },
  { ref: "AGer-Z 2010 Nr. 11 vom 12. Mai 2010", instanz: "Kantonal", kt: "ZH", gericht: "Arbeitsgericht Zürich", gebiet: "Zivilrecht", jahr: 2010, datum: "12.5.2010", spr: "de", leit: false,
    titel: "OR 333; Ablehnung des Übergangs des Arbeitsverhältnisses bei Betriebsübernahme",
    text: "… einer Betriebsübernahme i.S.v. Art. 333 OR auszugehen ist und welche Rechtsfolgen eine solche hätte. Soweit Art. 181 Abs. 4 OR die Bestimmungen des FusG (Fusionsgesetz, SR 221.301) für anwendbar erklärt, ist anzumerken, dass eine Vermögensübertragung und mithin ein Betriebsübergang grundsätzlich danach abgewickelt werden kann. …" }
];
LA.trefferMeta = { anfrage: "\"Art. 333 OR\" Betriebsübergang Arbeitsverhältnis", total: "mindestens 87", geladen: 14, hinweis: "Sprachfacette: Im geladenen Ausschnitt ist nur ein Entscheid französisch (BGE 123 III 466). Die Suche lief ohne Sprachfilter." };

/* Rechtsfragenseite. Gewichtung = redaktionelle Einordnung des Prototyps, begründet aus den belegten Stellen. */
LA.frage = {
  id: "erwerberhaftung-konkurs",
  titel: "Haftet die Erwerberin eines Betriebs aus der Konkursmasse für Löhne, die vor der Übernahme fällig wurden?",
  kurz: "Nein. Für Sachverhalte seit 1.1.2014 folgt das aus Art. 333b OR; davor aus BGE 129 III 335.",
  aussagen: [
    { gewicht: "gesetz", titel: "Grundsatz: Das Arbeitsverhältnis geht bei Betriebsübertragung von Gesetzes wegen über.",
      belege: [ { typ: "norm", id: "OR-333", abs: "1", label: "Art. 333 Abs. 1 OR" }, { typ: "entscheid", id: "BGE-129-III-335", e: "5.1", label: "BGE 129 III 335 E. 5.1" }, { typ: "entscheid", id: "BGE-123-III-466", label: "BGE 123 III 466 (Regeste, E. 3b)" } ],
      grund: "Gesetzeswortlaut seit 1.5.1994; in zwei Leitentscheiden wiedergegeben." },
    { gewicht: "gesetz", titel: "Nach dem Wortlaut von Abs. 3 haften bisheriger Arbeitgeber und Erwerber solidarisch; die Haftung ist relativ zwingend.",
      belege: [ { typ: "norm", id: "OR-333", abs: "3", label: "Art. 333 Abs. 3 OR" }, { typ: "entscheid", id: "BGE-129-III-335", e: "5.2", label: "BGE 129 III 335 E. 5.2 S. 341 f." } ],
      grund: "Gesetzeswortlaut; die zwingende Natur stützt das Bundesgericht auf Art. 362 OR." },
    { gewicht: "kodifiziert", titel: "Ausnahme Konkurs: keine Solidarhaft des Erwerbers bei Übernahme aus der Konkursmasse.",
      belege: [ { typ: "entscheid", id: "BGE-129-III-335", e: "5.8", label: "BGE 129 III 335 E. 5.8" }, { typ: "norm", id: "OR-333b", abs: "", label: "Art. 333b OR" }, { typ: "material", id: "BBl-2010-6455", label: "BBl 2010 6455, S. 6495 f." } ],
      grund: "Leitentscheid von 2003 (178 zitierende Entscheide), 2011 vom Bundesgericht als «grundsätzlich auf Zustimmung gestossen» bezeichnet und per 1.1.2014 vom Gesetzgeber übernommen («ausgenommen dessen Absatz 3»)." },
    { gewicht: "ueberlagert", titel: "Nachlassstundung: Übergang des Arbeitsverhältnisses nach Art. 333 Abs. 1 OR und Haftung des bisherigen Arbeitgebers nach Abs. 3.",
      belege: [ { typ: "entscheid", id: "BGE-137-III-487", label: "BGE 137 III 487 (Regeste, E. 2-5)" }, { typ: "norm", id: "OR-333b", abs: "", label: "Art. 333b OR" } ],
      grund: "Der Entscheid betrifft einen Sachverhalt von 2002. Seit 1.1.2014 verlangt Art. 333b OR für den Übergang während der Nachlassstundung eine Vereinbarung mit dem Erwerber. Für ältere Sachverhalte bleibt der Entscheid massgebend." },
    { gewicht: "umstritten", titel: "Ob Art. 333 OR in Konkurs und Nachlassverfahren im Übrigen anwendbar ist, war in der Lehre umstritten (Stand 2011).",
      belege: [ { typ: "entscheid", id: "BGE-129-III-335", e: "2.2", label: "BGE 129 III 335 E. 2.2 (Meinungsstand 2003)" }, { typ: "entscheid", id: "BGE-137-III-487", e: "4.3", label: "BGE 137 III 487 E. 4.3 (Meinungsstand 2011)" } ],
      grund: "Das Bundesgericht selbst nennt die Auffassungen «weiterhin uneinheitlich» und führt bejahende, ablehnende und differenzierende Stimmen an. Lehre nach 2014 ist im freien Bestand nicht geladen." },
    { gewicht: "vereinzelt", titel: "Kantonale Praxis zu Konkurs und Betriebsübergang.",
      belege: [ { typ: "treffer", label: "AGer-Z 2012 Nr. 12 vom 11. Oktober 2012 (Arbeitsgericht Zürich)" } ],
      grund: "Einzelner erstinstanzlicher Entscheid; Inhalt im Prototyp nicht ausgewertet. Erstinstanzliche Entscheide werden nur in einem Teil der Kantone publiziert." },
    { gewicht: "keinbeleg", titel: "Haftung der Erwerberin für Forderungen, die nach der Übernahme aus der Konkursmasse fällig werden.",
      belege: [], grund: "Im geladenen Bestand kein Beleg gefunden. Die Plattform trifft dazu keine Aussage." }
  ],
  linie: [
    { jahr: "1971", typ: "gesetz", titel: "Art. 333 OR, Fassung vom 25. Juni 1971", text: "Übergang des Arbeitsverhältnisses, den der Erwerber ablehnen kann.", beleg: { typ: "entscheid", id: "BGE-129-III-335", e: "5.1" } },
    { jahr: "1994", typ: "gesetz", titel: "Revision vom 17. Dezember 1993 («Swisslex»)", text: "Übergang von Gesetzes wegen; Abs. 3 bleibt unverändert.", beleg: { typ: "norm", id: "OR-333", abs: "1" } },
    { jahr: "1997", typ: "entscheid", rel: "definiert", titel: "BGE 123 III 466", text: "Begriff und Folgen des Übergangs.", beleg: { typ: "entscheid", id: "BGE-123-III-466" } },
    { jahr: "2001", typ: "entscheid", rel: "Hintergrund", titel: "BGE 127 V 183", text: "Insolvenzentschädigung unabhängig von Art. 333 OR.", beleg: { typ: "entscheid", id: "BGE-127-V-183" } },
    { jahr: "2003", typ: "entscheid", rel: "begründet die Praxis", kern: true, titel: "BGE 129 III 335", text: "Keine Solidarhaft des Erwerbers bei Übernahme aus der Konkursmasse, contra verba legis.", beleg: { typ: "entscheid", id: "BGE-129-III-335", e: "5.8" } },
    { jahr: "2011", typ: "entscheid", rel: "bestätigt das Ergebnis, überträgt nicht auf die Nachlassstundung", titel: "BGE 137 III 487", text: "Während der Nachlassstundung gilt Art. 333 OR; Zustimmung der Lehre zum Ergebnis von 2003 festgestellt.", beleg: { typ: "entscheid", id: "BGE-137-III-487", e: "4.3" } },
    { jahr: "2014", typ: "gesetz", rel: "kodifiziert und geht weiter", kern: true, titel: "Art. 333b OR", text: "Übergang in Nachlassstundung, Konkurs und Nachlassvertrag mit Vermögensabtretung nur bei Vereinbarung; Art. 333 Abs. 3 ausgenommen.", beleg: { typ: "norm", id: "OR-333b", abs: "" } }
  ]
};

/* Belegte Recherche: Beispielausgabe, am 12.11.2026 mit attest_response (Opencaselaw) geprüft:
   3 von 3 Entscheidzitaten aufgelöst, 3 Pinpoints bestätigt, 2 Normverweise bestätigt, 3 Aussagen auf Deckung geprüft. */
LA.recherche = {
  frage: "Haftet die Erwerberin eines Betriebs aus der Konkursmasse für vor der Übernahme fällige Löhne?",
  pruefung: "Geprüft am 12.11.2026 mit attest_response (Opencaselaw): 3 von 3 Entscheidzitaten aufgelöst, 3 Pinpoints bestätigt, 2 Normverweise bestätigt, 3 Aussagen gegen die zitierte Stelle geprüft. Nicht geprüft: ob einschlägige Quellen fehlen.",
  saetze: [
    { text: "Überträgt der Arbeitgeber den Betrieb auf einen Dritten, geht das Arbeitsverhältnis mit allen Rechten und Pflichten auf den Erwerber über, sofern der Arbeitnehmer den Übergang nicht ablehnt.",
      belege: [ { typ: "norm", id: "OR-333", abs: "1", label: "Art. 333 Abs. 1 OR" } ], gewicht: "gesetz" },
    { text: "Nach dem Wortlaut von Abs. 3 haften der bisherige Arbeitgeber und der Erwerber solidarisch für die Forderungen, die vor dem Übergang fällig geworden sind; diese Haftung ist relativ zwingend.",
      belege: [ { typ: "norm", id: "OR-333", abs: "3", label: "Art. 333 Abs. 3 OR" }, { typ: "entscheid", id: "BGE-129-III-335", e: "5.2", label: "BGE 129 III 335 E. 5.2" } ], gewicht: "gesetz" },
    { text: "Für den Erwerb eines Betriebes aus der Konkursmasse hat das Bundesgericht die Solidarhaft des Erwerbers in Auslegung contra verba legis ausgeschlossen.",
      belege: [ { typ: "entscheid", id: "BGE-129-III-335", e: "5.8", label: "BGE 129 III 335 E. 5.8" } ], gewicht: "kodifiziert" },
    { text: "Seit dem 1. Januar 2014 regelt Art. 333b OR die Übertragung im Konkurs ausdrücklich: Das Arbeitsverhältnis geht nur über, wenn dies mit dem Erwerber so vereinbart wurde und der Arbeitnehmer den Übergang nicht ablehnt; Art. 333 gilt sinngemäss, ausgenommen dessen Absatz 3.",
      belege: [ { typ: "norm", id: "OR-333b", abs: "", label: "Art. 333b OR" } ], gewicht: "gesetz" },
    { text: "Das Ergebnis des Leitentscheids ist nach späterer Feststellung des Bundesgerichts grundsätzlich auf Zustimmung gestossen.",
      belege: [ { typ: "entscheid", id: "BGE-137-III-487", e: "4.3", label: "BGE 137 III 487 E. 4.3" } ], gewicht: "kodifiziert" },
    { text: "Zur Frage, ob die Erwerberin für Forderungen haftet, die erst nach der Übernahme fällig werden, wurde im durchsuchten Bestand keine Stelle gefunden. Dazu wird nichts behauptet.",
      belege: [], gewicht: "keinbeleg" }
  ]
};

LA.gewichte = {
  gesetz:      { label: "Gesetz", form: "voll", text: "Folgt unmittelbar aus dem Gesetzeswortlaut." },
  gefestigt:   { label: "Gefestigte Praxis", form: "voll", text: "Leitentscheid, mehrfach bestätigt, keine abweichende Praxis im Bestand." },
  kodifiziert: { label: "Praxis, vom Gesetzgeber übernommen", form: "kodif", text: "Leitentscheid, dessen Ergebnis später ins Gesetz geschrieben wurde." },
  ueberlagert: { label: "Durch Gesetzesänderung überlagert", form: "halb", text: "Gilt für ältere Sachverhalte; für neuere geht das geänderte Gesetz vor." },
  umstritten:  { label: "Umstritten", form: "schraffur", text: "Das Gericht selbst oder die Lehre weist abweichende Auffassungen aus." },
  vereinzelt:  { label: "Vereinzelt", form: "leer", text: "Einzelner Entscheid einer unteren Instanz oder einer Abteilung." },
  obiter:      { label: "Obiter dictum", form: "punkt", text: "Für den Entscheid nicht tragend." },
  keinbeleg:   { label: "Kein Beleg", form: "strich", text: "Im durchsuchten Bestand nichts gefunden; keine Aussage." }
};

LA.beispielMappe = { id: "m1", name: "Metallbau, Kollokationsklage (Beispielmappe)", beispiel: true, eintraege: [
  { typ: "entscheid", id: "BGE-129-III-335", e: "5.8", notiz: "Kernstelle. Sachverhalt 2000, also vor Art. 333b." },
  { typ: "norm", id: "OR-333b", abs: "", notiz: "Gilt erst seit 1.1.2014. Übergangsrecht prüfen." },
  { typ: "entscheid", id: "BGE-137-III-487", e: "4.3", notiz: "" }
] };
