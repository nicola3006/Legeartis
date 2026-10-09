"""Adapter für den Opencaselaw-MCP-Server (mcp.opencaselaw.ch).

Jede Methode entspricht einem Werkzeug des Servers und liefert ein typisiertes
Objekt. Markdown-Antworten (find_leading_cases, get_commentary) werden geparst,
aber nie als Zitat verwendet: Zitierstrings kommen ausschliesslich aus `cite`
und `get_erwaegung`.
"""

from __future__ import annotations

import re
from typing import Any

from .models import (
    Erwaegung,
    Kommentarstelle,
    Leitentscheid,
    Materialienstelle,
    Sprachfassung,
    Zitat,
)
from .protocol import SourceError, ToolCaller

_LEADING_LINE = re.compile(
    r"\*\*(?P<rank>\d+)\.\*\*\s+\[(?P<label>[^\]]+)\]\((?P<url>[^)]+)\)"
    r"(?:\s+\((?P<date>\d{4}-\d{2}-\d{2})\))?(?:\s+\[(?P<court>[^\]]+)\])?"
    r"(?:\s+—\s+\*\*(?P<cites>\d+)\s+citations?)?"
)


class Opencaselaw:
    def __init__(self, caller: ToolCaller):
        self.caller = caller

    async def get_law(
        self, abbreviation: str, article: str, language: str = "de", as_of: str | None = None
    ) -> tuple[str, Sprachfassung]:
        """Normtext einer Fassung. Gibt (SR-Nummer, Sprachfassung) zurück."""
        args: dict[str, Any] = {"abbreviation": abbreviation, "article": article, "language": language}
        if as_of:
            args["as_of"] = as_of
        data = await self.caller.call("get_law", args)
        if not isinstance(data, dict) or not data.get("articles"):
            raise SourceError(f"get_law {abbreviation} {article} ({language}): kein Artikeltext")
        art = data["articles"][0]
        if data.get("text_status") in {"heading_only", "empty"}:
            raise SourceError(
                f"get_law {abbreviation} {article}: Fedlex-Edition ohne Artikeltext ({data.get('text_status')})"
            )
        fassung = Sprachfassung(
            sprache=language,  # type: ignore[arg-type]
            text=art.get("text", ""),
            abbreviation=data.get("abbreviation") or abbreviation,
            title=data.get("title", ""),
            consolidation_date=data.get("consolidation_date") or data.get("snapshot_date"),
            source_url=data.get("source_url"),
            source_label=data.get("source_label"),
            heading=art.get("heading"),
        )
        return str(data.get("sr_number", "")), fassung

    async def find_leading_cases(self, law_code: str, article: str, limit: int = 5) -> list[Leitentscheid]:
        data = await self.caller.call(
            "find_leading_cases", {"law_code": law_code, "article": article, "limit": limit}
        )
        if isinstance(data, dict) and "results" in data:
            return [self._leading_from_dict(r) for r in data["results"]]
        if not isinstance(data, str):
            raise SourceError("find_leading_cases: unbekanntes Antwortformat")
        return self._parse_leading_markdown(data)

    @staticmethod
    def _leading_from_dict(r: dict[str, Any]) -> Leitentscheid:
        return Leitentscheid(
            decision_id=r.get("decision_id", ""),
            label=r.get("citation_string_de") or r.get("label") or r.get("decision_id", ""),
            url=r.get("canonical_url"),
            date=r.get("date") or r.get("decision_date"),
            court=r.get("court"),
            regeste=r.get("regeste"),
            citation_count=r.get("citation_count"),
        )

    @staticmethod
    def _parse_leading_markdown(text: str) -> list[Leitentscheid]:
        cases: list[Leitentscheid] = []
        current: Leitentscheid | None = None
        for line in text.splitlines():
            m = _LEADING_LINE.search(line)
            if m:
                url = m.group("url")
                decision_id = url.rstrip("/").split("/")[-1]
                current = Leitentscheid(
                    decision_id=decision_id,
                    label=m.group("label").strip(),
                    url=url,
                    date=m.group("date"),
                    court=m.group("court"),
                    citation_count=int(m.group("cites")) if m.group("cites") else None,
                    regeste="",
                )
                cases.append(current)
                continue
            if current is not None and line.strip():
                regeste_line = line.strip()
                if regeste_line.startswith("Regeste:"):
                    regeste_line = regeste_line[len("Regeste:") :].strip()
                if regeste_line == "Regeste":
                    continue
                current.regeste = (current.regeste + " " + regeste_line).strip() if current.regeste else regeste_line
        return cases

    async def cite(self, reference: str, pinpoint: str | None = None) -> Zitat:
        args: dict[str, Any] = {"reference": reference}
        if pinpoint:
            args["pinpoint"] = pinpoint
        data = await self.caller.call("cite", args)
        if not isinstance(data, dict):
            raise SourceError("cite: unbekanntes Antwortformat")
        return Zitat(
            decision_id=data.get("decision_id") or data.get("canonical_decision_id") or reference,
            exists=bool(data.get("exists")),
            citation_string_de=data.get("citation_string_de"),
            citation_string_fr=data.get("citation_string_fr"),
            citation_string_it=data.get("citation_string_it"),
            canonical_url=data.get("canonical_url"),
            decision_date=data.get("decision_date"),
            pinpoint=data.get("pinpoint"),
            pinpoint_valid=data.get("pinpoint_valid"),
            rule_statement=data.get("rule_statement"),
        )

    async def get_erwaegung(self, decision_id: str, e_number: str) -> Erwaegung:
        data = await self.caller.call("get_erwaegung", {"decision_id": decision_id, "e_number": e_number})
        if not isinstance(data, dict) or "text" not in data:
            raise SourceError(f"get_erwaegung {decision_id} E. {e_number}: kein Text")
        return Erwaegung(
            decision_id=data.get("decision_id", decision_id),
            e_number=data.get("e_number", e_number),
            text=data["text"],
            citation_string_de=data.get("citation_string_de"),
            citation_string_fr=data.get("citation_string_fr"),
            citation_string_it=data.get("citation_string_it"),
            canonical_url=data.get("canonical_url"),
            regeste=data.get("regeste"),
            composed_of=list(data.get("composed_of") or []),
        )

    async def get_article_purpose(
        self, sr_number: str, article: str, max_paragraphs: int = 3
    ) -> tuple[list[Materialienstelle], str | None]:
        """Botschaftstext zum Artikel. Gibt (Stellen, Hinweis des Servers) zurück.

        Wichtig: Ohne direkte Artikel-Botschaft-Verknüpfung liefert der Server
        blosse Volltexttreffer (relation == 'fts5_match'). Diese Stellen gelten
        als «volltexttreffer» und dürfen nur mit Prüfung verwendet werden.
        """
        data = await self.caller.call(
            "get_article_purpose",
            {"sr_number": sr_number, "article": article, "max_paragraphs": max_paragraphs},
        )
        if not isinstance(data, dict):
            raise SourceError("get_article_purpose: unbekanntes Antwortformat")
        hint = data.get("_hint")
        stellen: list[Materialienstelle] = []
        for src in data.get("sources", []):
            relation = src.get("relation")
            qualitaet = "volltexttreffer" if (relation == "fts5_match" or hint) else "verknuepft"
            for p in src.get("paragraphs", []):
                stellen.append(
                    Materialienstelle(
                        bbl_citation=src.get("bbl_citation", "?"),
                        eli_uri=src.get("eli_uri"),
                        page=p.get("page"),
                        text=p.get("text", ""),
                        relation=relation,
                        qualitaet=qualitaet,
                    )
                )
        return stellen, hint

    async def get_commentary(self, abbreviation: str, article: str) -> Kommentarstelle | None:
        data = await self.caller.call("get_commentary", {"abbreviation": abbreviation, "article": article})
        if isinstance(data, dict):
            if data.get("found") is False or data.get("no_commentary"):
                return None
            return Kommentarstelle(
                id=str(data.get("id") or f"{abbreviation}-{article}"),
                title=data.get("title") or f"Kommentar zu Art. {article} {abbreviation}",
                authors=list(data.get("authors") or []),
                url=data.get("url"),
                volltext=data.get("text") or data.get("content"),
                quelle="opencaselaw",
            )
        if isinstance(data, str) and data.lstrip().startswith("# No open-access commentary"):
            return None
        return None

    async def attest_response(self, draft_text: str, audit_grounding: bool = False) -> dict[str, Any]:
        data = await self.caller.call(
            "attest_response", {"draft_text": draft_text, "audit_grounding": audit_grounding}
        )
        if not isinstance(data, dict):
            raise SourceError("attest_response: unbekanntes Antwortformat")
        return data
