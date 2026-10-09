from pathlib import Path

import pytest

from legeartis.sources.recorder import ReplayCaller
from legeartis.sources.registry import Sources

FIXTURES = Path(__file__).parent / "fixtures"


@pytest.fixture
def replay() -> ReplayCaller:
    return ReplayCaller(FIXTURES)


@pytest.fixture
def sources(replay: ReplayCaller) -> Sources:
    return Sources.from_callers(replay, replay, replay)
