from legeartis.auslegung.dossier import build_dossier
from legeartis.auslegung.gate import filtere_berichte, fremde_zitate, pruefe_text
from legeartis.auslegung.schema import Befund, ElementBericht


def _bericht(*befunde: Befund) -> ElementBericht:
    return ElementBericht(
        element="grammatikalisch", befunde=list(befunde), richtung="Lesart 1",
        staerke="schwach", staerke_begruendung="x", gegenbefund="", fehlt=[],
    )


async def test_filter_strips_unknown_and_empty_belege(sources):
    d = await build_dossier(sources, "ZGB", "2")
    b = _bericht(
        Befund(nr=1, aussage="ok", beleg_ids=["norm:210:2:de"]),
        Befund(nr=2, aussage="erfunden", beleg_ids=["erw:bge_BGE_999_III_1:E.1"]),
        Befund(nr=3, aussage="ohne Beleg", beleg_ids=[]),
    )
    out, gestrichen = filtere_berichte([b], d)
    assert [x.nr for x in out[0].befunde] == [1]
    assert {g.grund.split(" ")[0] for g in gestrichen} == {"unbekannte", "kein"}


async def test_fremde_zitate(sources):
    d = await build_dossier(sources, "ZGB", "2")
    text = "Nach BGE 140 III 481, E. 2 und ATF 129 III 493 gilt X. Anders BGE 999 III 1, E. 1 und 4A_1/2020."
    assert fremde_zitate(text, d) == ["BGE 999 III 1, E. 1", "4A_1/2020"]


async def test_attest_replay_rejects_fabricated_citation(sources):
    d = await build_dossier(sources, "ZGB", "2")
    draft = (
        "Art. 2 Abs. 2 ZGB hält fest: «Der offenbare Missbrauch eines Rechtes findet keinen Rechtsschutz.» "
        "Nach BGE 140 III 481, E. 2.3 ist eine Betreibung nur in Ausnahmefällen wegen Rechtsmissbrauchs nichtig. "
        "Dazu BGE 999 III 1, E. 1."
    )
    fg = await pruefe_text(draft, d, sources.opencaselaw, grounding=False)
    assert fg.status == "nicht_freigegeben"
    assert fg.attest_ok is False
    assert fg.issues[0]["problem"] == "decision_not_in_corpus"
    assert fg.fremde_zitate == ["BGE 999 III 1, E. 1"]
    assert fg.ledger["quotations"]["verbatim"] == 1
