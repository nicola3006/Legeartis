"""Fallakte: die Quellen zu einer Rechtsfrage, mit Beleg-IDs wie das Dossier."""

from __future__ import annotations

import re

from pydantic import BaseModel, Field

from ..sources.models import Entscheidtreffer, Leitentscheid, NormText, Normtreffer
from ..sources.protocol import SourceError
from ..sources.registry import Sources

_REF = re.compile(r"^(?:Art\.|§)\s*(?P<art>\d+[a-z]*(?:bis|ter|quater)?)\s+(?:Abs\.\s*\S+\s+)?(?P<abk>[A-ZÄÖÜ][\wÄÖÜäöü/.-]*)$")


def parse_reference(ref: str) -> tuple[str, str] | None:
    """'Art. 333 Abs. 3 OR' → ('OR', '333'); None, wenn nicht parsebar."""
    m = _REF.match(" ".join(ref.strip().split()))
    if not m:
        return None
    return m.group("abk"), m.group("art")


class Fallakte(BaseModel):
    rechtsfrage: str
    sachverhalt: str | None = None
    normen: list[NormText] = Field(default_factory=list)
    entscheide: list[Leitentscheid] = Field(default_factory=list)
    normtreffer: list[Normtreffer] = Field(default_factory=list)
    entscheidtreffer: list[Entscheidtreffer] = Field(default_factory=list)
    warnungen: list[str] = Field(default_factory=list)

    def beleg_index(self) -> dict[str, str]:
        index: dict[str, str] = {}
        for n in self.normen:
            for sprache, f in n.fassungen.items():
                index[f"norm:{n.sr_number}:{n.article}:{sprache}"] = f"{n.label} ({sprache}), Stand {f.consolidation_date or '?'}"
        for e in self.entscheide:
            index[e.beleg_id] = (e.zitat.citation_string_de if e.zitat else None) or e.label
            for erw in e.erwaegungen:
                index[erw.beleg_id] = erw.citation_string_de or f"{e.label}, E. {erw.e_number}"
        return index

    def zitierstrings(self) -> set[str]:
        out: set[str] = set()
        for e in self.entscheide:
            if e.zitat:
                out.update(s for s in (e.zitat.citation_string_de, e.zitat.citation_string_fr, e.zitat.citation_string_it) if s)
            for erw in e.erwaegungen:
                out.update(s for s in (erw.citation_string_de, erw.citation_string_fr, erw.citation_string_it) if s)
        return out


async def build_fallakte(
    sources: Sources,
    rechtsfrage: str,
    sachverhalt: str | None,
    normreferenzen: list[str],
    entscheidtreffer: list[Entscheidtreffer],
    relevante_ids: list[str],
    *,
    normtreffer: list[Normtreffer] | None = None,
    max_entscheide: int = 6,
    max_erwaegungen: int = 2,
    leitentscheide_hauptnorm: int = 3,
) -> Fallakte:
    oc = sources.opencaselaw
    akte = Fallakte(rechtsfrage=rechtsfrage, sachverhalt=sachverhalt, normtreffer=normtreffer or [], entscheidtreffer=entscheidtreffer)
    warn = akte.warnungen

    # Normen im Wortlaut
    seen: set[tuple[str, str]] = set()
    for ref in normreferenzen:
        parsed = parse_reference(ref)
        if not parsed:
            warn.append(f"Normreferenz nicht lesbar, übersprungen: {ref}")
            continue
        abk, art = parsed
        if (abk, art) in seen:
            continue
        seen.add((abk, art))
        try:
            sr, f = await oc.get_law(abk, art, language="de")
            akte.normen.append(NormText(sr_number=sr, abbreviation=f.abbreviation, article=art, fassungen={"de": f}))
        except SourceError as exc:
            warn.append(f"Normtext {ref}: {exc}")

    # Entscheide zur Sachfrage: nur die als relevant ausgewählten, in Suchreihenfolge
    by_id = {t.decision_id: t for t in entscheidtreffer}
    gewaehlt = [by_id[i] for i in relevante_ids if i in by_id][:max_entscheide]
    unbekannt = [i for i in relevante_ids if i not in by_id]
    if unbekannt:
        warn.append(f"Als relevant genannte Entscheide ohne Treffer, ignoriert: {', '.join(unbekannt)}")
    entscheide: dict[str, Leitentscheid] = {t.decision_id: t.als_leitentscheid() for t in gewaehlt}

    # Leitentscheide zur Hauptnorm, über cite aufgelöst
    if akte.normen:
        haupt = akte.normen[0]
        try:
            for case in await oc.find_leading_cases(haupt.abbreviation, haupt.article, limit=leitentscheide_hauptnorm):
                try:
                    zitat = await oc.cite(case.label)
                except SourceError as exc:
                    warn.append(f"cite {case.label}: {exc}")
                    continue
                if not zitat.exists:
                    warn.append(f"Leitentscheid {case.label} nicht auflösbar; gestrichen.")
                    continue
                case.zitat = zitat
                case.decision_id = zitat.decision_id
                if case.decision_id in entscheide:
                    if not entscheide[case.decision_id].regeste:
                        entscheide[case.decision_id].regeste = case.regeste
                else:
                    entscheide[case.decision_id] = case
        except SourceError as exc:
            warn.append(f"Leitentscheide {haupt.label}: {exc}")

    # Erwägungen im Wortlaut für die bestplatzierten Treffer mit Pinpoint
    fetched = 0
    for t in gewaehlt:
        if fetched >= max_erwaegungen:
            break
        if not t.pinpoint_e_number or t.pinpoint_confidence not in ("high", "medium"):
            continue
        try:
            entscheide[t.decision_id].erwaegungen.append(await oc.get_erwaegung(t.decision_id, t.pinpoint_e_number))
            fetched += 1
        except SourceError as exc:
            warn.append(f"Erwägung {t.citation_string_de or t.decision_id} E. {t.pinpoint_e_number}: {exc}")
    akte.entscheide = list(entscheide.values())
    if not akte.normen:
        warn.append("Keine Norm im Wortlaut geholt; die Antwort kann sich nur auf Rechtsprechung stützen.")
    return akte
