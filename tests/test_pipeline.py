"""Pipeline mit Fake-Modell: prüft Verdrahtung, Gates und Rendering, nicht die Juristerei."""

from legeartis.auslegung.pipeline import Auslegung
from legeartis.auslegung.schema import (
    Abwaegung,
    Auslegungsfrage,
    Befund,
    ElementBericht,
    Ergebnis,
    Fachbegriff,
    Gewichtung,
    Kritik,
    Lesart,
)


class FakeLLM:
    def __init__(self):
        self.calls: list[tuple[str, str]] = []

    async def structured(self, system, user, schema):
        self.calls.append((schema.__name__, user))
        if schema is Auslegungsfrage:
            return Auslegungsfrage(
                frage="Erfasst Art. 2 Abs. 2 ZGB auch widersprüchliches Verhalten ohne Verschulden?",
                lesarten=[Lesart(kennung="Lesart 1", text="Ja."), Lesart(kennung="Lesart 2", text="Nein.")],
                terminologie_de="Rechtsmissbrauch", terminologie_fr="abus de droit", terminologie_it="abuso di diritto",
            )
        if schema is ElementBericht:
            element = user.rsplit("«", 1)[1].split("»")[0]
            befunde = [Befund(nr=1, aussage=f"{element}: Normtext gelesen", beleg_ids=["norm:210:2:de"])]
            if element == "historisch":
                befunde.append(Befund(nr=2, aussage="Erfundene Botschaft", beleg_ids=["bbl:BBl 1900 1:S.1"]))
            if element == "teleologisch":
                assert "Befunde der anderen Gutachter" in user
                assert "Erfundene Botschaft" not in user
                befunde.append(Befund(nr=2, aussage="venire contra factum proprium", beleg_ids=["erw:bge_BGE_140_III_481:E.2"]))
            return ElementBericht(element=element, befunde=befunde, richtung="Lesart 1", staerke="schwach",
                                  staerke_begruendung="b", gegenbefund="g", fehlt=[])
        if schema is Abwaegung:
            return Abwaegung(
                tabelle=[Gewichtung(element=e, richtung="Lesart 1", staerke="schwach", grund="r")
                         for e in ("grammatikalisch", "historisch", "systematisch", "teleologisch")],
                bevorzugte_lesart="Lesart 1", offen=False, begruendung="x", wortlaut_gedeckt=True,
                schritt="auslegung_im_rahmen_des_wortlauts", nicht_luecken_pruefung=None,
            )
        if schema is Kritik:
            return Kritik(kipptest_bestanden=False, kipptest_begruendung="k", beanstandungen=["b1"],
                          uebersehene_lesart=None, uebergangener_nicht_luecken_fall=None)
        if schema is Ergebnis:
            return Ergebnis(
                einstufung="vertretbar_aber_offen", kernaussage="Nach BGE 140 III 481, E. 2 gilt Lesart 1.",
                begruendung="Siehe BGE 777 II 1.", was_die_kritik_einwandte="w", was_kippen_wuerde="k",
                abgleich_mit_rechtsprechung="a", einfache_erklaerung="Einfach.",
                fachbegriffe=[Fachbegriff(begriff="Rechtsmissbrauch", erklaerung="...")],
                verwendete_beleg_ids=["erw:bge_BGE_140_III_481:E.2", "komm:erfunden:1"],
            )
        raise AssertionError(schema)


async def test_pipeline_end_to_end(sources):
    llm = FakeLLM()
    lauf = await Auslegung(sources, llm).run("ZGB", "2")
    assert [c[0] for c in llm.calls] == [
        "Auslegungsfrage", "ElementBericht", "ElementBericht", "ElementBericht", "ElementBericht",
        "Abwaegung", "Kritik", "Ergebnis",
    ]
    assert [b.element for b in lauf.berichte] == ["grammatikalisch", "historisch", "systematisch", "teleologisch"]
    assert len(lauf.gestrichen) == 1 and "bbl:BBl 1900 1:S.1" in lauf.gestrichen[0].grund
    assert lauf.ergebnis.verwendete_beleg_ids == ["erw:bge_BGE_140_III_481:E.2"]
    assert any("unbekannte Beleg-IDs" in h for h in lauf.hinweise)
    # attest_response hat für diesen Text keine Aufzeichnung: ehrlich als nicht geprüft markieren,
    # aber das lokale Gate findet das fremde Zitat und verweigert die Freigabe.
    assert lauf.freigabe.status == "nicht_freigegeben"
    assert lauf.freigabe.fremde_zitate == ["BGE 777 II 1"]
    assert "NICHT FREIGEGEBEN" in lauf.text
    assert "| grammatikalisch | Lesart 1 | schwach | r |" in lauf.text
    assert "Gestrichene Befunde" in lauf.text
    assert "BGE 140 III 481, E. 2 [verwendet]" in lauf.text
    assert "Rechtsmissbrauch" in lauf.text
    assert "## 7. In einfachen Worten" in lauf.text
    assert "## 10. KI-Vermerk" in lauf.text
    assert "Legeartis mit Claude, unbekannt, Anthropic" in lauf.text
    assert lauf.frage.frage in lauf.text
    assert "Prüfumfang" in lauf.text


async def test_pipeline_praxis_modus(sources):
    llm = FakeLLM()
    lauf = await Auslegung(sources, llm, modus="praxis").run("ZGB", "2")
    schluss_system = [c for c in llm.calls if c[0] == "Ergebnis"]
    assert len(schluss_system) == 1
    assert "## 7. Praktische Konsequenz" in lauf.text
    assert "In einfachen Worten" not in lauf.text
    assert "KI-Vermerk" not in lauf.text
    assert "Prüfumfang" in lauf.text
