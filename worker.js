import { WorkerMailer } from "worker-mailer";

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

const MOBILE_KUNDENNUMMER = "45483682";

const GETRIEBE = {
  AUTOMATIC_GEAR: "Automatik",
  SEMIAUTOMATIC_GEAR: "Halbautomatik",
  MANUAL_GEAR: "Schaltgetriebe",
};
const KRAFTSTOFF = {
  PETROL: "Benzin",
  DIESEL: "Diesel",
  ELECTRICITY: "Elektro",
  HYBRID: "Hybrid (Benzin/Elektro)",
  HYBRID_DIESEL: "Hybrid (Diesel/Elektro)",
  LPG: "Autogas (LPG)",
  CNG: "Erdgas (CNG)",
};
const FARBEN = {
  BLACK: "Schwarz", GREY: "Grau", WHITE: "Weiß", SILVER: "Silber", BLUE: "Blau",
  RED: "Rot", GREEN: "Grün", YELLOW: "Gelb", ORANGE: "Orange", BROWN: "Braun",
  BEIGE: "Beige", GOLD: "Gold", PURPLE: "Violett",
};
const INTERIEUR = {
  LEATHER: "Vollleder", PARTIAL_LEATHER: "Teilleder", FABRIC: "Stoff",
  ALCANTARA: "Alcantara", VELOUR: "Velours", OTHER_INTERIOR_TYPE: "Sonstige",
};
const TUEREN = { TWO_OR_THREE: "2/3", FOUR_OR_FIVE: "4/5", SIX_OR_SEVEN: "6/7" };
const ANTRIEB = { ALL_WHEEL: "Allrad", FRONT: "Frontantrieb", REAR: "Heckantrieb" };
const KLIMA = {
  AUTOMATIC_CLIMATISATION: "Klimaautomatik",
  MANUAL_CLIMATISATION: "Klimaanlage",
  NO_CLIMATISATION: "Keine",
};
const PARKHILFE = {
  REAR_VIEW_CAM: "Rückfahrkamera", FRONT_SENSORS: "Sensoren vorne",
  REAR_SENSORS: "Sensoren hinten", CAM_360_DEGREES: "360°-Kamera",
  AUTOMATIC_PARKING: "Einparkautomatik",
};
const TEMPOMAT = {
  ADAPTIVE_CRUISE_CONTROL: "Abstandstempomat",
  CRUISE_CONTROL: "Tempomat",
};
const SCHEINWERFER = {
  BI_XENON_HEADLIGHTS: "Bi-Xenon", XENON_HEADLIGHTS: "Xenon",
  LED_HEADLIGHTS: "LED", LASER_HEADLIGHTS: "Laserlicht",
};
const AIRBAGS = {
  FRONT_AND_SIDE_AIRBAGS: "Front- und Seiten-Airbags",
  FRONT_AIRBAGS: "Front-Airbags",
  FRONT_AND_SIDE_AND_MORE_AIRBAGS: "Front-, Seiten- und weitere Airbags",
  DRIVER_AIRBAG: "Fahrer-Airbag",
};
const KUPPLUNG = {
  TRAILER_COUPLING_DETACHABLE: "Abnehmbar",
  TRAILER_COUPLING_FIX: "Starr",
  TRAILER_COUPLING_SWIVELING: "Schwenkbar",
};
const PLAKETTE = {
  EMISSIONSSTICKER_GREEN: "4 (Grün)",
  EMISSIONSSTICKER_YELLOW: "3 (Gelb)",
  EMISSIONSSTICKER_RED: "2 (Rot)",
};
const ZUSTAND = { NEW: "Neuwagen", USED: "Gebraucht" };

function entitiesDecode(s) {
  return String(s || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[<>]/g, "");
}

function erstzulassung(wert) {
  const s = String(wert || "");
  return s.length >= 6 ? s.slice(4, 6) + "/" + s.slice(0, 4) : s;
}

function kmFormat(wert) {
  return typeof wert === "number" ? wert.toLocaleString("de-DE") + " km" : "";
}

function leistungFormat(kw) {
  return typeof kw === "number" ? kw + " kW (" + Math.round(kw * 1.35962) + " PS)" : "";
}

function preisFormat(ad) {
  const p = ad.price || {};
  const betrag =
    p.consumerPriceGross || p.consumerPriceAmount || p.grossAmount || p.amount ||
    (p.consumerPrice && (p.consumerPrice.amount || p.consumerPrice)) ||
    (typeof p === "string" ? p : null);
  if (!betrag) return "Preis auf Anfrage";
  const zahl = parseFloat(String(betrag).replace(",", "."));
  if (isNaN(zahl)) return String(betrag);
  return zahl.toLocaleString("de-DE", { maximumFractionDigits: 0 }) + " €";
}

function titleCase(s) {
  const wert = String(s || "").replace(/[_-]+/g, " ").trim();
  if (!wert) return "";
  if (wert !== wert.toUpperCase()) return wert;
  return wert
    .toLowerCase()
    .split(" ")
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function bilderVonAd(ad) {
  const urls = [];
  const liste = Array.isArray(ad.images) ? ad.images : [];
  for (const img of liste) {
    if (!img) continue;
    const url = img.xxxl || img.xxl || img.xl || img.l || img.m;
    if (url) urls.push(url);
  }
  return urls;
}

function jaNein(wert) {
  if (wert === true) return "Ja";
  if (wert === false) return "Nein";
  return "";
}

function mapAd(ad) {
  try {
    const id = String(ad.mobileAdId || ad.internalNumber || "");
    const marke = titleCase(ad.make || "");

    /* modelDescription wie "A5 Cabrio 3.0 TDI | S-Line Plus | ..." aufteilen */
    const beschreibung = entitiesDecode(ad.modelDescription || ad.model || "Fahrzeug");
    /* Trenner: "|" oder alleinstehendes grosses I (z. B. "Taycan GTS I PTS I Carbon") */
    const teile = beschreibung.split(/\s*\|\s*|\s+I\s+/).map((t) => t.trim()).filter(Boolean);
    const titel = teile[0] || "Fahrzeug";
    const untertitel = teile.slice(1).join(" · ");

    const bilder = bilderVonAd(ad);

    const farbe = FARBEN[ad.exteriorColor] || titleCase(ad.exteriorColor || "");
    const farbeMitMetallic = farbe ? farbe + (ad.metallic ? " (Metallic)" : "") : "";
    const innen = [INTERIEUR[ad.interiorType] || "", FARBEN[ad.interiorColor] || ""]
      .filter(Boolean).join(" ");

    const fakten = [];
    const push = (label, wert) => { if (wert) fakten.push([label, String(wert)]); };
    push("Erstzulassung", erstzulassung(ad.firstRegistration));
    push("Kilometerstand", kmFormat(ad.mileage));
    push("Leistung", leistungFormat(ad.power));
    push("Getriebe", GETRIEBE[ad.gearbox] || ad.gearbox);
    push("Kraftstoffart", KRAFTSTOFF[ad.fuel] || ad.fuel);
    push("Antriebsart", ANTRIEB[ad.driveType] || "");
    push("Schadstoffklasse", (ad.emissionClass || "").replace("EURO", "Euro "));
    push("Farbe", ad.manufacturerColorName ? entitiesDecode(ad.manufacturerColorName) : farbeMitMetallic);
    push("Innenausstattung", innen);
    push("Anzahl der Fahrzeughalter", ad.numberOfPreviousOwners);
    push("HU", ad.newHuAu ? "Neu" : "");
    push("Kategorie", ad.category);

    const alleDaten = [];
    const pushAll = (label, wert) => { if (wert) alleDaten.push([label, String(wert)]); };
    fakten.forEach((f) => pushAll(f[0], f[1]));
    pushAll("Zustand", ZUSTAND[ad.condition] || "");
    pushAll("Interne Nummer", ad.internalNumber);
    pushAll("Hubraum", ad.cubicCapacity ? Number(ad.cubicCapacity).toLocaleString("de-DE") + " cm³" : "");
    pushAll("Türen", TUEREN[ad.doors] || "");
    pushAll("Anzahl Sitzplätze", ad.seats);
    pushAll("Umweltplakette", PLAKETTE[ad.emissionSticker] || "");
    pushAll("Farbe (Hersteller)", ad.manufacturerColorName ? farbeMitMetallic : "");
    pushAll("CO₂ kombiniert", ad.emissions && ad.emissions.combined && ad.emissions.combined.co2 ? ad.emissions.combined.co2 + " g/km" : "");
    pushAll("CO₂-Klasse", ad.emissions && ad.emissions.combined && ad.emissions.combined.co2Class);
    pushAll("Verbrauch kombiniert", ad.consumptions && ad.consumptions.fuel && ad.consumptions.fuel.combined ? String(ad.consumptions.fuel.combined).replace(".", ",") + " l/100 km" : "");
    pushAll("Klimatisierung", KLIMA[ad.climatisation] || "");
    pushAll("Einparkhilfe", Array.isArray(ad.parkingAssistants) ? ad.parkingAssistants.map((p) => PARKHILFE[p] || p).join(", ") : "");
    pushAll("Geschwindigkeitsregulierung", TEMPOMAT[ad.speedControl] || "");
    pushAll("Airbags", AIRBAGS[ad.airbag] || "");
    pushAll("Hauptscheinwerfer", SCHEINWERFER[ad.headlightType] || "");
    pushAll("Tagfahrlicht", ad.daytimeRunningLamps === "LED_RUNNING_LIGHTS" ? "LED-Tagfahrlicht" : "");
    pushAll("Kurvenlicht", ad.bendingLightsType === "ADAPTIVE_BENDING_LIGHTS" ? "Adaptives Kurvenlicht" : "");
    pushAll("Anhängerkupplung", KUPPLUNG[ad.trailerCouplingType] || "");
    pushAll("Pannenhilfe", ad.breakdownService === "REPAIR_KIT" ? "Pannenkit" : "");
    pushAll("Scheckheftgepflegt", jaNein(ad.fullServiceHistory));
    pushAll("Nichtraucherfahrzeug", jaNein(ad.nonSmokerVehicle));
    pushAll("Unfallfahrzeug", jaNein(ad.accidentDamaged));
    pushAll("Beschädigtes Fahrzeug", jaNein(ad.damageUnrepaired));
    pushAll("Fahrtauglich", jaNein(ad.roadworthy));
    pushAll("Navigationssystem", jaNein(ad.navigationSystem));
    pushAll("Soundsystem", jaNein(ad.soundSystem));
    pushAll("Sitzheizung", jaNein(ad.electricHeatedSeats));

    return {
      id: id || (marke + "-" + titel).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      marke,
      titel,
      untertitel,
      preis: preisFormat(ad),
      preisHinweis: "(Brutto)",
      bilder,
      mobileUrl: ad.detailPageUrl || "",
      topFakten: fakten.slice(0, 12),
      alleDaten,
    };
  } catch (e) {
    return null;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/fahrzeuge") {
      if (request.method !== "GET") {
        return json({ error: "Methode nicht erlaubt" }, 405);
      }
      if (!env.MOBILEDE_USER || !env.MOBILEDE_PASSWORD) {
        return json({ error: "mobile.de-Zugang nicht konfiguriert" }, 503);
      }
      try {
        /* Der Einbindungs-Benutzer (dlr_) ist serverseitig auf den eigenen Bestand
           beschraenkt — ein customerNumber-Parameter wird mit 405 abgelehnt. */
        const kandidaten = [
          "https://services.mobile.de/search-api/search?page.size=100",
        ];
        const headers = {
          Authorization: "Basic " + btoa(env.MOBILEDE_USER + ":" + env.MOBILEDE_PASSWORD),
          Accept: "application/vnd.de.mobile.api+json",
          "User-Agent": "FR-Sportwagen-Website/1.0 (frsportwagen.de)",
        };
        let daten = null;
        let letzterStatus = 0;
        for (const apiUrl of kandidaten) {
          const resp = await fetch(apiUrl, { headers });
          letzterStatus = resp.status;
          if (resp.ok) {
            daten = await resp.json();
            break;
          }
        }
        if (!daten) {
          return json({ error: "mobile.de antwortet nicht (" + letzterStatus + ")" }, 502);
        }
        const ads =
          (daten.searchResult && daten.searchResult.ads && daten.searchResult.ads.ad) ||
          (daten.searchResult && daten.searchResult.ads) ||
          daten.ads ||
          (Array.isArray(daten) ? daten : []);
        const adListe = (Array.isArray(ads) ? ads : [ads]).filter(Boolean);

        /* Die Listen-Abfrage enthaelt nur das erste Foto je Inserat —
           der Einzelabruf liefert alle Fotos. */
        const details = await Promise.all(
          adListe.map(async (ad) => {
            try {
              const r = await fetch(
                "https://services.mobile.de/search-api/ad/" + ad.mobileAdId,
                { headers }
              );
              if (!r.ok) return ad;
              const voll = await r.json();
              return Object.assign({}, ad, voll, {
                images: (voll.images && voll.images.length ? voll.images : ad.images) || [],
              });
            } catch (e) {
              return ad;
            }
          })
        );

        const fahrzeuge = details.map(mapAd).filter(Boolean);
        return new Response(JSON.stringify(fahrzeuge), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=300",
          },
        });
      } catch (e) {
        return json({ error: "Abruf fehlgeschlagen" }, 502);
      }
    }

    if (url.pathname === "/api/anfrage") {
      if (request.method !== "POST") {
        return json({ error: "Methode nicht erlaubt" }, 405);
      }
      try {
        const form = await request.formData();
        const typ = form.get("_typ") || "Anfrage";
        const lines = [];
        const attachments = [];

        for (const [key, value] of form.entries()) {
          if (key.startsWith("_")) continue;
          if (typeof value === "string") {
            if (value.trim()) lines.push(key + ": " + value.trim());
          } else if (value && value.size > 0) {
            if (value.size > 10 * 1024 * 1024) {
              return json({ error: "Ein Foto ist zu groß (max. 10 MB): " + key }, 413);
            }
            const ext = (value.name.match(/\.[a-zA-Z0-9]+$/) || [".jpg"])[0];
            attachments.push({
              filename: key.replace(/[^a-zA-Z0-9 _-]/g, "") + ext,
              content: toBase64(await value.arrayBuffer()),
              type: value.type || "application/octet-stream",
            });
          }
        }

        const absender = (form.get("E-Mail") || "").trim();
        const marke = (form.get("Marke und Modell") || "").trim();

        const mailer = await WorkerMailer.connect({
          host: "smtp.ionos.de",
          port: 587,
          secure: false,
          startTls: true,
          authType: "plain",
          credentials: {
            username: env.SMTP_USER,
            password: env.SMTP_PASS,
          },
        });

        await mailer.send({
          from: { name: "FR Sportwagen Website", email: env.SMTP_USER },
          to: { email: "kontakt@frsportwagen.de" },
          reply: absender ? { email: absender } : undefined,
          subject: (typ + (marke ? ": " + marke : "")).trim(),
          text:
            "Neue " + typ + " über die Website:\n\n" +
            lines.join("\n") +
            (attachments.length ? "\n\nFotos im Anhang: " + attachments.length : ""),
          attachments: attachments.length ? attachments : undefined,
        });

        return json({ ok: true });
      } catch (e) {
        return json({ error: "E-Mail-Versand fehlgeschlagen" }, 502);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
