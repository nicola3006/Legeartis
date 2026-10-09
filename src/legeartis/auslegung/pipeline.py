"""Ablauf der Auslegung.

Stufen (nach dem Gremiumsmodus des Skills, als getrennte Modellaufrufe):
0 Frage und Lesarten, 1 drei Gutachter parallel, Gate, 2 teleologischer
Gutachter mit den Befunden der anderen, Gate, 4 Abwägung, 5 Kritik,
6 Schluss, dann Freigabe. Stufe 3 (Verifikation) ist durch die Gates abgedeckt.
"""

from __future__ import annotations

import asyncio
import datetime as dt
import json
from dataclasses import dataclass, field
from typing import Literal

from ..sources.models import Dossier
from ..sources.registry import Sources
from . import methodik
from .dossier import build_dossier
from .gate import Freigabe, Gestrichen, filtere_berichte, pruefe_text
from .llm import LLM
from .render import render_markdown
from .schema import Abwaegung, Auslegungsfrage, ElementBericht, Ergebnis, Kritik, Lesart

Modus = Literal["lernen", "praxis"]


@dataclass
class Lauf:
    norm_label: str
    frage: Auslegungsfrage
    dossier: Dossier
    berichte: list[ElementBericht]
    gestrichen: list[Gestrichen]
    abwaegung: Abwaegung
    kritik: Kritik
    ergebnis: Ergebnis
    text: str = ""
    freigabe: Freigabe | None = None
    hinweise: list[str] = field(default_factory=list)
    modus: Modus = "lernen"
    modell: str = "unbekannt"
    datum: str = ""


def _normtext_block(d: Dossier) -> str:
    parts = [f"Norm: {d.norm.label} (SR {d.norm.sr_number})"]
    for lang, f in d.norm.fassungen.items():
        head = f" [{f.heading}]" if f.heading else ""
        parts.append(f"[{lang}] {f.title}{head}, Stand {f.consolidation_date}:\n{f.text}")
    return "\n\n".join(parts)


def _dossier_block(d: Dossier) -> str:
    out = [_normtext_block(d)]
    if d.fassungen:
        fs = ", ".join(f"{f.valid_from} bis {f.valid_to or 'heute'} ({f.status})" for f in d.fassungen)
        out.append(f"Fassungen des Erlasses (Fedlex): {fs}")
    if d.materialien:
        out.append("Materialien (wörtlicher Botschaftstext):")
        for m in d.materialien:
            out.append(f"- {m.beleg_id} [Qualität: {m.qualitaet}] {m.bbl_citation}, S. {m.page}:\n{m.text[:1500]}")
    if d.leitentscheide:
        out.append("Leitentscheide (Regeste; Zitierstring vom Server):")
        for e in d.leitentscheide:
            z = e.zitat.citation_string_de if e.zitat else e.label
            out.append(f"- {e.beleg_id}: {z} ({e.date}), Zitierungen: {e.citation_count}\n  Regeste: {e.regeste}")
            for erw in e.erwaegungen:
                out.append(f"  - {erw.beleg_id}: {erw.citation_string_de}\n{erw.text}")
    if d.kommentare:
        out.append("Lehre:")
        for k in d.kommentare:
            txt = k.volltext or k.snippet or ""
            out.append(f"- {k.beleg_id} [{k.art}] {k.title}, {', '.join(k.authors)} ({k.date}) {k.url}\n{txt[:1500]}")
    out.append("Verfügbare Belege (nur diese IDs sind zulässig):")
    for bid, desc in d.beleg_index().items():
        out.append(f"- {bid}: {desc}")
    if d.warnungen:
        out.append("Warnungen des Dossiers:\n- " + "\n- ".join(d.warnungen))
    return "\n\n".join(out)


def _frage_block(f: Auslegungsfrage) -> str:
    les = "\n".join(f"- {l.kennung}: {l.text}" for l in f.lesarten)
    return (
        f"Auslegungsfrage: {f.frage}\nLesarten:\n{les}\n"
        f"Terminologie: DE {f.terminologie_de} / FR {f.terminologie_fr} / IT {f.terminologie_it}"
    )


class Auslegung:
    def __init__(self, sources: Sources, llm: LLM, *, grounding: bool = True, modus: Modus = "lernen"):
        self.sources = sources
        self.llm = llm
        self.grounding = grounding
        self.modus: Modus = modus

    async def frage_formulieren(self, dossier: Dossier, frage: str | None, lesarten: list[str] | None) -> Auslegungsfrage:
        if frage and lesarten and len(lesarten) >= 2:
            return Auslegungsfrage(
                frage=frage,
                lesarten=[Lesart(kennung=f"Lesart {i + 1}", text=t) for i, t in enumerate(lesarten)],
                terminologie_de="", terminologie_fr="", terminologie_it="",
            )
        system = (
            "Du bereitest eine Gesetzesauslegung vor. Formuliere die Auslegungsfrage abstrakt, "
            "ohne Sachverhalt und ohne Parteien, und nenne zwei bis drei Lesarten neutral in je "
            "einem Satz. Die Reihenfolge sagt nichts über die Vorzugswürdigkeit. Gib eine "
            "Terminologiezeile DE/FR/IT mit den Suchbegriffen. Verrät die Frage, wem welche Lesart "
            "nützt, formuliere sie neu."
        )
        user = (_normtext_block(dossier) + "\n\n" + (f"Frage der Anwenderin: {frage}\n" if frage else "")
                + (("Vorgeschlagene Lesarten: " + "; ".join(lesarten)) if lesarten else "Keine Lesarten vorgegeben."))
        return await self.llm.structured(system, user, Auslegungsfrage)

    async def gutachter(self, element: str, frage: Auslegungsfrage, dossier: Dossier, befunde_anderer: str | None = None) -> ElementBericht:
        system = methodik.GRUNDREGELN + "\n" + methodik.ELEMENTE[element]
        user = _frage_block(frage) + "\n\n" + _dossier_block(dossier)
        if befunde_anderer:
            user += "\n\nBefunde der anderen Gutachter (nur Tatsachen, ohne deren Wertung):\n" + befunde_anderer
        user += f"\n\nErstatte den Bericht für das Element «{element}»."
        bericht = await self.llm.structured(system, user, ElementBericht)
        if bericht.element != element:
            bericht = bericht.model_copy(update={"element": element})
        return bericht

    async def abwaegen(self, frage: Auslegungsfrage, berichte: list[ElementBericht]) -> Abwaegung:
        system = (
            "Du bist der Abwäger einer Gesetzesauslegung. Du kennst keinen Sachverhalt. "
            "Du erhältst vier bereinigte Berichte und wendest die Gewichtungsregeln an; "
            "jedes Gewicht ist mit der einschlägigen Regel zu begründen.\n\n" + methodik.GEWICHTUNGSREGELN
        )
        user = _frage_block(frage) + "\n\nBerichte:\n" + json.dumps([b.model_dump() for b in berichte], ensure_ascii=False, indent=1)
        return await self.llm.structured(system, user, Abwaegung)

    async def kritisieren(self, frage: Auslegungsfrage, berichte: list[ElementBericht], abw: Abwaegung) -> Kritik:
        system = methodik.KRITIKFRAGEN + "\n" + methodik.GEWICHTUNGSREGELN
        user = (_frage_block(frage) + "\n\nAbwägung:\n" + json.dumps(abw.model_dump(), ensure_ascii=False, indent=1)
                + "\n\nBerichte:\n" + json.dumps([b.model_dump() for b in berichte], ensure_ascii=False, indent=1))
        return await self.llm.structured(system, user, Kritik)

    async def schluss(self, frage: Auslegungsfrage, dossier: Dossier, berichte: list[ElementBericht], abw: Abwaegung, kritik: Kritik) -> Ergebnis:
        regeln = methodik.SCHLUSSREGELN if self.modus == "lernen" else methodik.SCHLUSSREGELN_PRAXIS
        system = methodik.GRUNDREGELN + "\n" + regeln
        user = (_frage_block(frage) + "\n\n" + _dossier_block(dossier)
                + "\n\nAbwägung:\n" + json.dumps(abw.model_dump(), ensure_ascii=False, indent=1)
                + "\n\nKritik:\n" + json.dumps(kritik.model_dump(), ensure_ascii=False, indent=1)
                + "\n\nBerichte:\n" + json.dumps([b.model_dump() for b in berichte], ensure_ascii=False, indent=1))
        return await self.llm.structured(system, user, Ergebnis)

    async def run(self, abbreviation: str, article: str, *, frage: str | None = None,
                  lesarten: list[str] | None = None, dossier: Dossier | None = None) -> Lauf:
        dossier = dossier or await build_dossier(self.sources, abbreviation, article)
        af = await self.frage_formulieren(dossier, frage, lesarten)

        drei = await asyncio.gather(*(self.gutachter(e, af, dossier) for e in ("grammatikalisch", "historisch", "systematisch")))
        drei, gestrichen = filtere_berichte(list(drei), dossier)
        befunde = "\n".join(f"[{b.element}] {bf.nr}. {bf.aussage} ({', '.join(bf.beleg_ids)})" for b in drei for bf in b.befunde)
        tele = await self.gutachter("teleologisch", af, dossier, befunde_anderer=befunde or "keine")
        tele_list, g2 = filtere_berichte([tele], dossier)
        berichte = drei + tele_list
        gestrichen += g2

        abw = await self.abwaegen(af, berichte)
        kritik = await self.kritisieren(af, berichte, abw)
        ergebnis = await self.schluss(af, dossier, berichte, abw, kritik)

        bekannt = set(dossier.beleg_index())
        hinweise = []
        fremd = [x for x in ergebnis.verwendete_beleg_ids if x not in bekannt]
        if fremd:
            hinweise.append(f"Schluss nennt unbekannte Beleg-IDs, ignoriert: {', '.join(fremd)}")
            ergebnis = ergebnis.model_copy(update={"verwendete_beleg_ids": [x for x in ergebnis.verwendete_beleg_ids if x in bekannt]})
        if all(b.richtung == drei[0].richtung and not b.gegenbefund.strip() for b in berichte):
            hinweise.append("Alle Gutachter weisen ohne Gegenbefund in dieselbe Richtung: gemeinsamer blinder Fleck möglich.")

        lauf = Lauf(dossier.norm.label, af, dossier, berichte, gestrichen, abw, kritik, ergebnis, hinweise=hinweise, modus=self.modus,
                    modell=getattr(self.llm, "model", "unbekannt"), datum=dt.datetime.now(tz=dt.UTC).astimezone().strftime("%d.%m.%Y"))
        lauf.text = render_markdown(lauf)
        lauf.freigabe = await pruefe_text(lauf.text, dossier, self.sources.opencaselaw, grounding=self.grounding)
        lauf.text = render_markdown(lauf)
        return lauf
