"""Adapter für den Fedlex-MCP-Server.

Rolle im Tool: zweite, unabhängige Quelle für den Normtext und die einzige
Quelle für die Liste der Fassungen mit Geltungsdauer. Der Text selbst trägt
laut Server keine geprüfte Geltungsdauer; für datumsabhängige Fragen zählt
`get_legislation_versions`.
"""

from __future__ import annotations

from typing import Any

from .models import Fassung, Sprachfassung
from .protocol import SourceError, ToolCaller


class Fedlex:
    def __init__(self, caller: ToolCaller):
        self.caller = caller

    @staticmethod
    def article_id(sr_number: str, article: str) -> str:
        return f"ch-fedlex--{sr_number}--{article}"

    async def get_article(self, sr_number: str, article: str, language: str = "de") -> Sprachfassung:
        data = await self.caller.call(
            "get_article",
            {"id": self.article_id(sr_number, article), "preferences": {"language": language}},
        )
        if not isinstance(data, dict):
            raise SourceError("fedlex.get_article: unbekanntes Antwortformat")
        art = data.get("article") or data.get("result") or data
        law = art.get("law") or {}
        text = art.get("content") or art.get("text") or ""
        if not text:
            raise SourceError(f"fedlex.get_article {sr_number}/{article}: kein Text")
        return Sprachfassung(
            sprache=(art.get("language") or language),  # type: ignore[arg-type]
            text=text,
            abbreviation=law.get("titleShort") or "",
            title=law.get("title") or "",
            consolidation_date=law.get("date"),
            source_url=art.get("url"),
            source_label="Fedlex (MCP)",
            heading=art.get("title"),
        )

    async def get_versions(self, sr_number: str, language: str = "de") -> list[Fassung]:
        data = await self.caller.call(
            "get_legislation_versions",
            {"legislationId": f"ch-fedlex--{sr_number}", "language": language},
        )
        if not isinstance(data, dict):
            raise SourceError("fedlex.get_legislation_versions: unbekanntes Antwortformat")
        out: list[Fassung] = []
        for v in data.get("versions", []):
            urls: dict[str, Any] = v.get("sourceUrls") or {}
            out.append(
                Fassung(
                    valid_from=v.get("validFrom", "?"),
                    valid_to=v.get("validTo"),
                    status=v.get("status", "?"),
                    source_url=urls.get(language) or next(iter(urls.values()), None),
                )
            )
        return out
