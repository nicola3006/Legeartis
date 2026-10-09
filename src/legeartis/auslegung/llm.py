"""Anbindung an die Claude API mit strukturierter Ausgabe.

`LLM` ist eine Schnittstelle, damit Tests einen Fake einsetzen können. Die
echte Implementierung nutzt Streaming (lange Ausgaben), adaptives Denken und
`output_config.format` mit einem JSON-Schema, dessen `$ref` aufgelöst sind.
"""

from __future__ import annotations

from typing import Any, Protocol, TypeVar

from pydantic import BaseModel

from ..config import Settings

T = TypeVar("T", bound=BaseModel)


class LLMError(RuntimeError):
    pass


class LLM(Protocol):
    async def structured(self, system: str, user: str, schema: type[T]) -> T:  # pragma: no cover
        ...


def inline_refs(schema: dict[str, Any]) -> dict[str, Any]:
    """Löst `$ref` gegen `$defs` auf, damit das Schema flach ist."""
    defs = schema.get("$defs", {})

    def walk(node: Any) -> Any:
        if isinstance(node, dict):
            if "$ref" in node:
                name = node["$ref"].split("/")[-1]
                return walk(defs[name])
            return {k: walk(v) for k, v in node.items() if k != "$defs"}
        if isinstance(node, list):
            return [walk(x) for x in node]
        return node

    return walk(schema)


class AnthropicLLM:
    def __init__(self, settings: Settings):
        import anthropic

        self.settings = settings
        self.client = anthropic.AsyncAnthropic()

    async def structured(self, system: str, user: str, schema: type[T]) -> T:
        json_schema = inline_refs(schema.model_json_schema())
        async with self.client.messages.stream(
            model=self.settings.model,
            max_tokens=self.settings.max_tokens,
            system=system,
            messages=[{"role": "user", "content": user}],
            thinking={"type": "adaptive"},
            output_config={
                "effort": self.settings.effort,
                "format": {"type": "json_schema", "schema": json_schema},
            },
        ) as stream:
            message = await stream.get_final_message()
        if message.stop_reason == "refusal":
            details = getattr(message, "stop_details", None)
            raise LLMError(f"Modell hat die Anfrage abgelehnt: {details}")
        if message.stop_reason == "max_tokens":
            raise LLMError("Ausgabe abgeschnitten (max_tokens erreicht)")
        text = next((b.text for b in message.content if b.type == "text"), None)
        if text is None:
            raise LLMError("Keine Textausgabe erhalten")
        return schema.model_validate_json(text)
