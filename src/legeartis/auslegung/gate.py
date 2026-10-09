"""Freigabe-Gates.

Zwei Linien gegen erfundene Fundstellen:
1. Beleg-ID-Gate: Jeder Befund muss ausschliesslich IDs aus dem Dossier tragen.
2. Zitat-Gate: Jeder Zitierstring im Ausgabetext muss aus dem Dossier stammen,
   danach prüft `attest_response` des Opencaselaw-Servers den ganzen Text.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any, Protocol

from ..sources.opencaselaw import Opencaselaw
from ..sources.protocol import SourceError
from .schema import Befund, ElementBericht


class Belegquelle(Protocol):
    """Dossier (Auslegung) oder Fallakte (Rechtsfrage): beide kennen ihre Belege."""

    def beleg_index(self) -> dict[str, str]: ...  # pragma: no cover
    def zitierstrings(self) -> set[str]: ...  # pragma: no cover


_CASE_PATTERNS = [
    re.compile(r"\b(?:BGE|ATF|DTF)\s+\d{1,3}\s+[IVX]+[a-z]?\s+\d{1,4}(?:,\s*(?:E\.|consid\.)\s*[\d.a-z/]+)?"),
    re.compile(r"\b\d[A-Z]_\d{1,5}/\d{4}\b"),
]


@dataclass
class Gestrichen:
    element: str
    befund: Befund
    grund: str


def filtere_berichte(
    berichte: list[ElementBericht], dossier: Belegquelle
) -> tuple[list[ElementBericht], list[Gestrichen]]:
    """Streicht Befunde ohne gültigen Beleg. Gibt bereinigte Berichte und die Streichliste zurück."""
    bekannt = set(dossier.beleg_index())
    gestrichen: list[Gestrichen] = []
    out: list[ElementBericht] = []
    for b in berichte:
        behalten: list[Befund] = []
        for bf in b.befunde:
            if not bf.beleg_ids:
                gestrichen.append(Gestrichen(b.element, bf, "kein Beleg"))
                continue
            unbekannt = [x for x in bf.beleg_ids if x not in bekannt]
            if unbekannt:
                gestrichen.append(Gestrichen(b.element, bf, f"unbekannte Beleg-ID {', '.join(unbekannt)}"))
                continue
            behalten.append(bf)
        out.append(b.model_copy(update={"befunde": behalten}))
    return out, gestrichen


def fremde_zitate(text: str, dossier: Belegquelle) -> list[str]:
    """Zitierstrings im Text, die nicht aus dem Dossier stammen."""
    erlaubt = dossier.zitierstrings()
    stems = {s.split(",")[0].strip() for s in erlaubt}
    fremd: list[str] = []
    for pat in _CASE_PATTERNS:
        for m in pat.finditer(text):
            z = " ".join(m.group(0).split()).rstrip(".")
            if z in erlaubt or z.split(",")[0].strip() in stems:
                continue
            if z not in fremd:
                fremd.append(z)
    return fremd


@dataclass
class Freigabe:
    status: str  # "freigegeben" | "nicht_freigegeben" | "nicht_geprueft"
    fremde_zitate: list[str] = field(default_factory=list)
    attest_ok: bool | None = None
    issues: list[dict[str, Any]] = field(default_factory=list)
    linked_text: str | None = None
    ledger: dict[str, Any] | None = None
    hinweis: str | None = None


async def pruefe_text(
    text: str, dossier: Belegquelle, oc: Opencaselaw | None, *, grounding: bool = True
) -> Freigabe:
    fremd = fremde_zitate(text, dossier)
    if oc is None:
        return Freigabe(
            status="nicht_freigegeben" if fremd else "nicht_geprueft",
            fremde_zitate=fremd,
            hinweis="attest_response nicht verfügbar",
        )
    try:
        data = await oc.attest_response(text, audit_grounding=grounding)
    except SourceError as exc:
        return Freigabe(
            status="nicht_freigegeben" if fremd else "nicht_geprueft",
            fremde_zitate=fremd,
            hinweis=f"attest_response fehlgeschlagen: {exc}",
        )
    ok = bool(data.get("ok")) and not fremd
    return Freigabe(
        status="freigegeben" if ok else "nicht_freigegeben",
        fremde_zitate=fremd,
        attest_ok=bool(data.get("ok")),
        issues=list(data.get("issues") or []),
        linked_text=data.get("linked_text"),
        ledger=data.get("ledger"),
    )
