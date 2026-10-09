"""Strukturierte Ausgaben der Modellschritte.

Alle Modelle verbieten Zusatzfelder (`extra="forbid"`), damit das JSON-Schema
`additionalProperties: false` trägt, wie es die strukturierte Ausgabe der
Claude API verlangt.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid")


Element = Literal["grammatikalisch", "historisch", "systematisch", "teleologisch"]
Staerke = Literal["stark", "schwach", "unergiebig"]


class Lesart(Strict):
    kennung: str = Field(description="Kurze Kennung, z.B. 'Lesart 1'")
    text: str = Field(description="Die Lesart in einem Satz, neutral formuliert")


class Auslegungsfrage(Strict):
    frage: str = Field(description="Abstrakte Auslegungsfrage ohne Sachverhalt und Parteien")
    lesarten: list[Lesart]
    terminologie_de: str
    terminologie_fr: str
    terminologie_it: str


class Befund(Strict):
    nr: int
    aussage: str = Field(description="Eine Tatsache aus den Quellen, keine Wertung")
    beleg_ids: list[str] = Field(description="Beleg-IDs aus dem Dossier, mindestens eine")


class ElementBericht(Strict):
    element: Element
    befunde: list[Befund]
    richtung: str = Field(description="Kennung der gestützten Lesart oder 'keine'")
    staerke: Staerke
    staerke_begruendung: str
    gegenbefund: str = Field(description="Was gegen die eigene Richtung spricht")
    fehlt: list[str] = Field(description="Nicht auffindbare Quellen, offene Punkte")


class Gewichtung(Strict):
    element: Element
    richtung: str
    staerke: Staerke
    grund: str = Field(description="Tragender Grund für das Gewicht, mit Gewichtungsregel")


class Abwaegung(Strict):
    tabelle: list[Gewichtung]
    bevorzugte_lesart: str | None = Field(description="Kennung oder null, wenn offen")
    offen: bool
    begruendung: str
    wortlaut_gedeckt: bool | None
    schritt: Literal[
        "auslegung_extensiv",
        "auslegung_restriktiv",
        "auslegung_im_rahmen_des_wortlauts",
        "analogie",
        "teleologische_reduktion",
        "regel_modo_legislatoris",
        "offen",
    ]
    nicht_luecken_pruefung: str | None = Field(
        description="Nur bei Verlassen des Wortlauts: die vier Fälle einzeln abgehakt"
    )


class Kritik(Strict):
    kipptest_bestanden: bool
    kipptest_begruendung: str
    beanstandungen: list[str]
    uebersehene_lesart: str | None
    uebergangener_nicht_luecken_fall: str | None


class Fachbegriff(Strict):
    begriff: str
    erklaerung: str


class Ergebnis(Strict):
    einstufung: Literal["ueberzeugend", "vertretbar_aber_offen", "offen"]
    kernaussage: str = Field(description="Ein bis zwei Sätze: Lesart und Schritt beim Namen")
    begruendung: str = Field(description="Elemente einzeln ausweisen und gewichten")
    was_die_kritik_einwandte: str
    was_kippen_wuerde: str
    abgleich_mit_rechtsprechung: str
    einfache_erklaerung: str
    fachbegriffe: list[Fachbegriff]
    verwendete_beleg_ids: list[str]
