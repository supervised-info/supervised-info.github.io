# Changelog Elektroautos — Stand 29. August 2026

Aktualisierung der Datei `data.json` (keine Git-Commits). Quelle 1: [EV Database Deutschland, Reichweiten-Cheatsheet](https://ev-database.org/de/cheatsheet/range-electric-car) (live am 2026-08-29). Preise nur, wenn eine aktuelle DE-UVP auf der Fahrzeugseite oder beim Hersteller lag. Keine Preise/Reichweiten erfunden.

Kopfdaten: `letzte_aktualisierung` 2026-07-24 → **2026-08-29**, `daten_stand` Juli 2026 → **August 2026**.

## Zählung

| Kategorie | Anzahl |
| --- | ---: |
| Datensatz vorher | 129 |
| Datensatz nachher | 134 |
| Gegen EV-Database-Katalog geprüft (Status-Abgleich) | 129 (alle Altzeilen) |
| Davon mit Fahrzeugseite / Hersteller-UVP | 22 Altzeilen + 5 Neubauten |
| Status-Wechsel | 12 |
| Preis-Updates (`preis.basispreis_eur`) | 7 |
| Neu hinzugefügt | 5 |
| Status bestätigt, Zeile unverändert (Preis unchecked) | Rest der 129; siehe „Unchecked“ |
| Preise **nicht** aktualisiert (kein belastbarer DE-UVP-Treffer) | 122 der 129 Altzeilen |

Status nachher: **aktuell 116 · veraltet 13 · eingestellt 5 · null 0**.

`datenerfassung` = 2026-08-29 nur auf Zeilen, die wir inhaltlich angefasst haben (Status, Preis, Nachfolger oder Neubau). Die übrigen behalten ihr altes Datum.

## Status-Wechsel

| ID | Modell | alt → neu | Begründung | Quelle |
| --- | --- | --- | --- | --- |
| 000102 | Opel Corsa Electric | `null` → **aktuell** | Auf dem Cheatsheet als Corsa Electric 54 kWh und 50 kWh, beide „Bestellbar“ | [EVDB 54 kWh](https://ev-database.org/de/pkw/3221/Opel-Corsa-Electric-54-kWh), [EVDB 50 kWh](https://ev-database.org/de/pkw/3220/Opel-Corsa-Electric-50-kWh) |
| 000021 | Mercedes EQE 350+ | veraltet → **aktuell** | Korrektur: MY25 weiterhin bestellbar (seit Apr. 2025), auf dem Cheatsheet. C-Klasse EQ ist Zukunft, kein aktueller Ersatz | [EVDB EQE 350+](https://ev-database.org/de/pkw/3240/Mercedes-Benz-EQE-350plus), [Mercedes Store EQE 350+](https://www.mercedes-benz.de/passengercars/buy/new-car/product.html/EQE-350-_269522877296_DE_354ae2f5) |
| 000112 | Mercedes EQE SUV 350+ | veraltet → **aktuell** | Korrektur: MY25 weiterhin bestellbar, auf dem Cheatsheet. GLC EQ läuft parallel (000122) | [EVDB EQE SUV 350+](https://ev-database.org/de/pkw/3284/Mercedes-Benz-EQE-SUV-350plus) |
| 000039 | VW ID.3 Pro S | aktuell → **veraltet** | EV Database: ID.3 Neo 79 kWh ist Nachfolger des Pro S (bestellbar Jul. 2025–Apr. 2026) | [EVDB ID.3 Neo 79 kWh](https://ev-database.org/de/pkw/3522/Volkswagen-ID3-Neo-79-kWh), [InsideEVs](https://insideevs.de/news/793140/vw-id3-neo-daten-preise/) |
| 000036 | BMW iX xDrive50 | aktuell → **veraltet** | Trim heißt auf EV Database iX xDrive 60. Modellstring belassen | [EVDB iX xDrive 60](https://ev-database.org/de/pkw/3110/BMW-iX-xDrive-60) |
| 000038 | Lexus RZ 450e | aktuell → **veraltet** | Cheatsheet: RZ 350e / 500e / 550e F SPORT, nicht 450e. Modellstring belassen | [EVDB Cheatsheet](https://ev-database.org/de/cheatsheet/range-electric-car) |
| 000015 | Cupra Born 170 kW | aktuell → **veraltet** | Cheatsheet: CUPRA Born Endurance / VZ / 58 kWh. Modellstring belassen | [EVDB Cheatsheet](https://ev-database.org/de/cheatsheet/range-electric-car) |
| 000079 | Zeekr 007 | aktuell → **veraltet** | Kein EU-Export als 007; Europa-Pendant Zeekr 7GT (DE ab 48.950 €) | [EVDB 7GT LR](https://ev-database.org/de/pkw/3429/Zeekr-7GT-Long-Range-RWD), [InsideEVs Zeekr DE](https://insideevs.de/news/780404/zeekr-deutschland-7x-001-x/) |
| 000047 | Honda e:Ny1 | veraltet → **eingestellt** | Kein in-kind-Nachfolger in DE; Super-N nur UK | [InsideEVs](https://insideevs.de/news/793116/honda-e:ny1-elektrosuv-ausgelaufen/) |
| 000071 | Lotus Evija | veraltet → **eingestellt** | Kleinstserie fertig, nicht auf EV Database | [ADAC](https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/lotus/lotus-evija/) |
| 000080 | Zeekr 009 | aktuell → **eingestellt** | Nicht im offiziellen DE-Programm (X, 001, 7X, 7GT), nicht auf EV Database | [InsideEVs Zeekr DE](https://insideevs.de/news/780404/zeekr-deutschland-7x-001-x/) |
| 000081 | Zeekr Mix | aktuell → **eingestellt** | Keine EU-Homologation / nicht im DE-Programm | [InsideEVs Zeekr DE](https://insideevs.de/news/780404/zeekr-deutschland-7x-001-x/) |

## Status bestätigt, kein Flip

| ID | Modell | Status | Quelle |
| --- | --- | --- | --- |
| 000026 | Dacia Spring Electric 45 | veraltet (bleibt) | Cheatsheet listet nur Spring Electric 70 und 100. Zeile **nicht** in 70/100 umbenannt. Nachfolger-URL auf EVDB 70 gesetzt. [EVDB Spring 70](https://ev-database.org/de/pkw/3408/Dacia-Spring-Electric-70) |
| 000007 | Hyundai Ioniq 5 77 kWh RWD | veraltet | Cheatsheet: IONIQ 5 84 kWh |
| 000008 | Hyundai Ioniq 6 77 kWh RWD | veraltet | Cheatsheet: IONIQ 6 84 kWh |
| 000009 | Kia EV6 77 kWh RWD | veraltet | Cheatsheet: EV6 84 kWh |
| 000010 | Mercedes EQA 250+ | veraltet | Cheatsheet: GLA 250+ / GLA 350 4MATIC statt EQA |
| 000031 | Mercedes EQB 250+ | veraltet | Cheatsheet: GLB 250+ / GLB 350 4MATIC statt EQB |
| 000059 | Audi Q8 e-tron 55 quattro | veraltet | nicht auf dem Cheatsheet |
| 000074 | Denza D9 EV | veraltet | nicht auf dem Cheatsheet (Europa PHEV) |
| 000124 | EQC 400 4MATIC | eingestellt | nicht auf dem Cheatsheet; GLC EQ = 000122 |

## Preis-Updates (alt → neu, DE-UVP)

| ID | Modell | alt € | neu € | Quelle |
| --- | --- | ---: | ---: | --- |
| 000102 | Opel Corsa Electric | 35 990 | **31 490** | [EVDB 54 kWh](https://ev-database.org/de/pkw/3221/Opel-Corsa-Electric-54-kWh) (50 kWh-Einstieg 29 990 €, nicht als basispreis genutzt, weil die Zeile der 54-kWh-Motorisierung entspricht) |
| 000021 | Mercedes EQE 350+ | 66 402 | **71 412** | [EVDB](https://ev-database.org/car/3240/Mercedes-Benz-EQE-350plus) Germany €71,412 |
| 000112 | Mercedes EQE SUV 350+ | 87 000 | **86 811** | [EVDB](https://ev-database.org/car/3284/Mercedes-Benz-EQE-SUV-350plus) Germany €86,811 |
| 000003 | Tesla Model 3 Long Range | 44 990 | **50 970** | Nachfolger-Trim Premium AWD, Modellstring belassen. [EVDB](https://ev-database.org/de/pkw/3405/Tesla-Model-3-Premium-AWD) |
| 000004 | Tesla Model Y Long Range | 49 990 | **54 970** | Nachfolger-Trim Premium AWD (Juniper). [EVDB](https://ev-database.org/de/pkw/3333/Tesla-Model-Y-Premium-AWD) |
| 000032 | Mercedes EQS 450+ | 94 403 | **108 635** | 94 403 € ist die UVP des EQS 400 (Facelift-Einstieg). 450+ laut EVDB 108 635 €. [EVDB EQS 450+](https://ev-database.org/de/pkw/3578/Mercedes-Benz-EQS-450plus) |

Zusätzlich bei 000021 / 000112 / 000032: Batterie/Leistung an MY25/MY26-Werte der gleichen EVDB-Seiten angeglichen (netto 96 kWh bzw. 122 kWh, Leistung, WLTP-Spanne, DC).

## Neue Zeilen (000130+)

Nur Modelle, die im Aug.-2026-Cheatsheet stehen **und** Kernfelder aus EVDB/Hersteller füllbar waren. Kein ID.2 / ID. Polo (trotz EVDB „Bestellbar seit Juli 2026“: Auftrag war, ID.2 nicht anzulegen, solange Quellen „ab Herbst 2026“ sagten). Kein Spring Electric 100 (70 als direkter 45er-Nachfolger reicht). Kein Zeekr 7GT als eigene Zeile (nur Nachfolger-Verweis an 000079).

| ID | Modell | UVP € | netto kWh | WLTP km | Antrieb | Quelle |
| --- | --- | ---: | ---: | --- | --- | --- |
| 000130 | Dacia Spring Electric 70 | 16 900 | 24,0 | 221–226 | FWD | [EVDB](https://ev-database.org/de/pkw/3408/Dacia-Spring-Electric-70); **UVP Essential 16 900 €** laut [Dacia-Preisliste ab 16.04.2026](https://cdn.group.renault.com/dac/de/vehicles/broschueren-download/pdf-neuer-spring/Dacia_Spring_Ph2_Electric_Preisliste.pdf.asset.pdf/6a0e59f89d.pdf). EVDB nennt 18 700 € (Expression). |
| 000131 | BYD Dolphin 60.4 kWh | 34 640 | 60,5 | 427 | FWD | [EVDB](https://ev-database.org/de/pkw/3297/BYD-DOLPHIN-604-kWh) |
| 000132 | Renault Twingo E-Tech 27.5 kWh | 19 990 | 27,5 | 251–263 | FWD | [EVDB](https://ev-database.org/de/pkw/3392/Renault-Twingo-E-Tech-275-kWh) |
| 000133 | Fiat Grande Panda | 24 990 | 43,8 | 314–322 | FWD | [EVDB](https://ev-database.org/de/pkw/2251/Fiat-Grande-Panda) |
| 000134 | Leapmotor B10 67.1 kWh | 32 400 | 65,0 | 435 | RWD | [EVDB](https://ev-database.org/de/pkw/3233/Leapmotor-B10-671-kWh) |

## Unchecked / bewusst unverändert

**Preise** der übrigen 122 Altzeilen: kein aktueller DE-UVP von Fahrzeugseite oder Hersteller eingetragen. Das schließt Volumenmodelle (iX1, ID.4/7, Atto 3, Seal, EV3, Macan, …) ein.

**Status aktuell belassen, aber nicht auf dem Pkw-Cheatsheet** (deshalb *nicht* auf eingestellt/veraltet gedreht — Evidenz reicht nicht oder Segment ist Van/Lkw/Camper):

- 000066 Tesla Model S Long Range und 000067 Model X Long Range — nicht auf dem Cheatsheet. 000067 hatte bereits den Hinweis „Produktionsstatus unsicher“. Oct.-2025-Meldungen über Comeback vs. Jul.-2025-Verkaufsstopp widersprechen sich; Hersteller-Konfigurator nicht hart verifiziert. Preis unchecked.
- 000063 Mercedes EQV 300 Long — Cheatsheet hat eVito Tourer, nicht EQV.
- 000075 Denza N7 (Hinweis war schon: nicht offiziell in DE), 000076 Denza Z9 GT, 000123 Denza Z — nicht auf dem Cheatsheet; Z9-GT-Hinweis zu April-2026-Marktstart belassen.
- Campers 000086–000089, Lkw 000090–000097, 000125 Farizon SV: laut Auftrag unverändert.

**Nicht angelegt (bewusst):** Volkswagen ID.2 / ID. Polo, Dacia Spring Electric 100, Zeekr 7GT, Hyundai IONIQ 3 (EVDB: „Voraussichtlich bestellbar ab September 2026“), Hypercars.

**Namens-Fuzzy-Matches, Modellstring belassen** (Status aktuell, nur Hinweis/Preis wo oben): Tesla Model 3/Y „Long Range“ ↔ Premium AWD; VW ID.4 Pro, ID.7 Pro S, ID.5 Pro; Polestar 2/3/4; Skoda Enyaq 85 / Elroq 85; Kia EV3 / EV5 / EV9 / PV5 / EV2; BMW iX1/i4/i5/i7/iX3/iX2; u. a. — alle auf dem Cheatsheet unter leicht abweichendem Trim-Namen.

## Methode

1. Live-Katalog [ev-database.org/de/cheatsheet/range-electric-car](https://ev-database.org/de/cheatsheet/range-electric-car) (29.08.2026).
2. Einzelne EV-Database-Fahrzeugseiten (DE + EN für Country-Preis Germany) per HTTP, plus Hersteller/ADAC/InsideEVs für Status.
3. Kein Runtime-Import von tschelle.github.io.
