from legeartis.auslegung.dossier import build_dossier


async def test_dossier_art2_zgb(sources):
    d = await build_dossier(sources, "ZGB", "2")
    assert d.norm.sr_number == "210" and d.norm.label == "Art. 2 ZGB"
    assert set(d.norm.fassungen) == {"de", "fr", "it"}
    assert d.norm.fassungen["de"].heading == "Handeln nach Treu und Glauben"
    assert len(d.fassungen) == 4
    assert [e.label for e in d.leitentscheide] == [
        "BGE 129 III 493", "BGE 138 III 401", "BGE 140 III 481", "BGE 125 III 257", "BGE 143 III 666",
    ]
    assert all(e.zitat and e.zitat.exists for e in d.leitentscheide)
    erw = [(e.label, x.e_number) for e in d.leitentscheide for x in e.erwaegungen]
    assert erw == [("BGE 140 III 481", "2"), ("BGE 143 III 666", "3")]
    assert d.materialien and all(m.qualitaet == "volltexttreffer" for m in d.materialien)
    assert all(k.art == "erwaehnung" for k in d.kommentare) and len(d.kommentare) == 3
    assert any("Volltexttreffer" in w for w in d.warnungen)
    assert any("Keine Open-Access-Kommentierung" in w for w in d.warnungen)
    assert not any("weicht" in w for w in d.warnungen)
    index = d.beleg_index()
    assert "norm:210:2:de" in index
    assert "erw:bge_BGE_140_III_481:E.2" in index
    assert "entscheid:bge_BGE_125_III_257" in index
    assert "BGE 140 III 481, E. 2" in d.zitierstrings()
    assert "ATF 129 III 493" in d.zitierstrings()
