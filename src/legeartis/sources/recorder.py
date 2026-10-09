"""Aufzeichnen und Abspielen von Werkzeugantworten.

Zweck: Tests ohne Netz, reproduzierbare Entwicklung und ein Audit-Trail, aus
dem sich jede Fundstelle einer Antwort auf den rohen Server-Output zurückführen
lässt. Der Index liegt in `index.json`, jede Antwort in einer eigenen Datei.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from .protocol import SourceError, ToolCaller, decode_tool_text


def _key(tool: str, arguments: dict[str, Any]) -> str:
    canonical = json.dumps({"tool": tool, "args": arguments}, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:16]


class ReplayCaller:
    """Spielt aufgezeichnete Antworten ab. Unbekannte Aufrufe lösen einen Fehler aus."""

    def __init__(self, directory: Path):
        self.directory = Path(directory)
        index_path = self.directory / "index.json"
        if not index_path.exists():
            raise SourceError(f"Kein Fixture-Index unter {index_path}")
        self.index: list[dict[str, Any]] = json.loads(index_path.read_text("utf-8"))
        self.calls: list[tuple[str, dict[str, Any]]] = []

    def _find(self, tool: str, arguments: dict[str, Any]) -> dict[str, Any] | None:
        for entry in self.index:
            if entry["tool"] != tool:
                continue
            expected = entry.get("args", {})
            if all(arguments.get(k) == v for k, v in expected.items()) and all(
                k in expected for k in arguments
            ):
                return entry
        return None

    async def call(self, tool: str, arguments: dict[str, Any]) -> Any:
        self.calls.append((tool, dict(arguments)))
        entry = self._find(tool, arguments)
        if entry is None:
            raise SourceError(f"Keine Aufzeichnung für {tool} mit {arguments}")
        raw = (self.directory / entry["file"]).read_text("utf-8")
        return decode_tool_text(raw)


class RecordingCaller:
    """Reicht Aufrufe an einen echten Caller weiter und legt die Antworten ab."""

    def __init__(self, inner: ToolCaller, directory: Path, source: str):
        self.inner = inner
        self.directory = Path(directory)
        self.source = source
        self.directory.mkdir(parents=True, exist_ok=True)
        self.index_path = self.directory / "index.json"
        self.index: list[dict[str, Any]] = (
            json.loads(self.index_path.read_text("utf-8")) if self.index_path.exists() else []
        )

    async def call(self, tool: str, arguments: dict[str, Any]) -> Any:
        result = await self.inner.call(tool, arguments)
        key = _key(tool, arguments)
        file = f"{self.source}__{tool}__{key}.json"
        payload = result if isinstance(result, str) else json.dumps(result, ensure_ascii=False, indent=1)
        (self.directory / file).write_text(payload, "utf-8")
        self.index = [e for e in self.index if e["file"] != file]
        self.index.append({"tool": tool, "args": arguments, "file": file, "source": self.source})
        self.index_path.write_text(json.dumps(self.index, ensure_ascii=False, indent=1), "utf-8")
        return result
