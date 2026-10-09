"""Typisierte Quellenobjekte mit Beleg-IDs.

Jedes Objekt, das in einer Antwort als Beleg dienen kann, hat eine stabile
`beleg_id`. Das Sprachmodell darf später ausschliesslich diese IDs nennen;
`auslegung/gate.py` streicht jeden Befund, dessen ID nicht im Dossier liegt.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

Sprache = Literal["de", "fr", "it"]


class Sprachfassung(BaseModel):
    sprache: Sprache
    text: str
    abbreviation: str
    title: str
    consolidation_date: str | None = None
    source_url: str | None = None
    source_label: str | None = None
    heading: str | None = None

    @property
    def beleg_id(self) -> str:
        return f"norm:{self.abbreviation}:{self.sprache}"


class NormText(BaseModel):
    sr_number: str
    abbreviation: str
    article: str
    fassungen: dict[str, Sprachfassung] = Field(default_factory=dict)
    section_heading: str | None = None

    @property
    def label(self) -> str:
        return f"Art. {self.article} {self.abbreviation}"

    def beleg_ids(self) -> list[str]:
        return [f"norm:{self.sr_number}:{self.article}:{s}" for s in self.fassungen]


class Fassung(BaseModel):
    """Eine Fassung des Erlasses mit Geltungsdauer (aus Fedlex)."""

    valid_from: str
    valid_to: str | None
    status: str
    source_url: str | None = None


class Zitat(BaseModel):
    """Von `cite` gelieferter Zitierstring. Nie selbst konstruieren."""

    decision_id: str
    exists: bool
    citation_string_de: str | None = None
    citation_string_fr: str | None = None
    citation_string_it: str | None = None
    canonical_url: str | None = None
    decision_date: str | None = None
    pinpoint: str | None = None
    pinpoint_valid: bool | None = None
    rule_statement: str | None = None


class Erwaegung(BaseModel):
    decision_id: str
    e_number: str
    text: str
    citation_string_de: str | None = None
    citation_string_fr: str | None = None
    citation_string_it: str | None = None
    canonical_url: str | None = None
    regeste: str | None = None
    composed_of: list[str] = Field(default_factory=list)

    @property
    def beleg_id(self) -> str:
        return f"erw:{self.decision_id}:E.{self.e_number}"


class Leitentscheid(BaseModel):
    decision_id: str
    label: str
    url: str | None = None
    date: str | None = None
    court: str | None = None
    regeste: str | None = None
    citation_count: int | None = None
    zitat: Zitat | None = None
    erwaegungen: list[Erwaegung] = Field(default_factory=list)

    @property
    def beleg_id(self) -> str:
        return f"entscheid:{self.decision_id}"

    @property
    def regeste_pinpoints(self) -> list[str]:
        """Erwägungsnummern, die die Regeste nennt («(E. 2)»)."""
        import re

        if not self.regeste:
            return []
        found = re.findall(r"\(E\.\s*([0-9]+(?:\.[0-9]+)*[a-z]?)", self.regeste)
        seen: list[str] = []
        for f in found:
            if f not in seen:
                seen.append(f)
        return seen


class Materialienstelle(BaseModel):
    """Wörtlicher Botschaftstext. `qualitaet` sagt, wie die Stelle gefunden wurde."""

    bbl_citation: str
    eli_uri: str | None = None
    page: int | None = None
    text: str
    relation: str | None = None
    qualitaet: Literal["verknuepft", "volltexttreffer"]

    @property
    def beleg_id(self) -> str:
        return f"bbl:{self.bbl_citation}:S.{self.page}"


class Kommentarstelle(BaseModel):
    id: str
    title: str
    authors: list[str] = Field(default_factory=list)
    url: str | None = None
    date: str | None = None
    legislative_act: str | None = None
    snippet: str | None = None
    volltext: str | None = None
    quelle: str = "onlinekommentar"
    art: str = "kommentierung"  # "kommentierung" (zum Artikel selbst) oder "erwaehnung"

    @property
    def beleg_id(self) -> str:
        return f"komm:{self.quelle}:{self.id}"


class Dossier(BaseModel):
    """Alles, was die Auslegung an Quellen bekommt. Nichts anderes."""

    norm: NormText
    fassungen: list[Fassung] = Field(default_factory=list)
    materialien: list[Materialienstelle] = Field(default_factory=list)
    leitentscheide: list[Leitentscheid] = Field(default_factory=list)
    kommentare: list[Kommentarstelle] = Field(default_factory=list)
    warnungen: list[str] = Field(default_factory=list)

    def beleg_index(self) -> dict[str, str]:
        """Beleg-ID → kurze Beschreibung. Grundlage des lokalen Zitat-Gates."""
        index: dict[str, str] = {}
        for sprache, f in self.norm.fassungen.items():
            index[f"norm:{self.norm.sr_number}:{self.norm.article}:{sprache}"] = (
                f"{self.norm.label} ({sprache}), Stand {f.consolidation_date or '?'}"
            )
        for m in self.materialien:
            index[m.beleg_id] = f"{m.bbl_citation}, S. {m.page} [{m.qualitaet}]"
        for e in self.leitentscheide:
            index[e.beleg_id] = (e.zitat.citation_string_de if e.zitat else None) or e.label
            for erw in e.erwaegungen:
                index[erw.beleg_id] = erw.citation_string_de or f"{e.label}, E. {erw.e_number}"
        for k in self.kommentare:
            index[k.beleg_id] = f"{k.title} ({', '.join(k.authors)})"
        return index

    def zitierstrings(self) -> set[str]:
        out: set[str] = set()
        for e in self.leitentscheide:
            if e.zitat:
                out.update(
                    s for s in (e.zitat.citation_string_de, e.zitat.citation_string_fr, e.zitat.citation_string_it) if s
                )
            for erw in e.erwaegungen:
                out.update(
                    s for s in (erw.citation_string_de, erw.citation_string_fr, erw.citation_string_it) if s
                )
        return out
