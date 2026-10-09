"""Strukturierte Ausgaben des Frage-Ablaufs (drei Modellschritte)."""

from __future__ import annotations

from typing import Literal

from pydantic import Field

from ..auslegung.schema import Strict


class Rechercheplan(Strict):
    rechtsfrage_abstrakt: str = Field(description="Die Rechtsfrage ohne Parteien, in einem Satz")
    rechtsgebiet: str
    suchbegriffe_normen: list[str] = Field(description="1 bis 3 Suchanfragen für die Normensuche (search_laws)")
    suchbegriffe_entscheide: list[str] = Field(
        description="1 bis 3 Suchanfragen für die Entscheidsuche; Normzitate in Anführungszeichen, 3 bis 8 Begriffe"
    )
    jurisdiktion: Literal["federal", "cantonal", "all"]
    kanton: str | None = Field(description="Zweibuchstabiger Kantonscode, wenn kantonales Recht berührt ist")
    gericht: Literal["bge", "bger", "alle"] = Field(
        description="bge = publizierte Leitentscheide, bger = alle Bundesgerichtsurteile, alle = alle Gerichte"
    )
    vorlaeufige_pruefpunkte: list[str]


class Pruefpunkt(Strict):
    titel: str
    normen: list[str] = Field(description="Referenzen aus den Treffern, z.B. 'Art. 333 OR'; die erste ist die Hauptnorm")
    begruendung: str


class Normauswahl(Strict):
    pruefpunkte: list[Pruefpunkt]
    verworfene_treffer: list[str] = Field(description="Referenzen, die nicht einschlägig sind, mit Grund")
    relevante_entscheide: list[str] = Field(description="decision_ids der Entscheide, die zur Sachfrage passen")


class Pruefschritt(Strict):
    titel: str
    obersatz: str = Field(description="Abstrakte Rechtslage mit Beleg-IDs; Normzitate im Text")
    subsumtion: str = Field(description="Anwendung auf die Frage oder den Sachverhalt; ohne Belege")
    ergebnis: str
    beleg_ids: list[str]


class Auslegungsbedarf(Strict):
    norm: str = Field(description="Referenz, z.B. 'Art. 333 Abs. 3 OR'")
    auslegungsfrage: str
    grund: str = Field(description="Warum die Antwort an der Reichweite dieser Norm hängt")


class Antwort(Strict):
    kurzantwort: str = Field(description="Zwei bis vier Sätze, direkt auf die Frage")
    pruefung: list[Pruefschritt]
    gesamtergebnis: str
    sicherheit: Literal["gesichert", "vertretbar", "offen"]
    sicherheit_begruendung: str
    auslegungsbedarf: list[Auslegungsbedarf]
    offene_recherche: list[str] = Field(description="Was das Dossier nicht abdeckt und noch zu prüfen ist")
    verwendete_beleg_ids: list[str]
