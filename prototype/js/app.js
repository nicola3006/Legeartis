/* Legeartis-Prototyp: Logik. Keine Abhängigkeiten. Aufbau:
   1 Hilfen (Typografie, Verweise)  2 Zitat-Auflösung  3 Zitierformate  4 Zustand, Navigation
   5 Ansichten  6 Mappen  7 Palette, Tastatur  8 Ereignisse */
(function () {
  "use strict";
  const LA = window.LA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const NB = " ";

  /* ---------- 1 Hilfen ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  /* Geschützte Leerzeichen in Fundstellen. Verändert keinen Buchstaben des Primärtexts. */
  function nb(s) {
    return s
      .replace(/\b(BGE|ATF|DTF) (\d+) ([IVX]+[a-z]?) (\d+)/g, "$1" + NB + "$2" + NB + "$3" + NB + "$4")
      .replace(/\b(Art|art|Abs|lit|Ziff|E|S|N|Rz|Nr|Bd|consid|al|cpv|Fn)\. (?=[\dIVXa-z])/g, "$1." + NB)
      .replace(/\b(BBl|AS|FF|RO|RU|SR) (?=\d)/g, "$1" + NB)
      .replace(/(\d[a-z]{0,4}) (OR|ZGB|SchKG|AVIG|CO|LP|LEF|BV|StGB|ZPO|FusG)\b/g, "$1" + NB + "$2")
      .replace(/(\d)\. (Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember|Jan\.|Dez\.)/g, "$1." + NB + "$2");
  }
  const t = (s) => nb(esc(s));
  const REF = new RegExp(
    "(BGE|ATF|DTF)" + NB + "(\\d+)" + NB + "([IVX]+)" + NB + "(\\d+)(?:,?[ " + NB + "]E\\." + NB + "(\\d+[\\d.]*[a-z]?(?:\\/[a-z]+)?))?" +
    "|Art\\." + NB + "(\\d+[a-z]?)(?:[ " + NB + "]Abs\\." + NB + "(\\d+(?:bis)?))?" + NB + "(OR|SchKG|AVIG)\\b", "g");
  /* Primärtext: Typografie, Seitenwechsel, anklickbare Verweise. */
  function primaer(s, selbst) {
    return t(s)
      .replace(REF, (m, bge, bd, abt, seite, e, art, abs, erl) => {
        if (bge) {
          const id = "BGE-" + bd + "-" + abt + "-" + seite;
          if (id === selbst && !e) return m;
          const da = LA.entscheide[id];
          return '<a class="ref' + (da ? "" : " fern") + '" href="#" data-ziel="entscheid" data-id="' + id + '"' + (e ? ' data-e="' + e + '"' : "") + ' data-roh="' + m + '">' + m + "</a>";
        }
        const id = erl + "-" + art, da = LA.normen[id];
        return '<a class="ref' + (da ? "" : " fern") + '" href="#" data-ziel="norm" data-id="' + id + '"' + (abs ? ' data-abs="' + abs + '"' : "") + ' data-roh="' + m + '">' + m + "</a>";
      })
      .replace(/⟦S\. ?(\d+)⟧/g, '<span class="seite" title="Seitenwechsel der amtlichen Sammlung">S.' + NB + "$1</span>")
      .replace(/\n/g, '</p><p class="satz">');
  }
  const gw = (k) => { const g = LA.gewichte[k]; return '<span class="gw ' + g.form + '" title="' + esc(g.text) + '"><i aria-hidden="true"></i>' + esc(g.label) + "</span>"; };

  /* ---------- 2 Zitat-Auflösung ---------- */
  function deute(roh) {
    const s = roh.trim().replace(/\s+/g, " ");
    if (!s) return { art: "leer" };
    let m = s.match(/^(?:BGE|ATF|DTF)\s*(\d{1,3})\s+([IVX]+[a-z]?)\s+(\d{1,4})(?:[\s,]*(?:E\.|Erw\.|consid\.)\s*(\d+[\d.]*[a-z]?(?:\/[a-z]+)?))?\s*(?:S\.\s*\d+.*)?$/i);
    if (m) {
      const id = "BGE-" + m[1] + "-" + m[2].toUpperCase() + "-" + m[3], ent = LA.entscheide[id];
      const e = m[4] ? m[4].replace(/\.$/, "") : null;
      const erw = ent && e ? ent.erw.find((x) => x.nr === e) : null;
      return { art: "zitat", typ: "entscheid", id, e, da: !!ent, stelle: !!(erw && erw.text), nurAnfang: !!(erw && !erw.text), label: "BGE " + m[1] + " " + m[2].toUpperCase() + " " + m[3] + (e ? " E. " + e : "") };
    }
    m = s.match(/^Art\.?\s*(\d+[a-z]?)\s*(?:Abs\.?\s*(\d+(?:bis|ter)?))?\s*(?:lit\.?\s*([a-z]))?\s*([A-Za-zÄÖÜäöü]{2,8})$/);
    if (m) {
      const erl = m[4] === "CO" ? "OR" : m[4], id = erl + "-" + m[1], n = LA.normen[id];
      return { art: "zitat", typ: "norm", id, abs: m[2] || null, da: !!n, stelle: !!(n && (!m[2] || n.abs.some((a) => a.nr === m[2]))), label: "Art. " + m[1] + (m[2] ? " Abs. " + m[2] : "") + " " + erl };
    }
    m = s.match(/^(\d[A-Z])[_. ](\d{1,5})\/(\d{4})$/);
    if (m) {
      const nummer = m[1] + m[2] + "/" + m[3];
      const ent = Object.values(LA.entscheide).find((x) => x.docket && x.docket.replace(/[_.]/g, "") === nummer);
      return { art: "zitat", typ: "entscheid", id: ent ? ent.id : null, da: !!ent, stelle: !!ent, label: m[1] + "_" + m[2] + "/" + m[3], publiziert: ent ? ent.zitat.de : null };
    }
    if (/\?$/.test(s) || /^(haftet|kann|darf|muss|ist|sind|gilt|wann|wer|wie|was|welche|unter welchen)\b/i.test(s) || s.split(" ").length > 6) return { art: "frage", text: s };
    return { art: "stichwort", text: s };
  }
  function deutungText(d) {
    if (d.art === "leer") return "Zitat, Stichwort oder Rechtsfrage. Enter führt direkt an die Stelle.";
    if (d.art === "zitat") {
      if (d.da && d.stelle) return '<b class="ja">Zitat erkannt:</b> ' + t(d.label) + (d.publiziert ? ", publiziert als " + t(d.publiziert) : "") + ". Enter springt an die Stelle.";
      if (d.da && d.nurAnfang) return '<b class="ja">Zitat erkannt:</b> ' + t(d.label) + ". Im Prototyp ist von dieser Erwägung nur der Anfang geladen; Enter springt dorthin.";
      if (d.da) return '<b class="ja">Zitat erkannt:</b> ' + t(d.label) + ". Die Stelle ist im Prototyp nicht geladen; Enter öffnet den Entscheid.";
      return '<b class="nein">Zitat erkannt, nicht im Prototyp-Bestand:</b> ' + t(d.label) + ". Die Plattform würde direkt an die Stelle springen.";
    }
    if (d.art === "frage") return "<b>Rechtsfrage erkannt.</b> Enter öffnet die Praxisübersicht (im Prototyp: Beispielfall Betriebsübergang im Konkurs).";
    return "<b>Stichwortsuche.</b> Enter zeigt die Trefferliste (im Prototyp: Treffer zu Art." + NB + "333" + NB + "OR).";
  }
  function fuehreAus(roh) {
    const d = deute(roh);
    if (d.art === "leer") return;
    if (d.art === "zitat") {
      if (!d.da) return melde("Nicht im Prototyp-Bestand: " + d.label, "Geladen sind BGE 129 III 335, BGE 137 III 487, BGE 123 III 466, BGE 127 V 183 sowie Art. 333, 333a, 333b OR.");
      return d.typ === "norm" ? geh("norm", { id: d.id, anker: d.abs ? "abs-" + d.abs : null, ziel: true }) : geh("entscheid", { id: d.id, anker: d.e ? "e-" + d.e : null, ziel: true });
    }
    if (d.art === "frage") return geh("frage");
    Z.q = d.text; geh("treffer");
  }

  /* ---------- 3 Zitierformate (Schweizer Zitierweise) ---------- */
  function zitEnt(ent, e, o) {
    o = o || {}; const spr = o.spr || Z.zitSpr, mitS = o.seite !== undefined ? o.seite : Z.zitSeite;
    const erw = e ? ent.erw.find((x) => x.nr === e) : null;
    const E = { de: " E. ", fr: " consid. ", it: " consid. " }[spr], S = { de: " S. ", fr: " p. ", it: " pag. " }[spr];
    let s = ent.zitat[spr] + (e ? E + e : "");
    if (e && mitS && erw && erw.seite) s += S + (spr === "de" ? erw.seite : erw.seite.replace(" f.", spr === "fr" ? " s." : " seg."));
    return s;
  }
  function zitNorm(n, abs, spr) {
    spr = spr || Z.zitSpr;
    const A = { de: "Art. ", fr: "art. ", it: "art. " }[spr], B = { de: " Abs. ", fr: " al. ", it: " cpv. " }[spr], erl = spr === "de" ? n.erlass : (n.erlass === "OR" ? "CO" : n.erlass);
    return A + n.art + (abs ? B + abs : "") + " " + erl;
  }
  function zitEintrag(x, spr) {
    if (x.typ === "norm") return zitNorm(LA.normen[x.id], x.abs, spr);
    return zitEnt(LA.entscheide[x.id], x.e, { spr });
  }
  function auszug(x) {
    if (x.typ === "norm") { const n = LA.normen[x.id], a = n.abs.find((y) => y.nr === (x.abs || "")) || n.abs[0]; return a.de; }
    const ent = LA.entscheide[x.id], erw = x.e ? ent.erw.find((y) => y.nr === x.e) : null;
    return erw ? (erw.text || erw.anfang).replace(/⟦[^⟧]*⟧ ?/g, "") : ent.regeste.de;
  }

  /* ---------- 4 Zustand, Navigation ---------- */
  const heute = new Date().toISOString().slice(0, 10);
  const Z = { ansicht: "start", norm: "OR-333", entscheid: "BGE-129-III-335", anker: null, ziel: false, sprachen: ["de"], stichtag: heute, regSpr: "de",
    zitSpr: "de", zitSeite: true, doppel: false, aktivPane: 0, q: "", facetten: {}, sort: "bedeutung", cursor: 0, satz: null, mappe: 0, exportFmt: "fussnoten", mappen: ladeMappen() };
  function ladeMappen() {
    try { const r = JSON.parse(localStorage.getItem("la.mappen")); if (Array.isArray(r) && r.length) return r; } catch (e) { /* ohne Speicher weiter */ }
    return [JSON.parse(JSON.stringify(LA.beispielMappe))];
  }
  function sichereMappen() { try { localStorage.setItem("la.mappen", JSON.stringify(Z.mappen)); } catch (e) { /* nur Sitzung */ } zaehleMappen(); }
  function zaehleMappen() { $("#mappen-zahl").textContent = Z.mappen.reduce((n, m) => n + m.eintraege.length, 0) || ""; }

  function geh(ansicht, p) {
    p = p || {};
    if (ansicht === "norm" && p.id) Z.norm = p.id;
    if (ansicht === "entscheid" && p.id) Z.entscheid = p.id;
    if (p.doppel !== undefined) Z.doppel = p.doppel;
    const vorher = p.halten ? aktuellerBlock() : null, vorherAnker = vorher && vorher.classList.contains("cursor") ? vorher.dataset.anker : null;
    Z.ansicht = ansicht; Z.anker = p.anker || null; Z.ziel = !!p.ziel; if (!p.halten) Z.cursor = 0;
    zeichne();
    if (vorherAnker) { const el = document.getElementById(ankerId(Z.aktivPane, vorherAnker)); if (el) el.classList.add("cursor"); }
    try { history.replaceState(null, "", "#" + ansicht); } catch (e) { /* in manchen Rahmen gesperrt */ }
    const ziel = Z.anker && document.getElementById(ankerId(Z.aktivPane, Z.anker));
    if (ziel) { ziel.scrollIntoView({ block: "start" }); if (Z.ziel) ziel.classList.add("ziel"); setzeCursor(ziel); }
    else if (!p.halten) { window.scrollTo(0, 0); }
    $("#haupt").focus({ preventScroll: true });
    aktualisiereStand();
  }
  const ankerId = (pane, a) => "p" + pane + "-" + a;

  /* ---------- 5 Ansichten ---------- */
  function zeichne() {
    const h = $("#haupt");
    $$(".haupt-nav a").forEach((a) => a.dataset.go === Z.ansicht ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
    const dok = Z.ansicht === "norm" || Z.ansicht === "entscheid";
    if (dok && Z.doppel) {
      const andere = Z.ansicht === "norm" ? dokEntscheid(1) : dokNorm(1);
      h.innerHTML = '<div class="doppel"><div class="pane aktiv" data-pane="0" tabindex="0" aria-label="Linke Hälfte">' + (Z.ansicht === "norm" ? dokNorm(0) : dokEntscheid(0)) + '</div><div class="pane" data-pane="1" tabindex="0" aria-label="Rechte Hälfte">' + andere + "</div></div>";
      $$(".pane", h).forEach((p) => p.addEventListener("scroll", aktualisiereStand, { passive: true }));
    } else {
      Z.aktivPane = 0;
      h.innerHTML = ({ start: ansStart, treffer: ansTreffer, norm: () => dokNorm(0), entscheid: () => dokEntscheid(0), frage: ansFrage, recherche: ansRecherche, mappen: ansMappen }[Z.ansicht])();
    }
    $("#stand").hidden = !dok;
    zaehleMappen();
    if (Z.ansicht === "treffer") markiereTreffer();
    if (Z.ansicht === "recherche") zeigeStelle(Z.satz === null ? 2 : Z.satz, 0);
  }

  function ansStart() {
    const kt = "ZH BE LU UR SZ OW NW GL ZG FR SO BS BL SH AR AI SG GR AG TG TI VD VS NE GE JU".split(" "), da = ["ZH", "TG", "OW", "GE", "TI"];
    return '<div class="start">' +
      '<div class="start-kopf"><p class="etikett">Freie Rechtsplattform für das Schweizer Recht</p><h1>Von der Fundstelle direkt an die Stelle im Text.</h1>' +
      "<p>Normen, Entscheide, Materialien und freie Kommentare in einer Leseansicht, verknüpft bis auf Absatz und Erwägung. Der Primärtext steht in der Mitte, alles Erschlossene am Rand.</p></div>" +
      '<form class="grossfeld" id="grossfeld" role="search" autocomplete="off"><label class="etikett" for="q2">Zitat, Stichwort oder Rechtsfrage</label><input id="q2" type="text" spellcheck="false" placeholder="BGE 129 III 335 E. 5.2"><p class="deutung" id="deutung2" aria-live="polite">' + deutungText({ art: "leer" }) + "</p></form>" +
      '<div class="spalten3">' +
      '<div><h2 class="etikett">Zitat auflösen</h2><ul>' + ["BGE 129 III 335 E. 5.2", "BGE 137 III 487 E. 4.3", "Art. 333 Abs. 3 OR", "Art. 333b OR", "4C.316/2002", "5A_113/2011"].map((x) => '<li><a href="#" data-eingabe="' + x + '">' + t(x) + "</a></li>").join("") + '<li><a href="#" class="nicht" data-eingabe="BGE 145 III 72 E. 2.1">' + t("BGE 145 III 72 E. 2.1") + " (nicht geladen)</a></li></ul></div>" +
      '<div><h2 class="etikett">Rechtsfrage stellen</h2><ul><li><a href="#" class="frei" data-eingabe="Haftet die Erwerberin eines Betriebs aus der Konkursmasse für alte Lohnforderungen?">Haftet die Erwerberin eines Betriebs aus der Konkursmasse für alte Lohnforderungen?</a></li></ul><p class="klein">Führt zur Praxisübersicht mit Gewichtung, nicht zu einer Antwort ohne Quelle.</p></div>' +
      '<div><h2 class="etikett">Stichwort suchen</h2><ul><li><a href="#" data-eingabe="Betriebsübergang Arbeitsverhältnis">Betriebsübergang Arbeitsverhältnis</a></li></ul><h2 class="etikett" style="margin-top:.8rem">Kantone</h2><div class="kantone" role="group" aria-label="Nach Kanton filtern">' +
      kt.map((k) => '<button type="button" class="' + (da.includes(k) ? "da" : "") + '" data-kanton="' + k + '" title="' + (da.includes(k) ? "Im Prototyp mit Entscheiden vertreten" : "Im Prototyp nicht geladen") + '">' + k + "</button>").join("") + '</div><p class="klein">Ein Feld für alle 26 Kantone. Hervorgehoben: im Prototyp vertreten.</p></div></div>' +
      '<section><h2 class="etikett" style="margin-bottom:.4rem">Durchgehender Beispielfall: Betriebsübergang im Konkurs</h2><ol class="gang">' +
      [["norm", "Art. 333 OR lesen", "Drei Sprachen nebeneinander, Stichtag wählen, Rechtsprechung je Absatz."],
       ["entscheid", "BGE 129 III 335 lesen", "Erwägungen als Anker, Fundstelle in der Standzeile, Zitationsnetz."],
       ["treffer", "Trefferliste zu Art. 333 OR", "Bund und Kantone in einer Liste, nach Bedeutung sortiert, Dubletten zusammengeführt."],
       ["frage", "Rechtsfrage: Haftet die Erwerberin?", "Praxisübersicht mit begründeter Gewichtung und Rechtsprechungslinie bis zur Kodifikation."],
       ["recherche", "Belegte Recherche", "Jeder Satz mit Fundstelle; wo keine ist, steht das da."],
       ["mappen", "Mappe für die Eingabe", "Fundstellen, Notizen, Zitate in Schweizer Zitierweise."]]
        .map((g) => '<li><a href="#' + g[0] + '" data-go="' + g[0] + '">' + t(g[1]) + "</a><span>" + t(g[2]) + "</span></li>").join("") + "</ol></section>" +
      '<p class="bestand"><b>Datenbestand des Prototyps.</b> Drei Artikel (Art. 333, 333a, 333b OR, Stand 1.10.2026, DE/FR/IT), vier Bundesgerichtsentscheide (einer mit acht Erwägungen im Wortlaut), neun echte Suchtreffer aus Bund und Kantonen, eine Botschaft. Alles wörtlich aus Fedlex und Opencaselaw übernommen am ' + LA.stand + ". Was nicht geladen ist, ist als solches bezeichnet; erfunden ist nichts.</p></div>";
  }

  /* Trefferliste */
  const FAC = [["instanz", "Instanz"], ["kt", "Kanton"], ["gebiet", "Rechtsgebiet"], ["zeit", "Zeitraum"], ["spr", "Sprache"], ["leitTxt", "Leitentscheid"]];
  const zeitraum = (j) => j < 2005 ? "bis 2004" : j < 2015 ? "2005 bis 2014" : "ab 2015";
  function trefferGefiltert() {
    const alle = LA.treffer.map((x) => Object.assign({ zeit: zeitraum(x.jahr), leitTxt: x.leit ? "ja" : "nein" }, x));
    const f = alle.filter((x) => FAC.every(([k]) => !Z.facetten[k] || !Z.facetten[k].length || Z.facetten[k].includes(x[k])));
    f.sort(Z.sort === "datum" ? (a, b) => b.jahr - a.jahr : (a, b) => (b.leit - a.leit) || ((b.cit || 0) - (a.cit || 0)));
    return { alle, f };
  }
  function ansTreffer() {
    const { alle, f } = trefferGefiltert(), max = Math.max.apply(null, alle.map((x) => x.cit || 0));
    const fac = FAC.map(([k, name]) => {
      const werte = {}; alle.forEach((x) => { werte[x[k]] = (werte[x[k]] || 0) + 1; });
      return "<fieldset><legend class=\"etikett\">" + name + "</legend>" + Object.keys(werte).sort().map((w) => '<label><input type="checkbox" data-fac="' + k + '" value="' + esc(w) + '"' + ((Z.facetten[k] || []).includes(w) ? " checked" : "") + "> " + esc(w) + "<span>" + werte[w] + "</span></label>").join("") + "</fieldset>";
    }).join("");
    const zeilen = f.map((x, i) => {
      const offen = !!x.id;
      return '<li class="tr" data-i="' + i + '"' + (offen ? ' data-oeffne="' + x.id + '" data-pin="' + (x.pin || "") + '"' : "") + ">" +
        '<div class="tr-l"><b>' + esc(x.instanz === "Kantonal" ? x.kt : x.instanz) + "</b><span>" + esc(x.gericht || (x.instanz === "BGE" ? "Amtliche Sammlung" : "Bundesgericht")) + "</span><span>" + esc(x.datum) + " · " + x.spr.toUpperCase() + "</span></div>" +
        '<div class="tr-m"><h2>' + (offen ? '<a href="#entscheid">' + t(x.ref) + "</a>" : t(x.ref)) + (x.leit ? ' <span class="leit">Leitentscheid</span>' : "") + "</h2>" +
        (x.titel ? '<div class="ttl">' + t(x.titel) + "</div>" : "") + "<p>" + t(x.text) + "</p>" +
        (x.pin ? '<p class="klein" style="font-family:var(--werk)">Einschlägige Stelle: <a class="ref" href="#" data-ziel="entscheid" data-id="' + x.id + '" data-e="' + x.pin + '">E.' + NB + x.pin + "</a></p>" : "") +
        (x.gruppe ? '<div class="gruppe">' + t(x.gruppe.text) + "</div>" : "") + (offen ? "" : '<div class="nichtgeladen">Volltext im Prototyp nicht geladen.</div>') + "</div>" +
        '<div class="tr-r">' + (x.cit ? '<div class="balken" aria-hidden="true"><i style="width:' + Math.round(100 * x.cit / max) + '%"></i></div>' + x.cit + " Zitierungen" + (x.citNorm ? "<br>" + x.citNorm + " zu Art." + NB + "333" : "") : "keine Zitierdaten") + "</div></li>";
    }).join("");
    return '<div class="suche"><aside class="facetten" aria-label="Filter">' + fac + '<p class="klein">' + t(LA.trefferMeta.hinweis) + "</p></aside><section>" +
      '<div class="such-kopf"><h1>' + f.length + " von " + alle.length + ' geladenen Treffern</h1><span class="klein">' + (Z.q ? "Eingabe: <span class=\"mono\">" + esc(Z.q) + "</span> · im Prototyp gezeigt: " : "") + 'Anfrage <span class="mono">' + esc(LA.trefferMeta.anfrage) + "</span> · im Bestand " + LA.trefferMeta.total + ' Treffer, davon 14 geladen und zu 9 zusammengeführt</span><div class="sort">Sortierung <button type="button" data-sort="bedeutung" aria-pressed="' + (Z.sort === "bedeutung") + '">Bedeutung</button><button type="button" data-sort="datum" aria-pressed="' + (Z.sort === "datum") + '">Datum</button></div></div>' +
      '<p class="klein" style="margin:.4rem 0">Bedeutung: Leitentscheide zuerst, dann nach Zahl der zitierenden Entscheide. <kbd>j</kbd> <kbd>k</kbd> bewegen, <kbd>Enter</kbd> öffnet.</p><ol class="liste" id="liste">' + (zeilen || '<li class="klein" style="padding:1rem 0">Kein Treffer mit diesen Filtern.</li>') + "</ol></section></div>";
  }
  function markiereTreffer() { const z = $$(".tr"); z.forEach((x, i) => x.classList.toggle("cursor", i === Z.cursor)); }

  /* Normansicht */
  const RSPR = { "OR-333": { "1": [["BGE-129-III-335", "5.1"], ["BGE-123-III-466", null]], "3": [["BGE-129-III-335", "5.2"], ["BGE-129-III-335", "5.8"], ["BGE-137-III-487", "4.3"]] }, "OR-333b": { "": [["BGE-129-III-335", "5.8"], ["BGE-137-III-487", "4.3"]] } };
  function epoche() { return LA.zeitachse.find((e) => Z.stichtag >= e.von && Z.stichtag <= e.bis) || LA.zeitachse[2]; }
  function dokNorm(pane) {
    const n = LA.normen[Z.norm], ep = epoche(), spr = Z.sprachen.filter((s) => n.abs[0][s]), mehr = spr.length > 1;
    const gilt = n.art === "333" ? true : n.art === "333a" ? ep.a333a : ep.a333b;
    const leiste = '<div class="leiste"><span class="etikett">Sprache</span><span class="gruppe">' + ["de", "fr", "it"].map((s) => '<button type="button" data-spr="' + s + '" aria-pressed="' + Z.sprachen.includes(s) + '"' + (n.abs[0][s] ? "" : ' disabled title="Im Prototyp nicht geladen"') + ">" + s.toUpperCase() + "</button>").join("") + "</span>" +
      '<span class="etikett" style="margin-left:.6rem">Stichtag</span><input type="date" id="stichtag" value="' + Z.stichtag + '" aria-label="Stichtag der Fassung"><button type="button" data-act="doppel" aria-pressed="' + Z.doppel + '">Geteilte Ansicht <kbd>s</kbd></button></div>' +
      '<div class="zeit" role="group" aria-label="Fassungen">' + LA.zeitachse.map((e, i) => '<button type="button" data-epoche="' + i + '" aria-pressed="' + (e === ep) + '"><b>' + t(e.label) + "</b><span>" + e.kurz + "</span></button>").join("") + "</div>";
    let koerper;
    if (!gilt) koerper = '<p class="hinweis">Art.' + NB + n.art + NB + "OR bestand am Stichtag " + chDatum(Z.stichtag) + " noch nicht. " + t(n.artFn.de) + "</p>";
    else if (n.art === "333" && ep.text333 === null) koerper = '<p class="hinweis">Am Stichtag ' + chDatum(Z.stichtag) + " galt die " + t(ep.label) + ". " + t(ep.hinweis) + ' <a class="ref" href="#" data-ziel="entscheid" data-id="BGE-129-III-335" data-e="5.1">' + t("BGE 129 III 335 E. 5.1") + '</a></p><p class="klein">Unten steht zum Vergleich die heutige Fassung. Abs. 1 und 1bis lauteten damals anders oder fehlten.</p>' + absaetze(n, pane, spr, mehr, ["1", "1bis"], "seit 1.5.1994");
    else koerper = absaetze(n, pane, spr, mehr, n.art === "333" ? (ep.geaendert || []) : [], "in dieser Fassung neu");
    const zuAbs = RSPR[n.id] || {};
    const rspr = [["BGE-123-III-466", 39, 135], ["BGE-127-V-183", 36, 162], ["BGE-129-III-335", 36, 157], ["BGE-137-III-487", null, 30]];
    const text = '<div class="text norm"><header class="dok-kopf"><p class="etikett">' + t(n.titel.de) + " · SR" + NB + n.sr + " · " + t(n.gliederung) + '</p><h1 id="' + ankerId(pane, "kopf") + '">Art.' + NB + n.art + NB + n.erlass + '</h1><div class="meta"><span>Stand <b>' + n.stand + '</b></span><span>Quelle <a href="' + n.eli + '" target="_blank" rel="noopener">Fedlex</a></span>' + (n.artFn ? "<span>" + t(n.artFn.de) + "</span>" : "") + "</div></header>" + leiste +
      (ep.aenderung && n.art === "333" ? '<p class="hinweis neutral"><b>' + t(ep.label) + ".</b> " + t(ep.aenderung) + " " + t(ep.hinweis) + "</p>" : "") +
      (Z.stichtag < LA.pending.datum && n.art === "333" && ep === LA.zeitachse[2] ? '<p class="klein">' + t(LA.pending.text) + "</p>" : "") +
      koerper +
      (n.sprachbefund && mehr ? '<section class="abschnitt"><h2>Sprachvergleich <span>redaktioneller Hinweis</span></h2>' + n.sprachbefund.map((b) => '<p class="zitat-kasten">' + t(b.text) + "</p>").join("") + "</section>" : "") +
      '<section class="abschnitt" id="' + ankerId(pane, "rspr") + '"><h2>Rechtsprechung <span>nach Bedeutung: Zitierungen in Entscheiden, die Art.' + NB + "333" + NB + 'OR anwenden</span></h2><div class="rollen"><table class="tab"><thead><tr><th>Entscheid</th><th>Gegenstand</th><th>zu Art.' + NB + "333</th><th>gesamt</th></tr></thead><tbody>" +
      rspr.map((r) => { const e = LA.entscheide[r[0]]; return '<tr><td class="z"><a class="ref" href="#" data-ziel="entscheid" data-id="' + e.id + '">' + t(e.zitat.de) + "</a><br>" + e.datum + (e.sprache !== "de" ? " · " + e.sprache.toUpperCase() : "") + '</td><td style="font-family:var(--lese)">' + t(e.regeste.de.length > 150 ? e.regeste.de.slice(0, 150).replace(/\s\S*$/, "") + " …" : e.regeste.de) + '</td><td class="r">' + (r[1] || "–") + '</td><td class="r">' + r[2] + "</td></tr>"; }).join("") + "</tbody></table></div>" +
      '<p class="klein">Kantonale Entscheide zu dieser Norm: <a href="#treffer" data-go="treffer">Trefferliste</a>.</p></section>' +
      '<section class="abschnitt" id="' + ankerId(pane, "mat") + '"><h2>Materialien</h2>' + LA.materialien.map((m) => '<div style="margin-bottom:.7rem"><b class="mono">' + t(m.zitat) + "</b> · " + t(m.titel) + ' <span class="klein">(' + m.datum + ", zu " + t(m.zu) + ")</span>" +
        m.stellen.map((s) => '<p class="zitat-kasten">' + t(s.text) + '\n<span class="klein" style="font-family:var(--werk)">' + t(m.zitat) + ", S." + NB + s.s + " · " + s.art + "</span></p>").join("") + (m.hinweis ? '<p class="klein">' + t(m.hinweis) + "</p>" : "") + "</div>").join("") +
      '<p class="klein">Amtliches Bulletin: im Prototyp nicht angebunden.</p></section>' +
      '<section class="abschnitt" id="' + ankerId(pane, "komm") + '"><h2>Freie Kommentierung</h2><p class="klein">Zu Art.' + NB + n.art + NB + "OR ist im Prototyp keine frei lizenzierte Kommentierung geladen. Kommentare aus Swisslex und Legalis sind nicht frei nutzbar und werden nur als Fundstelle nachgewiesen, soweit ein Entscheid sie zitiert (siehe BGE" + NB + "137" + NB + "III" + NB + "487 E." + NB + "4.3).</p></section>" +
      '<section class="abschnitt" id="' + ankerId(pane, "verw") + '"><h2>Verwandte Normen</h2><p>' + ["OR-333", "OR-333a", "OR-333b"].filter((x) => x !== n.id).map((x) => '<a class="beleg" href="#" data-ziel="norm" data-id="' + x + '">Art.' + NB + LA.normen[x].art + NB + "OR</a>").join(" ") + ' <span class="beleg tot" title="Im Prototyp nicht geladen">Art.' + NB + "362" + NB + 'OR</span> <span class="beleg tot" title="Im Prototyp nicht geladen">Art.' + NB + "51" + NB + "AVIG</span></p></section></div>";
    const rail = '<nav class="rail" aria-label="Gliederung"><p class="etikett">Art.' + NB + n.art + "</p><ol>" + n.abs.map((a) => '<li><a href="#" data-anker="abs-' + a.nr + '"><span class="n">' + (a.nr ? "Abs." + NB + a.nr : "Text") + '</span><span class="t">' + (zuAbs[a.nr] ? zuAbs[a.nr].length + " Stellen" : "") + "</span></a></li>").join("") + '</ol><p class="etikett">Erschlossen</p><ol>' + [["rspr", "Rechtsprechung"], ["mat", "Materialien"], ["komm", "Kommentierung"], ["verw", "Verwandte Normen"]].map((x) => '<li><a href="#" data-anker="' + x[0] + '"><span class="n"></span><span class="t" style="display:inline">' + x[1] + "</span></a></li>").join("") + "</ol></nav>";
    return '<div class="dok" data-typ="norm" data-id="' + n.id + '">' + rail + text + "</div>";
  }
  function absaetze(n, pane, spr, mehr, geaendert, wann) {
    const zuAbs = RSPR[n.id] || {};
    return n.abs.map((a) => {
      const rand = [];
      if (geaendert.includes(a.nr)) rand.push('<span class="geaendert">Geändert ' + wann + "</span>");
      if (a.fn && n.fussnoten[a.fn]) rand.push(spr.map((s) => '<div class="fn"><sup>' + a.fn + (mehr ? " " + s.toUpperCase() : "") + "</sup>" + t(n.fussnoten[a.fn][s]) + "</div>").join(""));
      if (zuAbs[a.nr]) rand.push('<div><div class="etikett">Rechtsprechung zu diesem Absatz</div><ul>' + zuAbs[a.nr].map((r) => '<li><a class="ref" href="#" data-ziel="entscheid" data-id="' + r[0] + '"' + (r[1] ? ' data-e="' + r[1] + '"' : "") + ">" + t(zitEnt(LA.entscheide[r[0]], r[1], { spr: "de", seite: false })) + "</a></li>").join("") + "</ul></div>");
      rand.push('<div class="werkz"><button type="button" data-kopie="norm" data-id="' + n.id + '" data-abs="' + a.nr + '">Zitat kopieren</button><button type="button" data-ablage="norm" data-id="' + n.id + '" data-abs="' + a.nr + '">In Mappe</button></div>');
      const saetze = mehr ? '<div class="sprachen n' + spr.length + '">' + spr.map((s) => '<p class="satz" lang="' + s + '" data-spr="' + s + '">' + primaer(a[s]) + "</p>").join("") + "</div>" : '<p class="satz" lang="' + spr[0] + '">' + primaer(a[spr[0]]) + "</p>";
      const lit = a.lit ? '<ol class="lit">' + a.lit.map((l) => "<li><span>" + l.l + ".</span><span>" + t(l.de) + "</span></li>").join("") + "</ol>" : "";
      return '<div class="block' + (mehr && spr.length === 3 ? " breit" : "") + '" id="' + ankerId(pane, "abs-" + a.nr) + '" data-anker="abs-' + a.nr + '" tabindex="-1"><div class="ziffer"><a href="#" data-anker="abs-' + a.nr + '" title="Anker auf diesen Absatz">' + (a.nr ? a.nr.replace("bis", "<sup>bis</sup>") : "") + "</a></div><div>" + saetze + lit + '</div><aside class="rand">' + rand.join("") + "</aside></div>";
    }).join("");
  }
  const chDatum = (iso) => { const p = iso.split("-"); return +p[2] + "." + +p[1] + "." + p[0]; };

  /* Entscheidansicht */
  function dokEntscheid(pane) {
    const e = LA.entscheide[Z.entscheid];
    const regSpr = e.regeste[Z.regSpr] ? Z.regSpr : "de";
    const erw = e.erw.map((x) => {
      const zit = x.text ? Array.from(new Set((nb(x.text).match(REF) || []))).filter((r) => !r.startsWith("BGE" + NB + e.zitat.de.slice(4).replace(/ /g, NB)) || /E\./.test(r)).slice(0, 8) : [];
      const rand = [];
      if (x.thema) rand.push('<div class="randtitel">' + t(x.thema) + "</div>");
      (x.rand || []).forEach((r) => rand.push('<div class="notiz">' + t(r.text) + "</div>"));
      if (x.text) rand.push('<div class="werkz"><button type="button" data-kopie="entscheid" data-id="' + e.id + '" data-e="' + x.nr + '" title="Fundstelle kopieren (c)">Zitat kopieren</button><button type="button" data-wortlaut="' + x.nr + '" data-id="' + e.id + '" title="Wortlaut in «» mit Fundstelle kopieren">mit Wortlaut</button><button type="button" data-ablage="entscheid" data-id="' + e.id + '" data-e="' + x.nr + '" title="In Mappe legen (m)">In Mappe</button></div>');
      if (zit.length) rand.push('<div><div class="etikett">Verweise in dieser Erwägung</div><ul>' + zit.map((r) => "<li>" + primaer(r.replace(new RegExp(NB, "g"), " ")) + "</li>").join("") + "</ul></div>");
      const inhalt = x.text ? '<p class="satz">' + primaer(x.text, e.id) + "</p>" : '<p class="satz teiltext">' + primaer(x.anfang, e.id) + '</p><p class="klein">Im Prototyp nur der Anfang geladen.</p>';
      return '<div class="block t' + x.tiefe + '" id="' + ankerId(pane, "e-" + x.nr) + '" data-anker="e-' + x.nr + '" data-e="' + x.nr + '" tabindex="-1"><div class="ziffer"><a href="#" data-anker="e-' + x.nr + '" title="Anker auf E. ' + x.nr + '">' + x.nr + "</a></div><div>" + inhalt + '</div><aside class="rand">' + rand.join("") + "</aside></div>";
    }).join("");
    const sv = e.sachverhalt.length ? '<section class="abschnitt" id="' + ankerId(pane, "sv") + '"><h2>Sachverhalt <span>ab S.' + NB + e.startseite + "</span></h2>" + e.sachverhalt.map((s) => '<div class="block t2"><div class="ziffer">' + s.l + '</div><div><p class="satz">' + primaer(s.text, e.id) + "</p>" + (s.rest ? '<p class="klein">Rest des Sachverhalts im Prototyp nicht geladen.</p>' : "") + '</div><aside class="rand"></aside></div>').join("") + "</section>" : "";
    const ABT = { "2C": "BGer II. öff.-rechtl. Abt. (2C)", "4A": "BGer I. zivilrechtl. Abt. (4A)" };
    const ebenen = {}; e.zitiertVonListe.forEach((z) => { const m = z.ref.match(/^(\d[A-Z])_/); z.gruppe = m ? (ABT[m[1]] || "BGer " + m[1]) : z.kt ? "Kanton " + z.kt : z.ebene; ebenen[z.gruppe] = (ebenen[z.gruppe] || 0) + 1; });
    const netz = (e.zitiert.length || e.zitiertVonListe.length) ? '<section class="abschnitt" id="' + ankerId(pane, "netz") + '"><h2>Zitationsnetz <span>' + (e.zitiertVon ? e.zitiertVon + " zitierende Entscheide im Bestand" : "") + '</span></h2><div class="netz"><div><h3>Stützt sich auf (' + e.zitiert.length + ")</h3><ul>" +
      e.zitiert.map((z) => '<li><span class="z">' + (z.id ? '<a class="ref" href="#" data-ziel="entscheid" data-id="' + z.id + '">' + t(z.ref) + "</a>" : t(z.ref)) + '</span><span class="x">' + (z.offen ? "nicht aufgelöst" : z.n + "× · " + z.jahr) + "</span></li>").join("") + '</ul></div><div class="mitte">' + t(e.zitat.de) + "</div><div><h3>Wird zitiert von</h3>" +
      (e.zitiertVonListe.length ? '<p class="etikett">Nach Gericht und Abteilung (geladene Stichprobe)</p><div class="ebenen">' + Object.keys(ebenen).map((k) => "<div><span>" + esc(k) + '</span><i style="width:' + (100 * ebenen[k] / e.zitiertVonListe.length) + '%"></i><span class="mono">' + ebenen[k] + "</span></div>").join("") + "</div><ul>" + e.zitiertVonListe.map((z) => '<li><span class="z">' + t(z.ref) + "</span><span>" + t(z.gericht) + (z.unsicher ? ' <span class="klein">· ' + t(z.unsicher) + "</span>" : "") + '</span><span class="x">' + z.datum + "</span></li>").join("") + '</ul><p class="klein">' + t(e.netzHinweis || "") + "</p>" : '<p class="klein">Im Prototyp nicht geladen.</p>') + "</div></div></section>" : "";
    const text = '<div class="text"><header class="dok-kopf"><p class="etikett">' + t(e.art) + " · " + t(e.gericht) + (e.abteilung ? ", " + t(e.abteilung) : "") + '</p><h1 id="' + ankerId(pane, "kopf") + '">' + t(e.zitat.de) + '</h1><div class="meta"><span>Urteil vom <b>' + e.datum + "</b></span>" + (e.docket ? "<span>Geschäftsnummer <b class=\"mono\">" + e.docket + "</b></span>" : "") + "<span>Originalsprache <b>" + { de: "Deutsch", fr: "Französisch", it: "Italienisch" }[e.sprache] + '</b></span><span>Quelle <a href="' + e.url + '" target="_blank" rel="noopener">Opencaselaw</a></span></div>' + (e.parteien ? '<p class="klein">' + t(e.parteien) + "</p>" : "") + "</header>" +
      (e.rechtslage ? '<p class="hinweis">' + t(e.rechtslage.text) + ' <a href="#" data-ziel="norm" data-id="' + e.rechtslage.ziel.id + '">Art.' + NB + LA.normen[e.rechtslage.ziel.id].art + NB + "OR öffnen</a></p>" : "") +
      (e.nurAuszug ? '<p class="hinweis neutral">' + t(e.nurAuszug) + "</p>" : "") +
      '<div class="leiste"><span class="etikett">Regeste</span><span class="gruppe">' + ["de", "fr", "it"].map((s) => '<button type="button" data-regspr="' + s + '" aria-pressed="' + (regSpr === s) + '"' + (e.regeste[s] ? "" : " disabled") + ">" + s.toUpperCase() + '</button>').join("") + '</span><button type="button" data-act="doppel" aria-pressed="' + Z.doppel + '">Geteilte Ansicht <kbd>s</kbd></button><span class="klein"><kbd>j</kbd> <kbd>k</kbd> Erwägung · <kbd>c</kbd> Zitat · <kbd>m</kbd> Mappe</span></div>' +
      (e.gang ? '<p class="klein" style="margin:.5rem 0 .2rem"><span class="etikett">Gang der Begründung</span> <span class="klein">redaktionell, aus Regeste und Erwägungen</span></p><p class="belege" style="margin:0 0 .7rem">' + e.gang.map((g) => '<a class="beleg" href="#" data-ziel="entscheid" data-id="' + e.id + '" data-e="' + g[0] + '">E.' + NB + g[0] + " " + t(g[1]) + "</a>").join("") + "</p>" : "") +
      '<section id="' + ankerId(pane, "regeste") + '"><p class="regeste" lang="' + regSpr + '">' + primaer(e.regeste[regSpr], e.id) + "</p></section>" + sv +
      (e.erw.length ? '<section class="abschnitt" id="' + ankerId(pane, "erw") + '"><h2>Erwägungen <span>' + e.erw.filter((x) => x.text).length + " von " + e.erw.length + " im Wortlaut geladen</span></h2>" + erw + "</section>" : "") +
      (e.dispositiv ? '<section class="abschnitt" id="' + ankerId(pane, "disp") + '"><h2>Dispositiv</h2><p class="klein">' + t(e.dispositiv) + "</p></section>" : "") + netz + "</div>";
    const rail = '<nav class="rail" aria-label="Gliederung"><p class="etikett">Aufbau</p><ol><li><a href="#" data-anker="regeste"><span class="n">Reg.</span><span class="t">Regeste</span></a></li>' + (e.sachverhalt.length ? '<li><a href="#" data-anker="sv"><span class="n">A.–B.</span><span class="t">Sachverhalt</span></a></li>' : "") + "</ol>" +
      (e.erw.length ? '<p class="etikett">Erwägungen</p><ol>' + e.erw.map((x) => '<li class="t' + x.tiefe + '"><a href="#" data-anker="e-' + x.nr + '" class="' + (x.text ? "" : "teil") + (x.kern ? " kern" : "") + '"><span class="n">' + x.nr + '</span><span class="t">' + t(x.thema || "") + "</span></a></li>").join("") + "</ol>" : "") +
      '<ol>' + (e.dispositiv ? '<li><a href="#" data-anker="disp"><span class="n">Disp.</span><span class="t">Dispositiv</span></a></li>' : "") + (e.zitiert.length ? '<li><a href="#" data-anker="netz"><span class="n">Netz</span><span class="t">Zitationsnetz</span></a></li>' : "") + '</ol><p class="klein">■ Kernstelle · grau: nur Anfang geladen</p></nav>';
    return '<div class="dok" data-typ="entscheid" data-id="' + e.id + '">' + rail + text + "</div>";
  }

  /* Standzeile: die Fundstelle, an der man gerade liest */
  function aktuellerBlock() {
    const wurzel = Z.doppel ? $('.pane[data-pane="' + Z.aktivPane + '"]') : document;
    if (!wurzel) return null;
    const cur = $(".block.cursor[data-anker]", wurzel); if (cur) return cur;
    const oben = Z.doppel ? wurzel.getBoundingClientRect().top + 40 : 150;
    let treffer = null;
    $$(".block[data-anker]", wurzel).forEach((b) => { if (b.getBoundingClientRect().top <= oben) treffer = b; });
    return treffer;
  }
  function standFund() {
    const wurzel = Z.doppel ? $('.pane[data-pane="' + Z.aktivPane + '"]') : document, dok = wurzel && $(".dok", wurzel);
    if (!dok) return null;
    const b = aktuellerBlock(), a = b ? b.dataset.anker : null;
    if (dok.dataset.typ === "norm") { const abs = a && a.startsWith("abs-") ? a.slice(4) : null; return { typ: "norm", id: dok.dataset.id, abs, text: zitNorm(LA.normen[dok.dataset.id], abs) }; }
    const e = a && a.startsWith("e-") ? a.slice(2) : null;
    return { typ: "entscheid", id: dok.dataset.id, e, text: zitEnt(LA.entscheide[dok.dataset.id], e) };
  }
  function aktualisiereStand() {
    const s = $("#stand"); if (s.hidden) return;
    const f = standFund(); if (!f) return;
    const sig = f.text + Z.zitSpr + Z.zitSeite + Z.doppel + Z.aktivPane;
    if (s.dataset.sig !== sig) {
      s.dataset.sig = sig;
      s.innerHTML = '<span class="etikett" style="color:inherit;opacity:.7">Fundstelle</span><span class="fund" id="fund">' + t(f.text) + '</span><button type="button" data-act="kopiere-stand">Kopieren <kbd>c</kbd></button><button type="button" data-act="ablage-stand">In Mappe <kbd>m</kbd></button><span class="fuell"></span><span class="etikett" style="color:inherit;opacity:.7">Zitierweise</span>' +
        ["de", "fr", "it"].map((x) => '<button type="button" data-zitspr="' + x + '" aria-pressed="' + (Z.zitSpr === x) + '" title="Zitierweise ' + x.toUpperCase() + '">' + x.toUpperCase() + "</button>").join("") +
        '<button type="button" data-act="zitseite" aria-pressed="' + Z.zitSeite + '" title="Seitenzahl anfügen, wo sie gesichert ist">mit Seite</button>' + (Z.doppel ? '<span class="klein" style="color:inherit;opacity:.7">' + (Z.aktivPane ? "rechte" : "linke") + " Hälfte</span>" : "");
    }
    const b = aktuellerBlock(), wurzel = Z.doppel ? $('.pane[data-pane="' + Z.aktivPane + '"]') : document;
    $$(".rail a", wurzel).forEach((a) => a.classList.toggle("hier", !!b && a.dataset.anker === b.dataset.anker));
  }
  function setzeCursor(el) {
    const pane = el.closest(".pane"); if (pane) setzePane(+pane.dataset.pane);
    $$(".block.cursor").forEach((b) => b.classList.remove("cursor"));
    if (el.classList.contains("block")) el.classList.add("cursor");
    aktualisiereStand();
  }
  function setzePane(i) { if (Z.aktivPane === i) return; Z.aktivPane = i; $$(".pane").forEach((p) => p.classList.toggle("aktiv", +p.dataset.pane === i)); $("#stand").dataset.sig = ""; }
  function springe(anker, pane, ziel, sanft) {
    const el = document.getElementById(ankerId(pane, anker)); if (!el) return;
    $$(".block.ziel").forEach((b) => b.classList.remove("ziel"));
    el.scrollIntoView({ block: "start", behavior: sanft && !matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto" });
    if (ziel) el.classList.add("ziel");
    setzeCursor(el);
  }

  /* Rechtsfrage */
  function belegKnopf(b) {
    if (b.typ === "treffer") return '<span class="beleg tot" title="Volltext im Prototyp nicht geladen">' + t(b.label) + "</span>";
    if (b.typ === "material") return '<a class="beleg" href="#" data-ziel="norm" data-id="OR-333b" data-anker="mat">' + t(b.label) + "</a>";
    return '<a class="beleg" href="#" data-ziel="' + b.typ + '" data-id="' + b.id + '"' + (b.e ? ' data-e="' + b.e + '"' : "") + (b.abs !== undefined ? ' data-abs="' + b.abs + '"' : "") + ">" + t(b.label || zitEintrag(b, "de")) + "</a>";
  }
  function ansFrage() {
    const f = LA.frage;
    return '<article style="max-width:76rem"><header class="frage-kopf dok-kopf"><p class="etikett">Rechtsfrage · Arbeitsrecht, Sanierungsrecht · redaktionelle Einordnung, Prototyp-Beispiel</p><h1>' + t(f.titel) + '</h1><p class="antwort">' + t(f.kurz) + "</p></header>" +
      '<section class="abschnitt"><h2>Gewicht der Aussagen <span>die Form trägt die Bedeutung</span></h2><div class="legende">' + Object.keys(LA.gewichte).map(gw).join("") + '</div><p class="klein">Jede Einstufung ist begründet und führt zu den Stellen im Originaltext. Eine Einstufung ist ein Wegweiser, keine Quelle.</p></section>' +
      '<section class="abschnitt"><h2>Praxisübersicht</h2><ol class="aussagen">' + f.aussagen.map((a) => "<li><div>" + gw(a.gewicht) + '</div><div><h3>' + t(a.titel) + '</h3><div class="belege">' + (a.belege.length ? a.belege.map(belegKnopf).join("") : '<span class="klein">keine Fundstelle</span>') + '</div></div><p class="klein" style="margin:0"><span class="etikett">Warum diese Einstufung</span><br>' + t(a.grund) + "</p></li>").join("") + "</ol></section>" +
      '<section class="abschnitt"><h2>Rechtsprechungslinie <span>vom Gesetz über die Praxis zurück ins Gesetz · Quadrat: Gesetzgeber, Kreis: Gericht</span></h2><ol class="linie">' + f.linie.map((l) => '<li class="' + l.typ + (l.kern ? " kern" : "") + '"><span class="jahr">' + l.jahr + '</span><span class="knoten" aria-hidden="true"></span><div>' + (l.rel ? '<div class="rel">' + t(l.rel) + "</div>" : "") + '<h3><button type="button" data-ziel="' + l.beleg.typ + '" data-id="' + l.beleg.id + '"' + (l.beleg.e ? ' data-e="' + l.beleg.e + '"' : "") + (l.beleg.abs !== undefined ? ' data-abs="' + l.beleg.abs + '"' : "") + ">" + t(l.titel) + "</button></h3><p>" + t(l.text) + "</p></div></li>").join("") + '</ol><p class="klein">Praxisänderungen: im geladenen Bestand keine. Die Linie endet nicht mit einem Urteil, sondern mit Art.' + NB + "333b" + NB + "OR.</p></section></article>";
  }

  /* Belegte Recherche */
  function ansRecherche() {
    const r = LA.recherche;
    return '<div class="rech"><section><header class="dok-kopf"><p class="etikett">Belegte Recherche</p><h1 style="font-size:1.35rem">' + t(r.frage) + '</h1></header><div class="maschine"><span class="etikett">Maschinell erzeugt · Beispielausgabe, nicht live</span><div class="innen"><ol class="saetze">' +
      r.saetze.map((s, i) => '<li class="' + (s.belege.length ? "" : "ohne") + '" data-satz="' + i + '"><div><p>' + t(s.text) + '</p><div class="belege" style="align-items:center">' + gw(s.gewicht) + s.belege.map((b, j) => '<button type="button" class="beleg" data-stelle="' + i + "," + j + '">' + t(b.label) + "</button>").join("") + "</div></div></li>").join("") +
      '</ol></div></div><p class="klein" style="margin-top:.6rem"><b>Prüfprotokoll.</b> ' + t(r.pruefung) + '</p><p class="klein">Die Antwort ist ein Wegweiser. Zitierfähig ist nur die Stelle rechts. Im Prototyp ist die Recherche nicht an ein Sprachmodell angeschlossen; gezeigt wird eine geprüfte Beispielausgabe zur Frage des Beispielfalls.</p></section><aside class="stelle" id="stelle" aria-live="polite"></aside></div>';
  }
  function zeigeStelle(i, j) {
    Z.satz = i; const s = LA.recherche.saetze[i], b = s.belege[j], el = $("#stelle"); if (!el) return;
    $$(".saetze li").forEach((li) => li.classList.toggle("an", +li.dataset.satz === i));
    if (!b) { el.innerHTML = '<p class="etikett">Belegstelle</p><p class="klein">Zu diesem Satz gibt es keine Fundstelle. Er behauptet deshalb nichts.</p>'; return; }
    el.innerHTML = '<p class="etikett">Belegstelle im Originaltext</p><h2>' + t(zitEintrag(b, "de")) + '</h2><p class="satz">' + primaer(auszug(b), b.id) + '</p><div class="leiste"><a class="beleg" href="#" data-ziel="' + b.typ + '" data-id="' + b.id + '"' + (b.e ? ' data-e="' + b.e + '"' : "") + (b.abs !== undefined ? ' data-abs="' + b.abs + '"' : "") + '>Im Dokument öffnen</a><button type="button" data-kopie="' + b.typ + '" data-id="' + b.id + '"' + (b.e ? ' data-e="' + b.e + '"' : "") + (b.abs !== undefined ? ' data-abs="' + b.abs + '"' : "") + ">Zitat kopieren</button></div>";
  }

  /* ---------- 6 Mappen ---------- */
  function ablegen(x) {
    const m = Z.mappen[Z.mappe] || Z.mappen[0];
    if (m.eintraege.some((y) => y.typ === x.typ && y.id === x.id && (y.e || "") === (x.e || "") && (y.abs || "") === (x.abs || ""))) return melde("Liegt schon in «" + m.name + "»", zitEintrag(x));
    m.eintraege.push(Object.assign({ notiz: "" }, x)); sichereMappen(); melde("Abgelegt in «" + m.name + "»", zitEintrag(x));
  }
  function exportText(m) {
    if (Z.exportFmt === "json") return JSON.stringify(m.eintraege.map((x) => ({ zitat: zitEintrag(x, "de"), notiz: x.notiz || "" })), null, 1);
    if (Z.exportFmt === "markdown") return "# " + m.name + "\n\n" + m.eintraege.map((x) => "- **" + zitEintrag(x, "de") + "**" + (x.notiz ? ": " + x.notiz : "") + "\n  > " + auszug(x).slice(0, 220) + "…").join("\n");
    return m.eintraege.map((x, i) => (i + 1) + " " + zitEintrag(x, Z.zitSpr).replace(/\.$/, "") + ".").join("\n");
  }
  function ansMappen() {
    const m = Z.mappen[Z.mappe] || Z.mappen[0];
    return '<div class="mappen"><aside><p class="etikett">Mappen</p><ul class="mappen-liste">' + Z.mappen.map((x, i) => '<li><button type="button" data-mappe="' + i + '" aria-current="' + (i === Z.mappe) + '"><span>' + esc(x.name) + '</span><span class="mono">' + x.eintraege.length + "</span></button></li>").join("") + '</ul><form class="neu" id="neu-mappe"><label class="sr" for="mname">Name der neuen Mappe</label><input id="mname" placeholder="Neue Mappe" maxlength="60"><button type="submit">Anlegen</button></form><p class="klein" style="margin-top:.6rem">Mappen liegen nur in diesem Browser. Kein Konto, keine Übertragung.</p></aside><section>' +
      '<header class="dok-kopf"><p class="etikett">Arbeitsbereich</p><h1 style="font-size:1.4rem">' + esc(m.name) + "</h1></header>" +
      (m.eintraege.length ? m.eintraege.map((x, i) => '<div class="eintrag"><div><h3><a href="#" data-ziel="' + x.typ + '" data-id="' + x.id + '"' + (x.e ? ' data-e="' + x.e + '"' : "") + (x.abs !== undefined ? ' data-abs="' + x.abs + '"' : "") + ">" + t(zitEintrag(x, Z.zitSpr)) + "</a></h3><p>" + t(auszug(x).slice(0, 230)) + '…</p><div class="leiste" style="margin:0"><button type="button" data-kopie="' + x.typ + '" data-id="' + x.id + '"' + (x.e ? ' data-e="' + x.e + '"' : "") + (x.abs !== undefined ? ' data-abs="' + x.abs + '"' : "") + '>Zitat kopieren</button><button type="button" data-entferne="' + i + '">Entfernen</button></div></div><div><label class="etikett" for="notiz-' + i + '">Notiz</label><textarea id="notiz-' + i + '" data-notiz="' + i + '">' + esc(x.notiz || "") + "</textarea></div></div>").join("") : '<p class="klein" style="padding:1rem 0">Noch leer. In jeder Leseansicht legt <kbd>m</kbd> die aktuelle Stelle hier ab.</p>') +
      '<section class="abschnitt export"><h2>Export</h2><div class="leiste"><span class="gruppe">' + [["fussnoten", "Fussnoten"], ["markdown", "Markdown mit Auszug"], ["json", "JSON"]].map((f) => '<button type="button" data-fmt="' + f[0] + '" aria-pressed="' + (Z.exportFmt === f[0]) + '">' + f[1] + '</button>').join("") + '</span><span class="etikett">Zitierweise</span><span class="gruppe">' + ["de", "fr", "it"].map((x) => '<button type="button" data-zitspr="' + x + '" aria-pressed="' + (Z.zitSpr === x) + '">' + x.toUpperCase() + '</button>').join("") + '</span><button type="button" data-act="kopiere-export">Alles kopieren</button></div><label class="sr" for="export">Exporttext</label><textarea id="export" readonly>' + esc(exportText(m)) + "</textarea></section></section></div>";
  }

  /* ---------- 7 Palette, Meldungen, Kopieren ---------- */
  let toastZeit;
  function melde(titel, text) { const el = $("#toast"); el.innerHTML = "<b>" + esc(titel) + "</b>" + (text ? "<code>" + t(text) + "</code>" : ""); el.hidden = false; clearTimeout(toastZeit); toastZeit = setTimeout(() => { el.hidden = true; }, 4200); }
  function kopiere(text) {
    const fertig = () => melde("Kopiert", text), ersatz = () => melde("Kopieren gesperrt. Text markieren und kopieren:", text);
    try { navigator.clipboard.writeText(nb(text)).then(fertig, ersatz); } catch (e) { ersatz(); }
  }
  const BEFEHLE = [
    ["Startseite", () => geh("start")], ["Trefferliste zu Art. 333 OR", () => geh("treffer")], ["Art. 333 OR", () => geh("norm", { id: "OR-333" })], ["Art. 333a OR", () => geh("norm", { id: "OR-333a" })], ["Art. 333b OR", () => geh("norm", { id: "OR-333b" })],
    ["BGE 129 III 335", () => geh("entscheid", { id: "BGE-129-III-335" })], ["BGE 137 III 487", () => geh("entscheid", { id: "BGE-137-III-487" })], ["BGE 123 III 466", () => geh("entscheid", { id: "BGE-123-III-466" })], ["BGE 127 V 183", () => geh("entscheid", { id: "BGE-127-V-183" })],
    ["Rechtsfrage: Erwerberhaftung im Konkurs", () => geh("frage")], ["Belegte Recherche", () => geh("recherche")], ["Mappen", () => geh("mappen")],
    ["Geteilte Ansicht: Norm links, Entscheid rechts", () => geh("norm", { id: "OR-333", doppel: true })], ["Hell/Dunkel umschalten", thema], ["Tastenkürzel anzeigen", () => palette(true)]
  ];
  let palSel = 0, palListe = [];
  function palette(hilfe) {
    const s = $("#schleier"); s.hidden = false;
    if (hilfe) { s.innerHTML = '<div class="palette" role="dialog" aria-modal="true" aria-label="Tastenkürzel"><div class="hilfe">' + [["/", "Suchfeld"], ["Ctrl/⌘ K", "Befehle und Zitate"], ["j / k", "nächste / vorige Erwägung, Absatz oder Treffer"], ["Enter", "Treffer öffnen"], ["c", "Fundstelle kopieren"], ["m", "Stelle in die Mappe legen"], ["s", "geteilte Ansicht"], ["Tab", "in der geteilten Ansicht die Hälfte wechseln"], ["t", "Hell/Dunkel"], ["?", "diese Übersicht"], ["Esc", "schliessen"]].map((k) => "<kbd>" + k[0] + "</kbd><span>" + k[1] + "</span>").join("") + '</div><div style="padding:.5rem .8rem"><button type="button" data-act="zu">Schliessen</button></div></div>'; $("button", s).focus(); return; }
    s.innerHTML = '<div class="palette" role="dialog" aria-modal="true" aria-label="Befehle"><label class="sr" for="pal">Befehl oder Zitat</label><input id="pal" type="text" placeholder="Befehl, Zitat oder Dokument" autocomplete="off" spellcheck="false"><ul id="pal-liste" role="listbox"></ul></div>';
    palSel = 0; fuellePalette(""); $("#pal").focus();
  }
  function fuellePalette(q) {
    const d = deute(q), ql = q.toLowerCase(); palListe = [];
    if (d.art === "zitat") palListe.push([(d.da ? "Springe zu " : "Nicht geladen: ") + d.label, () => fuehreAus(q), "Zitat"]);
    BEFEHLE.forEach((b) => { if (!ql || b[0].toLowerCase().includes(ql)) palListe.push([b[0], b[1], ""]); });
    if (q && d.art !== "zitat") palListe.push(["Suchen nach «" + q + "»", () => fuehreAus(q), d.art === "frage" ? "Rechtsfrage" : "Stichwort"]);
    palSel = Math.min(palSel, Math.max(0, palListe.length - 1));
    $("#pal-liste").innerHTML = palListe.map((p, i) => '<li role="option" data-pal="' + i + '" aria-selected="' + (i === palSel) + '">' + t(p[0]) + "<span>" + p[2] + "</span></li>").join("");
  }
  function schliesse() { const s = $("#schleier"); if (!s.hidden) { s.hidden = true; s.innerHTML = ""; $("#haupt").focus({ preventScroll: true }); } }
  function thema() { const r = document.documentElement, dunkel = r.dataset.theme ? r.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; r.dataset.theme = dunkel ? "light" : "dark"; }
  function doppel() { if (Z.ansicht !== "norm" && Z.ansicht !== "entscheid") return geh("norm", { doppel: true }); const b = aktuellerBlock(); geh(Z.ansicht, { doppel: !Z.doppel, anker: b ? b.dataset.anker : null }); }
  function bewege(d) {
    if (Z.ansicht === "treffer") { const n = $$(".tr").length; if (!n) return; Z.cursor = Math.max(0, Math.min(n - 1, Z.cursor + d)); markiereTreffer(); $$(".tr")[Z.cursor].scrollIntoView({ block: "nearest" }); return; }
    const wurzel = Z.doppel ? $('.pane[data-pane="' + Z.aktivPane + '"]') : document, bl = $$(".block[data-anker]", wurzel); if (!bl.length) return;
    const cur = aktuellerBlock(); let i = cur ? bl.indexOf(cur) + d : 0; i = Math.max(0, Math.min(bl.length - 1, i));
    springe(bl[i].dataset.anker, Z.aktivPane, false, true);
  }
  function oeffneZiel(el, neuePane) {
    const typ = el.dataset.ziel, id = el.dataset.id, da = typ === "norm" ? LA.normen[id] : LA.entscheide[id];
    if (!da) return melde("Nicht im Prototyp-Bestand", (el.dataset.roh || el.textContent) + " · in der Plattform: Sprung an die Stelle");
    let anker = el.dataset.anker || (el.dataset.e ? "e-" + el.dataset.e : el.dataset.abs !== undefined ? "abs-" + el.dataset.abs : null);
    if (typ === "entscheid" && el.dataset.e && !da.erw.some((x) => x.nr === el.dataset.e)) { melde("Diese Erwägung ist im Prototyp nicht geladen", da.zitat.de + " E. " + el.dataset.e); anker = null; }
    if (Z.doppel && (Z.ansicht === "norm" || Z.ansicht === "entscheid")) {
      /* In der geteilten Ansicht bleibt die linke Hälfte stehen; das Ziel öffnet in der Hälfte seines Typs. */
      if (typ === "norm") Z.norm = id; else Z.entscheid = id;
      const zielPane = (Z.ansicht === typ) ? 0 : 1, pEl = $('.pane[data-pane="' + zielPane + '"]');
      pEl.innerHTML = typ === "norm" ? dokNorm(zielPane) : dokEntscheid(zielPane); pEl.scrollTop = 0; setzePane(zielPane);
      if (anker) springe(anker, zielPane, true); aktualisiereStand(); return;
    }
    geh(typ, { id, anker, ziel: true, doppel: neuePane ? true : Z.doppel });
  }

  /* ---------- 8 Ereignisse ---------- */
  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-go],[data-ziel],[data-anker],[data-act],[data-eingabe],[data-kopie],[data-wortlaut],[data-ablage],[data-spr],[data-epoche],[data-regspr],[data-zitspr],[data-sort],[data-oeffne],[data-stelle],[data-mappe],[data-entferne],[data-fmt],[data-kanton],[data-pal]");
    const pane = ev.target.closest(".pane"); if (pane) setzePane(+pane.dataset.pane);
    if (ev.target.id === "schleier") return schliesse();
    if (!el) { const b = ev.target.closest(".block[data-anker]"); if (b && !getSelection().toString()) setzeCursor(b); return; }
    const d = el.dataset;
    if (el.tagName === "A") ev.preventDefault();
    if (d.pal !== undefined) { const f = palListe[+d.pal]; schliesse(); return f && f[1](); }
    if (d.go) return geh(d.go);
    if (d.ziel) return oeffneZiel(el, ev.altKey);
    if (d.anker && el.closest(".rail, .ziffer")) return springe(d.anker, pane ? +pane.dataset.pane : 0, !!el.closest(".ziffer"));
    if (d.eingabe) { $("#q").value = d.eingabe; return fuehreAus(d.eingabe); }
    if (d.wortlaut) { const x = { typ: "entscheid", id: d.id, e: d.wortlaut }; return kopiere("«" + auszug(x).replace(/\s+/g, " ").trim() + "» (" + zitEintrag(x) + ")"); }
    if (d.kopie) return kopiere(zitEintrag({ typ: d.kopie, id: d.id, e: d.e, abs: d.abs }));
    if (d.ablage) return ablegen({ typ: d.ablage, id: d.id, e: d.e, abs: d.abs });
    if (d.spr) { const i = Z.sprachen.indexOf(d.spr); if (i >= 0 && Z.sprachen.length > 1) Z.sprachen.splice(i, 1); else if (i < 0) Z.sprachen = ["de", "fr", "it"].filter((s) => s === d.spr || Z.sprachen.includes(s)); return geh("norm", { halten: true }); }
    if (d.epoche) { const e = LA.zeitachse[+d.epoche]; Z.stichtag = e.bis === "9999-12-31" ? heute : e.bis; return geh("norm", { halten: true }); }
    if (d.regspr) { Z.regSpr = d.regspr; return geh("entscheid", { halten: true }); }
    if (d.zitspr) { Z.zitSpr = d.zitspr; if (Z.ansicht === "mappen") return geh("mappen", { halten: true }); $("#stand").dataset.sig = ""; return aktualisiereStand(); }
    if (d.sort) { Z.sort = d.sort; return geh("treffer", { halten: true }); }
    if (d.oeffne && !ev.target.closest(".ref")) return geh("entscheid", { id: d.oeffne, anker: d.pin ? "e-" + d.pin : null, ziel: !!d.pin });
    if (d.stelle) { const p = d.stelle.split(","); return zeigeStelle(+p[0], +p[1]); }
    if (d.mappe) { Z.mappe = +d.mappe; return geh("mappen", { halten: true }); }
    if (d.entferne) { Z.mappen[Z.mappe].eintraege.splice(+d.entferne, 1); sichereMappen(); return geh("mappen", { halten: true }); }
    if (d.fmt) { Z.exportFmt = d.fmt; return geh("mappen", { halten: true }); }
    if (d.kanton) { Z.facetten = { kt: [d.kanton] }; Z.q = ""; return geh("treffer"); }
    if (d.act === "palette") return palette(false);
    if (d.act === "thema") return thema();
    if (d.act === "doppel") return doppel();
    if (d.act === "zu") return schliesse();
    if (d.act === "zitseite") { Z.zitSeite = !Z.zitSeite; $("#stand").dataset.sig = ""; return aktualisiereStand(); }
    if (d.act === "kopiere-stand") { const f = standFund(); return f && kopiere(f.text); }
    if (d.act === "ablage-stand") { const f = standFund(); return f && ablegen({ typ: f.typ, id: f.id, e: f.e || undefined, abs: f.abs === null ? undefined : f.abs }); }
    if (d.act === "kopiere-export") return kopiere($("#export").value);
  });
  document.addEventListener("change", (ev) => {
    const el = ev.target;
    if (el.dataset.fac) { const k = el.dataset.fac; Z.facetten[k] = $$('input[data-fac="' + k + '"]:checked').map((x) => x.value); Z.cursor = 0; geh("treffer", { halten: true }); }
    if (el.id === "stichtag" && el.value) { Z.stichtag = el.value; geh("norm", { halten: true }); }
  });
  document.addEventListener("input", (ev) => {
    const el = ev.target;
    if (el.id === "q") $("#deutung").innerHTML = el.value ? deutungText(deute(el.value)) : "";
    if (el.id === "q2") $("#deutung2").innerHTML = deutungText(deute(el.value));
    if (el.id === "pal") { palSel = 0; fuellePalette(el.value); }
    if (el.dataset.notiz !== undefined) { Z.mappen[Z.mappe].eintraege[+el.dataset.notiz].notiz = el.value; sichereMappen(); }
  });
  document.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (ev.target.id === "feld") { fuehreAus($("#q").value); $("#q").blur(); }
    if (ev.target.id === "grossfeld") fuehreAus($("#q2").value);
    if (ev.target.id === "neu-mappe") { const n = $("#mname").value.trim(); if (n) { Z.mappen.push({ id: "m" + Date.now(), name: n, eintraege: [] }); Z.mappe = Z.mappen.length - 1; sichereMappen(); geh("mappen", { halten: true }); } }
  });
  document.addEventListener("keydown", (ev) => {
    const tippt = /^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName);
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "k") { ev.preventDefault(); return palette(false); }
    if (ev.key === "Escape") { if (!$("#schleier").hidden) return schliesse(); if (tippt) ev.target.blur(); return; }
    if (ev.target.id === "pal") {
      if (ev.key === "ArrowDown" || ev.key === "ArrowUp") { ev.preventDefault(); palSel = (palSel + (ev.key === "ArrowDown" ? 1 : palListe.length - 1)) % palListe.length; fuellePalette(ev.target.value); const li = $('[data-pal="' + palSel + '"]'); if (li) li.scrollIntoView({ block: "nearest" }); }
      if (ev.key === "Enter") { ev.preventDefault(); const f = palListe[palSel]; schliesse(); if (f) f[1](); }
      return;
    }
    if (tippt || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    const k = ev.key;
    if (k === "/") { ev.preventDefault(); const f = (Z.ansicht === "start" && $("#q2")) || $("#q"); f.focus(); f.select(); }
    else if (k === "j") bewege(1); else if (k === "k") bewege(-1);
    else if (k === "Enter" && Z.ansicht === "treffer" && ev.target.tagName !== "BUTTON" && ev.target.tagName !== "A") { const z = $$(".tr")[Z.cursor]; if (z && z.dataset.oeffne) geh("entscheid", { id: z.dataset.oeffne, anker: z.dataset.pin ? "e-" + z.dataset.pin : null, ziel: !!z.dataset.pin }); else if (z) melde("Volltext im Prototyp nicht geladen"); }
    else if (k === "c") { const f = standFund(); if (f) kopiere(f.text); }
    else if (k === "m") { const f = standFund(); if (f) ablegen({ typ: f.typ, id: f.id, e: f.e || undefined, abs: f.abs === null ? undefined : f.abs }); }
    else if (k === "s") doppel(); else if (k === "t") thema(); else if (k === "?") palette(true);
    else if (k === "Tab" && Z.doppel && (Z.ansicht === "norm" || Z.ansicht === "entscheid") && ev.target.id === "haupt") { ev.preventDefault(); setzePane(Z.aktivPane ? 0 : 1); aktualisiereStand(); }
  });
  let warte = false;
  window.addEventListener("scroll", () => { if (warte) return; warte = true; requestAnimationFrame(() => { warte = false; if (!Z.doppel) { $$(".block.cursor").forEach((b) => { const r = b.getBoundingClientRect(); if (r.bottom < 100 || r.top > innerHeight) b.classList.remove("cursor"); }); } aktualisiereStand(); }); }, { passive: true });

  function messeKopf() { document.documentElement.style.setProperty("--kopf-h", $(".kopf").offsetHeight + "px"); }
  window.addEventListener("resize", messeKopf); messeKopf(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(messeKopf);
  const start = (location.hash || "").slice(1);
  geh(["start", "treffer", "norm", "entscheid", "frage", "recherche", "mappen"].includes(start) ? start : "start");
})();
