"""Frage-Ablauf mit Fake-Modell und aufgezeichneten Treffern für eine Praxisfrage."""

from legeartis.frage.akte import parse_reference
from legeartis.frage.pipeline import Rechtsfrage
from legeartis.frage.schema import (
    Antwort,
    Auslegungsbedarf,
    Normauswahl,
    Pruefpunkt,
    Pruefschritt,
    Rechercheplan,
)

FRAGE = "Haftet die Erwerberin eines Betriebs aus der Konkursmasse für vor der Übernahme fällige Löhne?"


class FakeLLM:
    model = "fake"

    def __init__(self):
        self.calls: list[tuple[str, str]] = []

    async def structured(self, system, user, schema):
        self.calls.append((schema.__name__, user))
        if schema is Rechercheplan:
            return Rechercheplan(
                rechtsfrage_abstrakt="Erfasst Art. 333 Abs. 3 OR auch den Erwerb eines Betriebs aus der Konkursmasse?",
                rechtsgebiet="Arbeitsrecht", suchbegriffe_normen=["Betriebsübergang Arbeitsverhältnis Erwerber"],
                suchbegriffe_entscheide=['"Art. 333 Abs. 3 OR" Konkurs Solidarhaftung Erwerber'],
                jurisdiktion="federal", kanton=None, gericht="bge",
                vorlaeufige_pruefpunkte=["Betriebsübergang", "Solidarhaftung", "Ausnahme Konkurs"],
            )
        if schema is Normauswahl:
            assert "Art. 333 OR" in user and "Art. 333b OR" in user and "bge_BGE_129_III_335" in user
            return Normauswahl(
                pruefpunkte=[Pruefpunkt(titel="Betriebsübergang und Haftung", normen=["Art. 333 OR"], begruendung="Hauptnorm"),
                             Pruefpunkt(titel="Übertragung im Konkurs", normen=["Art. 333b OR", "Art. 999 XYZ"], begruendung="Sondernorm")],
                verworfene_treffer=["Art. 76a SSG: Seeschifffahrt", "Art. 97 UVV: Versicherungsmeldung"],
                relevante_entscheide=["bge_BGE_129_III_335", "bge_BGE_137_III_487", "bge_BGE_000_I_1"],
            )
        if schema is Antwort:
            assert "erw:bge_BGE_129_III_335:E.5.2" in user
            assert "entscheid:bge_BGE_123_III_466" in user  # Leitentscheid zur Hauptnorm
            return Antwort(
                kurzantwort="Nein. Nach BGE 129 III 335 haftet die Erwerberin nicht.",
                pruefung=[Pruefschritt(titel="Solidarhaftung", obersatz="Art. 333 Abs. 3 OR ...", subsumtion="...", ergebnis="...",
                                       beleg_ids=["norm:220:333:de", "erw:bge_BGE_129_III_335:E.5.2", "entscheid:bge_BGE_555_II_5"])],
                gesamtergebnis="Keine Haftung.", sicherheit="gesichert", sicherheit_begruendung="Leitentscheid und Art. 333b OR.",
                auslegungsbedarf=[Auslegungsbedarf(norm="Art. 333 Abs. 3 OR", auslegungsfrage="Erfasst Abs. 3 den Erwerb aus der Konkursmasse?", grund="Wortlaut gegen Zweck")],
                offene_recherche=["Kantonale Praxis zu Nachlassverträgen"],
                verwendete_beleg_ids=["norm:220:333b:de", "entscheid:bge_BGE_137_III_487"],
            )
        raise AssertionError(schema)


def test_parse_reference():
    assert parse_reference("Art. 333 Abs. 3 OR") == ("OR", "333")
    assert parse_reference("Art. 333b OR") == ("OR", "333b")
    assert parse_reference("§ 12 ZH/StG") == ("ZH/StG", "12")
    assert parse_reference("irgendwas") is None


async def test_frage_end_to_end(sources):
    llm = FakeLLM()
    fall = await Rechtsfrage(sources, llm, grounding=False).run(FRAGE)
    assert [c[0] for c in llm.calls] == ["Rechercheplan", "Normauswahl", "Antwort"]
    akte = fall.akte
    assert [n.label for n in akte.normen] == ["Art. 333 OR", "Art. 333b OR"]
    ids = {e.decision_id for e in akte.entscheide}
    assert {"bge_BGE_129_III_335", "bge_BGE_137_III_487", "bge_BGE_123_III_466", "bge_BGE_127_V_183"} <= ids
    assert "bge_BGE_88_III_28" not in ids  # Fehltreffer nicht übernommen
    erw = [(e.decision_id, x.e_number) for e in akte.entscheide for x in e.erwaegungen]
    assert erw == [("bge_BGE_129_III_335", "5.2")]
    assert any("Erwägung BGE 137 III 487 E. 4.3" in w for w in akte.warnungen)  # keine Aufzeichnung: ehrlich gemeldet
    assert any("Art. 999 XYZ" in w for w in akte.warnungen)
    assert any("bge_BGE_000_I_1" in w for w in akte.warnungen)
    assert fall.gestrichen == ["Solidarhaftung: entscheid:bge_BGE_555_II_5"]
    assert fall.antwort.pruefung[0].beleg_ids == ["norm:220:333:de", "erw:bge_BGE_129_III_335:E.5.2"]
    assert fall.freigabe.status == "nicht_freigegeben"
    assert fall.freigabe.fremde_zitate == []
    assert "## Auslegungsbedarf" in fall.text
    assert 'legeartis auslegen OR 333 --frage' in fall.text
    assert "BGE 129 III 335, E. 5.2 [verwendet]" in fall.text
    assert "Verworfene Treffer" in fall.text
