"""Markdown-Ausgabe eines Falls."""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .pipeline import Fall

_SICHERHEIT = {"gesichert": "gesichert", "vertretbar": "vertretbar", "offen": "offen"}


def render_markdown(fall: Fall) -> str:
    a = fall.antwort
    index = fall.akte.beleg_index()
    L: list[str] = []
    L.append(f"# {fall.plan.rechtsfrage_abstrakt}")
    L.append("")
    fg = fall.freigabe
    if fg is None:
        L.append("> Freigabe: noch nicht geprüft")
    elif fg.status == "freigegeben":
        L.append("> Freigabe: alle Fundstellen geprüft (lokales Gate und attest_response)")
    elif fg.status == "nicht_geprueft":
        L.append(f"> Freigabe: NICHT GEPRÜFT ({fg.hinweis}). Fundstellen vor Verwendung selbst prüfen.")
    else:
        L.append("> Freigabe: NICHT FREIGEGEBEN. Beanstandete Stellen unter «Prüfung».")
    L.append("> Prüfumfang: geprüft sind die eigenen Fundstellen, Zitate und Normverweise dieses Textes. "
             "Nicht geprüft ist, ob einschlägige Quellen fehlen.")
    L.append("")
    L.append("## Kurzantwort")
    L.append(a.kurzantwort)
    L.append("")
    L.append(f"**Sicherheit: {_SICHERHEIT[a.sicherheit]}.** {a.sicherheit_begruendung}")
    L.append("")
    L.append("## Prüfung")
    for i, s in enumerate(a.pruefung, 1):
        L.append(f"### {i}. {s.titel}")
        L.append(s.obersatz)
        if s.beleg_ids:
            L.append("Belege: " + "; ".join(index.get(b, b) for b in s.beleg_ids))
        L.append("")
        L.append(s.subsumtion)
        L.append("")
        L.append(f"Ergebnis: {s.ergebnis}")
        L.append("")
    L.append("## Gesamtergebnis")
    L.append(a.gesamtergebnis)
    L.append("")
    if a.auslegungsbedarf:
        L.append("## Auslegungsbedarf")
        L.append("Die Antwort hängt an der Reichweite dieser Normen. Vertiefte Auslegung nach den vier Elementen:")
        for ab in a.auslegungsbedarf:
            L.append(f"- {ab.norm}: {ab.auslegungsfrage} ({ab.grund})")
            from .akte import parse_reference
            parsed = parse_reference(ab.norm)
            if parsed:
                L.append(f'  `legeartis auslegen {parsed[0]} {parsed[1]} --frage "{ab.auslegungsfrage}"`')
        L.append("")
    if a.offene_recherche:
        L.append("## Offene Recherche")
        for o in a.offene_recherche:
            L.append(f"- {o}")
        L.append("")
    L.append("## Normen im Wortlaut")
    for n in fall.akte.normen:
        f = n.fassungen.get("de")
        if f:
            L.append(f"**{n.label}** (Stand {f.consolidation_date}): {f.text.replace(chr(10), ' ')}")
    L.append("")
    L.append("## Fundstellen")
    verwendet = set(a.verwendete_beleg_ids) | {b for s in a.pruefung for b in s.beleg_ids}
    for bid, desc in index.items():
        L.append(f"- {desc} [{'verwendet' if bid in verwendet else 'in der Fallakte, nicht verwendet'}]")
    if fall.auswahl.verworfene_treffer:
        L.append("")
        L.append("Verworfene Treffer: " + "; ".join(fall.auswahl.verworfene_treffer))
    if fall.gestrichen:
        L.append("")
        L.append("Gestrichene Belege (ohne Grundlage in der Fallakte): " + "; ".join(fall.gestrichen))
    L.append("")
    L.append("## Prüfung der Fundstellen")
    if fg is not None:
        if fg.fremde_zitate:
            L.append("Zitate ohne Grundlage in der Fallakte: " + ", ".join(fg.fremde_zitate))
        for issue in fg.issues:
            L.append(f"- attest_response [{issue.get('category')}]: {issue.get('citation') or issue.get('problem')} - {issue.get('suggestion', '')}")
        if fg.attest_ok is not None and not fg.issues and not fg.fremde_zitate:
            L.append("attest_response: keine Beanstandung.")
    if fall.akte.warnungen:
        L.append("")
        L.append("Warnungen:")
        for w in fall.akte.warnungen:
            L.append(f"- {w}")
    L.append("")
    L.append(f"Suchanfragen: Normen {fall.plan.suchbegriffe_normen}; Entscheide {fall.plan.suchbegriffe_entscheide} (Gericht: {fall.plan.gericht}). Modell: {fall.modell}.")
    return "\n".join(L)
