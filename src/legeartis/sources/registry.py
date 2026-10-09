"""Verbindet konfigurierte Endpunkte mit Adaptern und degradiert kontrolliert."""

from __future__ import annotations

from contextlib import AsyncExitStack
from dataclasses import dataclass

from ..config import Settings
from .fedlex import Fedlex
from .mcp_client import McpToolCaller
from .onlinekommentar import Onlinekommentar
from .opencaselaw import OpencaselawSuche
from .protocol import ToolCaller


@dataclass
class Sources:
    opencaselaw: OpencaselawSuche
    fedlex: Fedlex | None
    onlinekommentar: Onlinekommentar | None
    hinweise: list[str]

    @classmethod
    def from_callers(
        cls,
        opencaselaw: ToolCaller,
        fedlex: ToolCaller | None = None,
        onlinekommentar: ToolCaller | None = None,
    ) -> Sources:
        hinweise: list[str] = []
        if fedlex is None:
            hinweise.append(
                "Fedlex-MCP nicht konfiguriert: Normtext nur aus dem Fedlex-Spiegel von Opencaselaw, "
                "keine Fassungsliste mit Geltungsdauer."
            )
        if onlinekommentar is None:
            hinweise.append("Onlinekommentar-MCP nicht konfiguriert: Lehre nur aus Opencaselaw.")
        return cls(
            opencaselaw=OpencaselawSuche(opencaselaw),
            fedlex=Fedlex(fedlex) if fedlex else None,
            onlinekommentar=Onlinekommentar(onlinekommentar) if onlinekommentar else None,
            hinweise=hinweise,
        )


async def open_sources(settings: Settings, stack: AsyncExitStack) -> Sources:
    """Öffnet alle konfigurierten MCP-Verbindungen im übergebenen ExitStack."""
    oc = await stack.enter_async_context(McpToolCaller(settings.opencaselaw))
    fx = await stack.enter_async_context(McpToolCaller(settings.fedlex)) if settings.fedlex.configured else None
    ok = (
        await stack.enter_async_context(McpToolCaller(settings.onlinekommentar))
        if settings.onlinekommentar.configured
        else None
    )
    return Sources.from_callers(oc, fx, ok)
