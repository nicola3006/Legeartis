"""Gemeinsame Schnittstelle aller Quellen.

`ToolCaller` ist bewusst minimal: ein Name, Argumente, ein Ergebnis. So lassen
sich echte MCP-Server, aufgezeichnete Fixtures und künftige REST-Adapter
(z.B. Fedlex SPARQL direkt) austauschen, ohne die Adapter anzufassen.
"""

from __future__ import annotations

import json
from typing import Any, Protocol, runtime_checkable


class SourceError(RuntimeError):
    """Ein Werkzeugaufruf ist fehlgeschlagen oder lieferte ein unbrauchbares Format."""


@runtime_checkable
class ToolCaller(Protocol):
    async def call(self, tool: str, arguments: dict[str, Any]) -> Any:  # pragma: no cover
        """Ruft ein Werkzeug auf und gibt das dekodierte Ergebnis zurück.

        Rückgabe: dict/list bei JSON-Antworten, sonst der rohe Text (str).
        """
        ...


def decode_tool_text(text: str) -> Any:
    """MCP-Server liefern teils JSON, teils Markdown. Beides wird akzeptiert."""
    stripped = text.strip()
    if stripped[:1] in "{[":
        try:
            return json.loads(stripped)
        except json.JSONDecodeError:
            pass
    return text
