"""Markdown-Ausgabe eines Auslegungslaufs."""

from __future__ import annotations

from typing import TYPE_CHECKING

from . import methodik

if TYPE_CHECKING:
    from .pipeline import Lauf

_EINSTUFUNG = {
    "ueberzeugend": "überzeugend",
    "vertretbar_aber_offen": "vertretbar, aber offen",
    "offen": "offen",
}
_SCHRITT = {
    "auslegung_extensiv": "extensive Auslegung",
    "auslegung_restriktiv": "restriktive Auslegung",
    "auslegung_im_rahmen_des_wortlauts": "Auslegung im Rahmen des Wortlauts",
    "analogie": "Analogie (Lückenfüllung)",
    "teleologische_reduktion": "teleologische Reduktion (Lückenfüllung)",
    "regel_modo_legislatoris": "Regel modo legislatoris",
    "offen": "offen",
}


def render_markdown(lauf: Lauf) -> str:
    d = lauf.dossier
    index = d.beleg_index()
    L: list[str] = []
    L.append(f"# Auslegung von {lauf.norm_label}")
    L.append("")
    fg = lauf.freigabe
    if fg is None:
        L.append("> Freigabe: noch nicht geprüft")
    elif fg.status == "freigegeben":
        L.append("> Freigabe: alle Fundstellen geprüft (lokales Gate und attest_response)")
    elif fg.status == "nicht_geprueft":
        L.append(f"> Freigabe: NICHT GEPRÜFT ({fg.hinweis}). Fundstellen vor Verwendung selbst prüfen.")
    else:
        L.append("> Freigabe: NICHT FREIGEGEBEN. Beanstandete Stellen unten unter «Prüfung».")
    L.append(
        "> Prüfumfang: geprüft sind die eigenen Fundstellen, Zitate und Normverweise dieses Textes. "
        "Nicht geprüft ist, ob einschlägige Quellen fehlen."
    )
    L.append("")
    L.append("## 1. Auslegungsfrage und Lesarten")
    L.append(lauf.frage.frage)
    for les in lauf.frage.lesarten:
        L.append(f"- {les.kennung}: {les.text}")
    L.append("")
    L.append("## 2. Normtext")
    for lang, f in d.norm.fassungen.items():
        L.append(f"**{lang}** ({f.title}, Stand {f.consolidation_date}): {f.text.replace(chr(10), ' ')}")
    L.append("")
    L.append("## 3. Elemente")
    L.append("| Element | Richtung | Stärke | Grund |")
    L.append("|---|---|---|---|")
    for g in lauf.abwaegung.tabelle:
        L.append(f"| {g.element} | {g.richtung} | {g.staerke} | {g.grund} |")
    L.append("")
    for b in lauf.berichte:
        L.append(f"### {b.element}")
        for bf in b.befunde:
            belege = "; ".join(index.get(x, x) for x in bf.beleg_ids)
            L.append(f"{bf.nr}. {bf.aussage} ({belege})")
        if b.gegenbefund.strip():
            L.append(f"Gegenbefund: {b.gegenbefund}")
        if b.fehlt:
            L.append("Fehlt: " + "; ".join(b.fehlt))
        L.append("")
    e = lauf.ergebnis
    L.append("## 4. Ergebnis")
    L.append(f"**Einstufung: {_EINSTUFUNG[e.einstufung]}.** Schritt: {_SCHRITT[lauf.abwaegung.schritt]}.")
    L.append("")
    L.append(e.kernaussage)
    L.append("")
    L.append(e.begruendung)
    if lauf.abwaegung.nicht_luecken_pruefung:
        L.append("")
        L.append("Lückenprüfung: " + lauf.abwaegung.nicht_luecken_pruefung)
    L.append("")
    L.append("## 5. Kritik")
    L.append(("Kipptest bestanden. " if lauf.kritik.kipptest_bestanden else "Kipptest nicht bestanden. ") + lauf.kritik.kipptest_begruendung)
    for b in lauf.kritik.beanstandungen:
        L.append(f"- {b}")
    if lauf.kritik.uebersehene_lesart:
        L.append(f"- Übersehene Lesart: {lauf.kritik.uebersehene_lesart}")
    if lauf.kritik.uebergangener_nicht_luecken_fall:
        L.append(f"- Übergangener Nicht-Lücken-Fall: {lauf.kritik.uebergangener_nicht_luecken_fall}")
    L.append("")
    L.append("Was daraus wurde: " + e.was_die_kritik_einwandte)
    L.append("")
    L.append("Was das Ergebnis kippen würde: " + e.was_kippen_wuerde)
    L.append("")
    L.append("## 6. Abgleich mit der Rechtsprechung im Dossier")
    L.append(e.abgleich_mit_rechtsprechung)
    L.append("")
    if lauf.modus == "lernen":
        L.append("## 7. In einfachen Worten")
        L.append(e.einfache_erklaerung)
        if e.fachbegriffe:
            L.append("")
            for fb in e.fachbegriffe:
                L.append(f"- **{fb.begriff}**: {fb.erklaerung}")
    else:
        L.append("## 7. Praktische Konsequenz")
        L.append(e.einfache_erklaerung)
    L.append("")
    L.append("## 8. Fundstellen")
    verwendet = set(e.verwendete_beleg_ids) | {x for b in lauf.berichte for bf in b.befunde for x in bf.beleg_ids}
    for bid, desc in index.items():
        mark = "verwendet" if bid in verwendet else "im Dossier, nicht verwendet"
        L.append(f"- {desc} [{mark}]")
    if lauf.gestrichen:
        L.append("")
        L.append("Gestrichene Befunde (ohne gültigen Beleg):")
        for g in lauf.gestrichen:
            L.append(f"- [{g.element}] {g.befund.aussage} ({g.grund})")
    L.append("")
    L.append("## 9. Prüfung")
    if fg is not None:
        if fg.fremde_zitate:
            L.append("Zitate ohne Grundlage im Dossier: " + ", ".join(fg.fremde_zitate))
        for issue in fg.issues:
            L.append(f"- attest_response [{issue.get('category')}]: {issue.get('citation') or issue.get('problem')} - {issue.get('suggestion', '')}")
        if fg.attest_ok is not None and not fg.issues and not fg.fremde_zitate:
            L.append("attest_response: keine Beanstandung.")
    if lauf.hinweise:
        L.append("")
        L.append("Hinweise: " + " ".join(lauf.hinweise))
    if d.warnungen:
        L.append("")
        L.append("Warnungen des Dossiers:")
        for w in d.warnungen:
            L.append(f"- {w}")
    if lauf.modus == "lernen":
        L.append("")
        L.append("## 10. KI-Vermerk für die Arbeit")
        L.append(methodik.ki_vermerk(lauf.frage.frage, lauf.modell, lauf.datum))
    return "\n".join(L)
