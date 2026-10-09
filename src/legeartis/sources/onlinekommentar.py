"""Adapter für den Onlinekommentar-MCP-Server (onlinekommentar.ch, CC BY 4.0)."""

from __future__ import annotations

from .models import Kommentarstelle
from .protocol import SourceError, ToolCaller


class Onlinekommentar:
    def __init__(self, caller: ToolCaller):
        self.caller = caller

    async def search(self, query: str, language: str = "de", limit: int = 10) -> list[Kommentarstelle]:
        data = await self.caller.call("search_commentaries", {"search": query, "language": language})
        if not isinstance(data, dict):
            raise SourceError("search_commentaries: unbekanntes Antwortformat")
        out: list[Kommentarstelle] = []
        for r in data.get("results", [])[:limit]:
            act = r.get("legislative_act") or {}
            out.append(
                Kommentarstelle(
                    id=r["id"],
                    title=r.get("title", ""),
                    authors=[a.get("name", "") for a in r.get("authors", [])],
                    url=r.get("url"),
                    date=r.get("date"),
                    legislative_act=act.get("title"),
                    snippet=r.get("snippet"),
                )
            )
        return out

    async def get(self, commentary_id: str) -> Kommentarstelle:
        data = await self.caller.call("get_commentary", {"id": commentary_id})
        if not isinstance(data, dict):
            raise SourceError("get_commentary: unbekanntes Antwortformat")
        act = data.get("legislative_act") or {}
        return Kommentarstelle(
            id=data.get("id", commentary_id),
            title=data.get("title", ""),
            authors=[a.get("name", "") for a in data.get("authors", [])],
            url=data.get("url"),
            date=data.get("date"),
            legislative_act=act.get("title"),
            volltext=data.get("content") or data.get("text"),
        )
