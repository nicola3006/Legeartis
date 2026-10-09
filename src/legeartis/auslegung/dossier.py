"""Baut das Quellen-Dossier zu einer Norm. Deterministisch, ohne Sprachmodell.

Reihenfolge wie im Arbeitsablauf des Skills: Normtext (drei Sprachen),
Fassungen, Materialien, Rechtsprechung, Lehre. Jeder Ausfall einer Quelle wird
als Warnung festgehalten, nicht verschwiegen.
"""

from __future__ import annotations

import re

from ..sources.models import Dossier, Kommentarstelle, NormText
from ..sources.protocol import SourceError
from ..sources.registry import Sources


def _normalize(text: str) -> str:
    lines = []
    for line in text.splitlines():
        line = re.sub(r"^\s*\d+[.)]?\s*", "", line)
        lines.append(" ".join(line.split()))
    return "\n".join(l for l in lines if l).strip()


def _kommentar_art(k: Kommentarstelle, abbreviation: str, article: str) -> str:
    title = " ".join(k.title.split()).lower()
    wanted = f"art. {article} {abbreviation}".lower()
    return "kommentierung" if title == wanted else "erwaehnung"


async def build_dossier(
    sources: Sources,
    abbreviation: str,
    article: str,
    *,
    languages: tuple[str, ...] = ("de", "fr", "it"),
    max_leading: int = 5,
    max_erwaegungen: int = 2,
    max_erwaehnungen: int = 3,
) -> Dossier:
    oc = sources.opencaselaw
    warn: list[str] = list(sources.hinweise)

    # 1. Normtext in drei Sprachen
    fassungen = {}
    sr_number = ""
    abk = abbreviation
    for lang in languages:
        try:
            sr, f = await oc.get_law(abbreviation, article, language=lang)
            fassungen[lang] = f
            if lang == "de":
                sr_number, abk = sr, f.abbreviation
            sr_number = sr_number or sr
        except SourceError as exc:
            warn.append(f"Normtext {lang}: {exc}")
    if "de" not in fassungen:
        raise SourceError(f"Kein deutscher Normtext für Art. {article} {abbreviation}")
    norm = NormText(sr_number=sr_number, abbreviation=abk, article=article, fassungen=fassungen)
    dossier = Dossier(norm=norm, warnungen=warn)

    # 2. Fedlex als Zweitquelle und Fassungsliste
    if sources.fedlex:
        try:
            fx = await sources.fedlex.get_article(sr_number, article, "de")
            if _normalize(fx.text) != _normalize(fassungen["de"].text):
                warn.append(
                    "Normtext weicht zwischen Opencaselaw-Spiegel und Fedlex-MCP ab; "
                    "beide Fassungen prüfen, bevor zitiert wird."
                )
            if fx.heading and not fassungen["de"].heading:
                fassungen["de"].heading = fx.heading
        except SourceError as exc:
            warn.append(f"Fedlex-Artikel: {exc}")
        try:
            dossier.fassungen = await sources.fedlex.get_versions(sr_number, "de")
        except SourceError as exc:
            warn.append(f"Fedlex-Fassungen: {exc}")

    # 3. Materialien
    try:
        stellen, hint = await oc.get_article_purpose(sr_number, article)
        dossier.materialien = stellen
        if hint:
            warn.append(
                "Botschaft: keine direkte Verknüpfung Artikel-Botschaft; die Stellen sind "
                "Volltexttreffer und als «volltexttreffer» markiert."
            )
        if not stellen:
            warn.append("Botschaft: keine Stellen im Korpus (historisches Element wohl unergiebig).")
    except SourceError as exc:
        warn.append(f"Botschaft: {exc}")

    # 4. Rechtsprechung: Leitentscheide, je Entscheid cite, dann Erwägungen
    try:
        cases = await oc.find_leading_cases(abk, article, limit=max_leading)
    except SourceError as exc:
        cases = []
        warn.append(f"Leitentscheide: {exc}")
    kept = []
    for case in cases:
        try:
            zitat = await oc.cite(case.label)
        except SourceError as exc:
            warn.append(f"cite {case.label}: {exc}")
            continue
        if not zitat.exists:
            warn.append(f"Leitentscheid {case.label} liess sich nicht auflösen; gestrichen.")
            continue
        case.zitat = zitat
        case.decision_id = zitat.decision_id or case.decision_id
        case.date = case.date or zitat.decision_date
        kept.append(case)
    fetched = 0
    for case in kept:
        if fetched >= max_erwaegungen:
            break
        pins = case.regeste_pinpoints
        if not pins:
            continue
        try:
            case.erwaegungen.append(await oc.get_erwaegung(case.decision_id, pins[0]))
            fetched += 1
        except SourceError as exc:
            warn.append(f"Erwägung {case.label} E. {pins[0]}: {exc}")
    if kept and fetched == 0:
        warn.append("Keine Erwägung im Wortlaut geholt (Regesten nennen keine Erwägungsnummer).")
    dossier.leitentscheide = kept

    # 5. Lehre
    try:
        komm = await oc.get_commentary(abk, article)
        if komm:
            komm.art = "kommentierung"
            dossier.kommentare.append(komm)
    except SourceError as exc:
        warn.append(f"Kommentar (Opencaselaw): {exc}")
    if sources.onlinekommentar:
        try:
            hits = await sources.onlinekommentar.search(f"Art. {article} {abk}", "de")
            erwaehnungen = 0
            for k in hits:
                k.art = _kommentar_art(k, abk, article)
                if k.art == "kommentierung":
                    if not any(x.id == k.id for x in dossier.kommentare):
                        dossier.kommentare.append(k)
                elif erwaehnungen < max_erwaehnungen:
                    dossier.kommentare.append(k)
                    erwaehnungen += 1
        except SourceError as exc:
            warn.append(f"Onlinekommentar: {exc}")
    if not any(k.art == "kommentierung" for k in dossier.kommentare):
        warn.append(
            "Keine Open-Access-Kommentierung des Artikels gefunden; Lehre im Dossier besteht "
            "nur aus Erwähnungen in Kommentaren zu anderen Artikeln."
        )
    dossier.warnungen = warn
    return dossier
