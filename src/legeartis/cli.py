"""Kommandozeile."""

from __future__ import annotations

import asyncio
import json
from contextlib import AsyncExitStack
from pathlib import Path

import typer
from rich.console import Console

from .config import Settings
from .sources.protocol import SourceError
from .sources.recorder import ReplayCaller
from .sources.registry import Sources, open_sources

app = typer.Typer(help="Legeartis: Schweizer Rechtsrecherche für Einsteiger.", no_args_is_help=True)
console = Console()


async def _sources(stack: AsyncExitStack, fixtures: Path | None) -> Sources:
    if fixtures:
        replay = ReplayCaller(fixtures)
        return Sources.from_callers(replay, replay, replay)
    return await open_sources(Settings.from_env(), stack)


@app.command()
def norm(abbreviation: str, article: str, fixtures: Path | None = typer.Option(None, help="Fixture-Verzeichnis statt Netz")):
    """Normtext in drei Sprachen anzeigen."""

    async def run() -> None:
        async with AsyncExitStack() as stack:
            s = await _sources(stack, fixtures)
            for lang in ("de", "fr", "it"):
                try:
                    sr, f = await s.opencaselaw.get_law(abbreviation, article, language=lang)
                except SourceError as exc:
                    console.print(f"[red]{lang}: {exc}")
                    continue
                console.rule(f"Art. {article} {f.abbreviation} ({lang}), SR {sr}, Stand {f.consolidation_date}")
                console.print(f.text)
                console.print(f"[dim]{f.source_url}")

    asyncio.run(run())


@app.command()
def dossier(
    abbreviation: str,
    article: str,
    fixtures: Path | None = typer.Option(None, help="Fixture-Verzeichnis statt Netz"),
    as_json: bool = typer.Option(False, "--json", help="JSON statt Übersicht"),
):
    """Quellen-Dossier ohne Sprachmodell zusammenstellen."""
    from .auslegung.dossier import build_dossier

    async def run() -> None:
        async with AsyncExitStack() as stack:
            s = await _sources(stack, fixtures)
            d = await build_dossier(s, abbreviation, article)
            if as_json:
                print(json.dumps(d.model_dump(), ensure_ascii=False, indent=1))
                return
            console.rule(f"Dossier {d.norm.label}")
            for bid, desc in d.beleg_index().items():
                console.print(f"- {bid}: {desc}")
            if d.warnungen:
                console.print("[yellow]Warnungen:")
                for w in d.warnungen:
                    console.print(f"  - {w}")

    asyncio.run(run())


@app.command()
def auslegen(
    abbreviation: str,
    article: str,
    frage: str | None = typer.Option(None, help="Auslegungsfrage, abstrakt formuliert"),
    lesart: list[str] = typer.Option([], help="Lesart (mehrfach angeben)"),
    out: Path | None = typer.Option(None, help="Markdown-Datei für das Ergebnis"),
    fixtures: Path | None = typer.Option(None, help="Fixture-Verzeichnis statt Netz"),
    no_grounding: bool = typer.Option(False, help="attest_response ohne LLM-Richter (billiger)"),
):
    """Norm nach den vier Elementen auslegen, mit Freigabe."""
    from .auslegung.llm import AnthropicLLM
    from .auslegung.pipeline import Auslegung

    async def run() -> None:
        async with AsyncExitStack() as stack:
            s = await _sources(stack, fixtures)
            llm = AnthropicLLM(Settings.from_env())
            lauf = await Auslegung(s, llm, grounding=not no_grounding).run(
                abbreviation, article, frage=frage, lesarten=list(lesart) or None
            )
            if out:
                out.write_text(lauf.text, "utf-8")
                console.print(f"geschrieben: {out}")
            else:
                print(lauf.text)

    asyncio.run(run())


@app.command()
def chat(fixtures: Path | None = typer.Option(None, hidden=True)):
    """Freier Recherche-Chat mit den Werkzeugen des Opencaselaw-Servers."""
    import anthropic
    from anthropic.lib.tools.mcp import async_mcp_tool

    from .sources.mcp_client import McpToolCaller

    settings = Settings.from_env()
    system = (
        "Du hilfst bei der Schweizer Rechtsrecherche. Regeln: Zitate nur aus citation_string-"
        "Feldern der Werkzeuge (cite, get_erwaegung), nie selbst konstruieren. Wörtliche Zitate "
        "nur aus get_erwaegung, get_regeste, get_law. Normtexte nie aus dem Gedächtnis, immer "
        "get_law. Vor jeder Antwort mit Fundstellen attest_response aufrufen und bei ok=false "
        "korrigieren. Sag, was du nicht belegen kannst. Schweizer Rechtschreibung."
    )

    async def run() -> None:
        client = anthropic.AsyncAnthropic()
        async with McpToolCaller(settings.opencaselaw) as mcp:
            session = mcp._session
            assert session is not None
            tools_result = await session.list_tools()
            tools = [async_mcp_tool(t, session) for t in tools_result.tools]
            messages: list[dict] = []
            console.print("[bold]Legeartis-Chat[/bold] (leer = beenden)")
            while True:
                try:
                    q = console.input("[cyan]> ")
                except (EOFError, KeyboardInterrupt):
                    break
                if not q.strip():
                    break
                messages.append({"role": "user", "content": q})
                runner = client.beta.messages.tool_runner(
                    model=settings.model,
                    max_tokens=settings.max_tokens,
                    system=system,
                    tools=tools,
                    messages=messages,
                )
                last = None
                async for message in runner:
                    last = message
                    messages.append({"role": "assistant", "content": message.content})
                    tool_response = runner.generate_tool_call_response()
                    if tool_response is not None:
                        messages.append(tool_response)
                if last is not None:
                    for block in last.content:
                        if block.type == "text":
                            console.print(block.text)

    asyncio.run(run())


if __name__ == "__main__":
    app()
