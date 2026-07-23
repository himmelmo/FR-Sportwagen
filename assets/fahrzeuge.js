/* FR Sportwagen – Fahrzeugdaten.
   Struktur angelehnt an die mobile.de Search-API. Aktuell Testdaten mit Beispielbildern;
   sobald die API-Zugangsdaten im Cloudflare-Dashboard hinterlegt sind, liefert der Worker
   diese Daten automatisch aus den echten Inseraten (Haendlernummer 45483682). */
window.FR_FAHRZEUGE = [
  {
    id: 'a5-cabrio-tdi',
    marke: 'Audi',
    titel: 'A5 Cabrio 3.0 TDI',
    untertitel: 'S-Line Plus · Bang & Olufsen · Vollausstattung',
    preis: '22.870 €',
    preisHinweis: '(Brutto)',
    bilder: [
      'assets/demo/wagen-front.svg',
      'assets/demo/wagen-seite.svg',
      'assets/demo/wagen-heck.svg',
      'assets/demo/wagen-cockpit.svg',
      'assets/demo/wagen-sitze.svg',
      'assets/demo/wagen-tacho.svg'
    ],
    /* Die wichtigsten ~12 Fakten fuer das Scroll-Erlebnis, in Anzeige-Reihenfolge */
    topFakten: [
      ['Erstzulassung', '02/2016'],
      ['Kilometerstand', '84.911 km'],
      ['Leistung', '180 kW (245 PS)'],
      ['Getriebe', 'Automatik'],
      ['Kraftstoffart', 'Diesel'],
      ['Schadstoffklasse', 'Euro 6'],
      ['Antriebsart', 'Allrad (quattro)'],
      ['Farbe', 'Daytonagrau Perleffekt'],
      ['Innenausstattung', 'Vollleder Schwarz'],
      ['Anzahl der Fahrzeughalter', '1'],
      ['HU', 'Neu'],
      ['Ausstattungslinie', '3.0 TDI clean diesel quattro']
    ],
    /* Vollstaendiges Datenblatt fuer die Uebersicht darunter */
    alleDaten: [
      ['FIN', 'WAUZZZ8F7GN007001'],
      ['Interne Nummer', 'A5S'],
      ['Erstzulassung', '02/2016'],
      ['Kilometerstand', '84.911 km'],
      ['Leistung', '180 kW (245 PS)'],
      ['Getriebe', 'Automatik'],
      ['Kraftstoffart', 'Diesel'],
      ['Umweltplakette', '4 (Grün)'],
      ['Schadstoffklasse', 'Euro 6'],
      ['Hubraum', '2.967 cm³'],
      ['Zylinder', '6'],
      ['Antriebsart', 'Allrad'],
      ['Anzahl Sitzplätze', '4'],
      ['Türen', '2/3'],
      ['Farbe', 'Grau (Metallic)'],
      ['Farbe (Hersteller)', 'Daytonagrau Perleffekt'],
      ['Innenausstattung', 'Vollleder'],
      ['Farbe der Innenausstattung', 'Schwarz'],
      ['Anzahl der Fahrzeughalter', '1'],
      ['HU', 'Neu'],
      ['Beschädigtes Fahrzeug', 'Nein'],
      ['Fahrtauglich', 'Ja'],
      ['Klimatisierung', 'Klimaautomatik'],
      ['Einparkhilfe', 'Vorne, Hinten, Kamera'],
      ['Geschwindigkeitsregulierung', 'Abstandstempomat'],
      ['Airbags', 'Front- und Seiten-Airbags'],
      ['Hauptscheinwerfer', 'Bi-Xenon'],
      ['Tagfahrlicht', 'LED-Tagfahrlicht'],
      ['Kurvenlicht', 'Adaptives Kurvenlicht'],
      ['Anhängerkupplung', 'Abnehmbar'],
      ['Anhängelast gebremst', '1.900 kg'],
      ['Ausstattungslinie', '3.0 TDI clean diesel quattro'],
      ['Baureihe', '8F']
    ]
  }
];
