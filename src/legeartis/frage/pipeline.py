"""Frage-Ablauf: Plan, Suche, Auswahl, Fallakte, Antwort, Freigabe. Drei Modellaufrufe."""

from __future__ import annotations

from dataclasses import dataclass, field

from ..auslegung import methodik
from ..auslegung.gate import Freigabe, fremde_zitate, pruefe_text
from ..auslegung.llm import LLM
from ..sources.models import Entscheidtreffer, Normtreffer
from ..sources.protocol import SourceError
from ..sources.registry import Sources
from .akte import Fallakte, build_fallakte
from .render import render_markdown
from .schema import Antwort, Normauswahl, Rechercheplan

PLAN_REGELN = """\
Du planst die Recherche zu einer Schweizer Rechtsfrage. Du beantwortest sie noch nicht.
- Formuliere die Rechtsfrage abstrakt, ohne Parteien.
- Nenne 1 bis 3 Suchanfragen für die Normensuche (Volltext über alle Bundes- und Kantonsgesetze;
  Operatoren AND/OR in Grossbuchstaben, Phrasen in Anführungszeichen).
- Nenne 1 bis 3 Suchanfragen für die Entscheidsuche: 3 bis 8 präzise Begriffe je Anfrage, eine
  Anfrage je Rechtsfrage, Normzitate in Anführungszeichen ("Art. 333 Abs. 3 OR").
- Wähle das Gericht: bge für publizierte Leitentscheide (Normalfall), bger für alle
  Bundesgerichtsurteile, alle wenn kantonale Praxis zählt. Setze kanton, wenn kantonales Recht
  berührt ist.
- Skizziere die Prüfpunkte (Anspruchsgrundlage, Voraussetzungen, Einwendungen, Rechtsfolge).
Schweizer Rechtschreibung.
"""

AUSWAHL_REGELN = """\
Du wählst aus Suchtreffern die einschlägigen Normen und Entscheide aus. Du beantwortest die Frage
noch nicht.
- Prüfpunkte mit je 1 bis 3 Normreferenzen genau in der Schreibweise der Treffer ('Art. 333 OR');
  die erste Referenz eines Prüfpunkts ist die Hauptnorm. Speziellere Norm vor allgemeiner.
- Verwirf Treffer, die nur das Stichwort teilen (mit Grund). Fehlt eine offensichtlich nötige Norm
  in den Treffern, nenne sie trotzdem; sie wird im Wortlaut nachgeholt.
- relevante_entscheide: nur decision_ids aus den Treffern, deren Regeste die Sachfrage trifft.
Schweizer Rechtschreibung.
"""

ANTWORT_REGELN = """\
Du beantwortest eine Schweizer Rechtsfrage im Gutachtenstil für Juristinnen und Juristen.
- Obersatz je Prüfschritt mit Beleg-IDs aus der Fallakte; Normzitate im Text. Subsumtion ohne
  Belege. Ergebnis in einem Satz.
- Jede Aussage über Rechtsprechung nur mit Beleg-ID (entscheid:..., erw:...). Andere IDs,
  selbst konstruierte Zitate oder Wissen aus dem Gedächtnis sind nicht zulässig. Was du nicht
  belegen kannst, gehört unter offene_recherche.
- Wörtliche Zitate nur aus dem Text der Fallakte (Normtext, Erwägung), sonst paraphrasieren.
- sicherheit: gesichert (Wortlaut klar und Leitentscheid im Dossier), vertretbar (gute Gründe,
  aber Gegenargumente oder dünne Quellenlage), offen (keine belastbare Antwort).
- auslegungsbedarf: Normen, bei denen die Antwort von einer umstrittenen oder unklaren
  Reichweite abhängt (Wortlaut gegen Zweck, Analogie, Reduktion, divergierende Praxis). Dort ist
  die vertiefte Auslegung nach den vier Elementen angezeigt. Nicht aufführen, was klar ist.
- Kurzantwort zuerst und direkt. Fehlender Sachverhalt: Annahmen benennen.
- Schweizer Rechtschreibung (ss statt ß).
"""


@dataclass
class Fall:
    rechtsfrage: str
    sachverhalt: str | None
    plan: Rechercheplan
    auswahl: Normauswahl
    akte: Fallakte
    antwort: Antwort
    gestrichen: list[str] = field(default_factory=list)
    text: str = ""
    freigabe: Freigabe | None = None
    modell: str = "unbekannt"


def _treffer_block(normen: list[Normtreffer], entscheide: list[Entscheidtreffer]) -> str:
    out = ["Normtreffer:"]
    for n in normen:
        out.append(f"- {n.reference} [{n.level}{'/' + n.canton if n.canton and n.canton != 'CH' else ''}] {n.heading or ''}: {(n.snippet or '')[:300]}")
    out.append("\nEntscheidtreffer (Relevanz absteigend):")
    for e in entscheide:
        out.append(f"- {e.decision_id} ({e.citation_string_de}, {e.decision_date}, Zitierungen {e.citation_count}): {(e.regeste or '')[:400]}")
    return "\n".join(out)


def _akte_block(a: Fallakte) -> str:
    out = []
    for n in a.normen:
        for lang, f in n.fassungen.items():
            out.append(f"{n.label} (SR {n.sr_number}, {lang}, Stand {f.consolidation_date}):\n{f.text}")
    if a.entscheide:
        out.append("Rechtsprechung:")
        for e in a.entscheide:
            z = e.zitat.citation_string_de if e.zitat else e.label
            out.append(f"- {e.beleg_id}: {z} ({e.date})\n  Regeste: {e.regeste}")
            for erw in e.erwaegungen:
                out.append(f"  - {erw.beleg_id}: {erw.citation_string_de}\n{erw.text}")
    out.append("Verfügbare Belege (nur diese IDs sind zulässig):")
    for bid, desc in a.beleg_index().items():
        out.append(f"- {bid}: {desc}")
    if a.warnungen:
        out.append("Warnungen der Fallakte:\n- " + "\n- ".join(a.warnungen))
    return "\n\n".join(out)


class Rechtsfrage:
    def __init__(self, sources: Sources, llm: LLM, *, grounding: bool = True):
        self.sources = sources
        self.llm = llm
        self.grounding = grounding

    async def run(self, frage: str, sachverhalt: str | None = None, *, kanton: str | None = None) -> Fall:
        oc = self.sources.opencaselaw
        user = f"Rechtsfrage: {frage}\n" + (f"Sachverhalt: {sachverhalt}\n" if sachverhalt else "Kein Sachverhalt angegeben.\n")
        if kanton:
            user += f"Kanton laut Anwenderin: {kanton}\n"
        plan = await self.llm.structured(methodik.GRUNDREGELN.split("\n\n")[0] + "\n" + PLAN_REGELN, user, Rechercheplan)

        normtreffer: list[Normtreffer] = []
        seen_refs: set[str] = set()
        warn: list[str] = list(self.sources.hinweise)
        for q in plan.suchbegriffe_normen[:3]:
            try:
                for t in await oc.search_laws(q, jurisdiction=plan.jurisdiktion, canton=plan.kanton or kanton, limit=8):
                    if t.reference not in seen_refs:
                        seen_refs.add(t.reference)
                        normtreffer.append(t)
            except SourceError as exc:
                warn.append(f"Normensuche «{q}»: {exc}")
        entscheidtreffer: list[Entscheidtreffer] = []
        seen_ids: set[str] = set()
        for q in plan.suchbegriffe_entscheide[:3]:
            try:
                court = None if plan.gericht == "alle" else plan.gericht
                for t in await oc.search_decisions(q, court=court, limit=8, canton=plan.kanton or kanton):
                    if t.decision_id not in seen_ids:
                        seen_ids.add(t.decision_id)
                        entscheidtreffer.append(t)
            except SourceError as exc:
                warn.append(f"Entscheidsuche «{q}»: {exc}")
        entscheidtreffer.sort(key=lambda t: -(t.relevance_score or 0))

        auswahl = await self.llm.structured(
            AUSWAHL_REGELN,
            f"Rechtsfrage: {plan.rechtsfrage_abstrakt}\nPrüfpunkte (vorläufig): {'; '.join(plan.vorlaeufige_pruefpunkte)}\n\n"
            + _treffer_block(normtreffer, entscheidtreffer),
            Normauswahl,
        )
        normrefs = [r for p in auswahl.pruefpunkte for r in p.normen]
        akte = await build_fallakte(
            self.sources, plan.rechtsfrage_abstrakt, sachverhalt, normrefs, entscheidtreffer,
            auswahl.relevante_entscheide, normtreffer=normtreffer,
        )
        akte.warnungen = warn + akte.warnungen

        antwort = await self.llm.structured(
            methodik.GRUNDREGELN.split("\n\n")[0] + "\n" + ANTWORT_REGELN,
            f"Rechtsfrage: {frage}\nAbstrakt: {plan.rechtsfrage_abstrakt}\n"
            + (f"Sachverhalt: {sachverhalt}\n" if sachverhalt else "")
            + "Prüfpunkte: " + "; ".join(f"{p.titel} ({', '.join(p.normen)})" for p in auswahl.pruefpunkte)
            + "\n\n" + _akte_block(akte),
            Antwort,
        )

        # Gate 1: Beleg-IDs
        bekannt = set(akte.beleg_index())
        gestrichen: list[str] = []
        schritte = []
        for s in antwort.pruefung:
            fremd = [b for b in s.beleg_ids if b not in bekannt]
            if fremd:
                gestrichen.extend(f"{s.titel}: {b}" for b in fremd)
            schritte.append(s.model_copy(update={"beleg_ids": [b for b in s.beleg_ids if b in bekannt]}))
        antwort = antwort.model_copy(update={
            "pruefung": schritte,
            "verwendete_beleg_ids": [b for b in antwort.verwendete_beleg_ids if b in bekannt],
        })
        fall = Fall(frage, sachverhalt, plan, auswahl, akte, antwort, gestrichen=gestrichen,
                    modell=getattr(self.llm, "model", "unbekannt"))
        # Gate 2: Zitate im Text, dann attest_response
        fall.text = render_markdown(fall)
        fall.freigabe = await pruefe_text(fall.text, akte, oc, grounding=self.grounding)
        if gestrichen and fall.freigabe.status != "nicht_freigegeben":
            fall.freigabe.status = "nicht_freigegeben"
            fall.freigabe.hinweis = "Belege ohne Grundlage in der Fallakte gestrichen"
        fall.text = render_markdown(fall)
        return fall


__all__ = ["Fall", "Rechtsfrage", "fremde_zitate"]
