"""Konfiguration über Umgebungsvariablen.

Alle Endpunkte sind bewusst konfigurierbar: Die URL des Fedlex-MCP-Servers ist
nicht öffentlich dokumentiert, und der Opencaselaw-Endpunkt ist aus manchen
Netzen (Proxy) nicht erreichbar. Fehlt ein Endpunkt, degradiert das Tool
kontrolliert (siehe `sources/registry.py`), statt zu raten.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field


@dataclass(frozen=True)
class McpEndpoint:
    name: str
    url: str | None
    transport: str = "auto"  # "auto" | "streamable_http" | "sse"
    headers: dict[str, str] = field(default_factory=dict)

    @property
    def configured(self) -> bool:
        return bool(self.url)


@dataclass(frozen=True)
class Settings:
    opencaselaw: McpEndpoint
    fedlex: McpEndpoint
    onlinekommentar: McpEndpoint
    model: str = "claude-opus-5-5"
    effort: str = "high"
    max_tokens: int = 16000

    @classmethod
    def from_env(cls) -> Settings:
        def ep(name: str, env: str, default: str | None) -> McpEndpoint:
            url = os.environ.get(env, default)
            transport = os.environ.get(f"{env}_TRANSPORT", "auto")
            token = os.environ.get(f"{env}_TOKEN")
            headers = {"Authorization": f"Bearer {token}"} if token else {}
            return McpEndpoint(name=name, url=url or None, transport=transport, headers=headers)

        return cls(
            # Opencaselaw publiziert seinen MCP-Server unter dieser URL (SSE).
            opencaselaw=ep("opencaselaw", "LEGEARTIS_OPENCASELAW_URL", "https://mcp.opencaselaw.ch"),
            # Fedlex-MCP: URL vom Konnektor übernehmen. Ohne URL dient der
            # Fedlex-Spiegel von Opencaselaw (get_law) als Normtextquelle.
            fedlex=ep("fedlex", "LEGEARTIS_FEDLEX_URL", None),
            onlinekommentar=ep("onlinekommentar", "LEGEARTIS_ONLINEKOMMENTAR_URL", None),
            model=os.environ.get("LEGEARTIS_MODEL", "claude-opus-5-5"),
            effort=os.environ.get("LEGEARTIS_EFFORT", "high"),
            max_tokens=int(os.environ.get("LEGEARTIS_MAX_TOKENS", "16000")),
        )
