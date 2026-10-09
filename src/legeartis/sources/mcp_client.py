"""Dünner, asynchroner MCP-Client (Streamable HTTP oder SSE), für das Paket `mcp` 2.x.

Nicht gegen die Live-Server getestet: Aus der Entwicklungsumgebung waren
mcp.opencaselaw.ch und fedlex.admin.ch nicht erreichbar. Die Adapter sind
deshalb mit aufgezeichneten Antworten (tests/fixtures) getestet; dieser Client
ist der einzige ungetestete Baustein und als Erstes live zu prüfen.
"""

from __future__ import annotations

from contextlib import AsyncExitStack
from typing import Any, Self

from mcp import ClientSession
from mcp.client.sse import sse_client
from mcp.client.streamable_http import streamable_http_client
from mcp.shared._httpx_utils import create_mcp_http_client

from ..config import McpEndpoint
from .protocol import SourceError, decode_tool_text


class McpToolCaller:
    """Hält eine MCP-Sitzung offen und führt Werkzeugaufrufe aus."""

    def __init__(self, endpoint: McpEndpoint):
        if not endpoint.url:
            raise SourceError(f"Endpunkt {endpoint.name} ist nicht konfiguriert")
        self.endpoint = endpoint
        self._stack: AsyncExitStack | None = None
        self._session: ClientSession | None = None

    async def __aenter__(self) -> Self:
        await self.connect()
        return self

    async def __aexit__(self, *exc: object) -> None:
        await self.close()

    async def connect(self) -> None:
        self._stack = AsyncExitStack()
        url = self.endpoint.url or ""
        transports = (
            ["streamable_http", "sse"]
            if self.endpoint.transport == "auto"
            else [self.endpoint.transport]
        )
        last_error: Exception | None = None
        for transport in transports:
            try:
                if transport == "streamable_http":
                    http_client = create_mcp_http_client(headers=self.endpoint.headers or None)
                    read, write = await self._stack.enter_async_context(
                        streamable_http_client(url, http_client=http_client)
                    )
                else:
                    read, write = await self._stack.enter_async_context(
                        sse_client(url, headers=self.endpoint.headers or None)
                    )
                session = await self._stack.enter_async_context(ClientSession(read, write))
                await session.initialize()
                self._session = session
                return
            except Exception as exc:  # noqa: BLE001 - wir probieren den nächsten Transport
                last_error = exc
                await self._stack.aclose()
                self._stack = AsyncExitStack()
        raise SourceError(f"Verbindung zu {self.endpoint.name} ({url}) fehlgeschlagen: {last_error}")

    async def close(self) -> None:
        if self._stack is not None:
            await self._stack.aclose()
            self._stack = None
            self._session = None

    async def list_tools(self) -> list[str]:
        assert self._session is not None, "connect() zuerst aufrufen"
        result = await self._session.list_tools()
        return [t.name for t in result.tools]

    async def call(self, tool: str, arguments: dict[str, Any]) -> Any:
        assert self._session is not None, "connect() zuerst aufrufen"
        result = await self._session.call_tool(tool, arguments)
        if result.isError:
            text = " ".join(getattr(c, "text", "") for c in result.content)
            raise SourceError(f"{self.endpoint.name}.{tool}: {text or 'Fehler ohne Text'}")
        structured = getattr(result, "structuredContent", None)
        if structured:
            return structured
        texts = [c.text for c in result.content if getattr(c, "type", "") == "text"]
        if not texts:
            raise SourceError(f"{self.endpoint.name}.{tool}: leere Antwort")
        return decode_tool_text("\n".join(texts))
