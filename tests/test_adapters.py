from legeartis.sources.fedlex import Fedlex
from legeartis.sources.onlinekommentar import Onlinekommentar
from legeartis.sources.opencaselaw import Opencaselaw


async def test_get_law_three_languages(replay):
    oc = Opencaselaw(replay)
    sr, de = await oc.get_law("ZGB", "2", "de")
    _, fr = await oc.get_law("ZGB", "2", "fr")
    _, it = await oc.get_law("ZGB", "2", "it")
    assert sr == "210"
    assert "Treu und Glauben" in de.text
    assert "bonne foi" in fr.text and fr.abbreviation == "CC"
    assert "buona fede" in it.text
    assert de.consolidation_date == "2026-07-01"


async def test_leading_cases_markdown_parsed(replay):
    cases = await Opencaselaw(replay).find_leading_cases("ZGB", "2", limit=5)
    assert [c.label for c in cases] == [
        "BGE 129 III 493", "BGE 138 III 401", "BGE 140 III 481", "BGE 125 III 257", "BGE 143 III 666",
    ]
    assert cases[2].decision_id == "bge_BGE_140_III_481"
    assert cases[2].date == "2014-09-19"
    assert cases[2].citation_count == 114
    assert cases[2].regeste_pinpoints == ["2"]
    assert cases[0].regeste_pinpoints == []
    assert cases[4].regeste_pinpoints == ["3"]


async def test_cite_and_erwaegung(replay):
    oc = Opencaselaw(replay)
    z = await oc.cite("BGE 140 III 481", pinpoint="2.3")
    assert z.exists and z.pinpoint_valid
    assert z.citation_string_fr == "ATF 140 III 481, consid. 2.3"
    e = await oc.get_erwaegung("bge_BGE_140_III_481", "2.3")
    assert e.beleg_id == "erw:bge_BGE_140_III_481:E.2.3"
    assert "venire contra factum proprium" in e.text
    assert e.composed_of == ["2.3.1", "2.3.2", "2.3.3"]


async def test_article_purpose_flags_fulltext_hits(replay):
    stellen, hint = await Opencaselaw(replay).get_article_purpose("210", "2")
    assert hint is not None
    assert stellen and all(s.qualitaet == "volltexttreffer" for s in stellen)
    assert stellen[0].beleg_id == "bbl:BBl 2015 7615:S.10"


async def test_no_commentary_is_none(replay):
    assert await Opencaselaw(replay).get_commentary("ZGB", "2") is None


async def test_fedlex(replay):
    fx = Fedlex(replay)
    art = await fx.get_article("210", "2", "de")
    assert art.heading == "Handeln nach Treu und Glauben"
    assert art.abbreviation == "ZGB"
    versions = await fx.get_versions("210", "de")
    current = [v for v in versions if v.status == "current"]
    assert len(current) == 1 and current[0].valid_from == "2026-07-01"


async def test_onlinekommentar_search(replay):
    hits = await Onlinekommentar(replay).search("Art. 2 ZGB", "de")
    assert len(hits) == 6
    assert hits[0].title == "Art. 3 KGTG"
    assert hits[0].beleg_id.startswith("komm:onlinekommentar:")
