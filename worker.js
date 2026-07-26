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

/* ---------------------------------------------------------------------------
   Wartungsmodus

   Ist WARTUNG in wrangler.jsonc auf "an" gesetzt, sehen Besucher nur eine
   Hinweisseite. Freigeschaltet wird das eigene Geraet einmalig ueber
   https://frsportwagen.de/freischalten?key=DEIN_SCHLUESSEL
   Danach liegt ein Cookie fuer ein Jahr auf dem Geraet, unabhaengig von der IP.

   Im Code steht nur der doppelte SHA-256-Hash des Schluessels. Aus ihm laesst
   sich weder der Schluessel noch der Cookie-Wert zurueckrechnen, das Repo darf
   also oeffentlich bleiben.
--------------------------------------------------------------------------- */
const ZUGANG_COOKIE = "fr_zugang";

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function gleich(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function cookieLesen(request, name) {
  const kopf = request.headers.get("Cookie") || "";
  for (const teil of kopf.split(";")) {
    const [k, ...rest] = teil.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return "";
}

async function darfRein(request, env) {
  if (!env.WARTUNG_HASH) return true;
  const wert = cookieLesen(request, ZUGANG_COOKIE);
  if (!wert) return false;
  return gleich(await sha256Hex(wert), env.WARTUNG_HASH);
}

function wartungsseite() {
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>FR Sportwagen</title>
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"Segoe UI",system-ui,-apple-system,sans-serif;color:#fff;background:linear-gradient(160deg,#0a0a0a 0%,#1c1c1c 55%,#0a0a0a 100%);line-height:1.6;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem 1.5rem;text-align:center}
.box{width:min(520px,100%)}
.logo{display:block;margin:0 auto 2.5rem;width:180px;fill:#fff}
h1{font-size:clamp(1.4rem,3vw,1.9rem);font-weight:600;line-height:1.25}
p{color:#c9c9c9;margin-top:1rem}
.kontakt{margin-top:2.5rem;padding-top:2rem;border-top:1px solid rgba(255,255,255,0.12);font-size:0.95rem}
.kontakt a{color:#d8d8d8;text-decoration:none}
.kontakt a:hover{color:#fff}
</style>
</head>
<body>
<div class="box">
<svg class="logo" viewBox="130 390 825 300" role="img" aria-label="FR Sportwagen"><path d="M899.35,401.75h-266.23l-.12.21h-334.1l-159.52,276.3h107.72l42.85-74.21h192.86l46.65-80.79h-192.86l19.47-33.72h226.38l-108.84,188.52h107.72l38.93-67.43h96.21l13.08,67.43h114.71l-15.49-77.5c22.96-8.43,44.91-21.17,65.42-37.83,20.83-16.86,37.3-35.77,49.29-56.53,33.82-57.15,13.16-105.05-44.14-104.43ZM835.56,506.19c-3.68,6.37-9.15,11.92-16.6,16.65-7.13,4.52-13.99,6.78-20.57,6.78h-131.37l27.18-47.08h131.37c13.16,0,17.59,10.48,9.99,23.64Z"/></svg>
<h1>Die Website ist gerade im Umbau.</h1>
<p>In Kürze finden Sie hier wieder auserwählte und exklusive Sportwagen. Bis dahin erreichen Sie mich jederzeit persönlich.</p>
<p class="kontakt">
Mobil <a href="tel:+4915115491199">+49&nbsp;151&nbsp;15491199</a><br>
Festnetz <a href="tel:+4964329240761">+49&nbsp;6432&nbsp;9240761</a><br>
<a href="mailto:kontakt@frsportwagen.de">kontakt@frsportwagen.de</a>
</p>
</div>
</body>
</html>`;
  return new Response(html, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Retry-After": "86400",
    },
  });
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

function euro(zahl) {
  return zahl.toLocaleString("de-DE", { maximumFractionDigits: 0 }) + " €";
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
  return euro(zahl);
}

/* MwSt-Kennzeichnung automatisch aus den mobile.de-Preisdaten:
   - vatRate vorhanden (gewerblich): "inkl. 19 % MwSt." + Netto-Preis darunter
   - sonst (privat angekauft): differenzbesteuert nach § 25a UStG */
function preisSteuer(ad) {
  const p = ad.price || {};
  const vatRate = parseFloat(p.vatRate || p.vat || "");
  if (vatRate > 0) {
    const brutto = parseFloat(String(p.consumerPriceGross || "").replace(",", "."));
    let netto = parseFloat(String(p.consumerPriceNet || "").replace(",", "."));
    if (!netto && brutto) netto = brutto / (1 + vatRate / 100);
    return {
      hinweis: "inkl. " + Math.round(vatRate) + " % MwSt.",
      netto: netto ? "Netto: " + euro(netto) : "",
    };
  }
  return { hinweis: "(differenzbesteuert nach § 25a UStG)", netto: "" };
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
      preisHinweis: preisSteuer(ad).hinweis,
      preisNetto: preisSteuer(ad).netto,
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

    /* Geraet freischalten: einmal aufrufen, danach gilt das Cookie ein Jahr */
    if (url.pathname === "/freischalten") {
      const key = url.searchParams.get("key") || "";
      const wert = await sha256Hex(key);
      if (!env.WARTUNG_HASH || !gleich(await sha256Hex(wert), env.WARTUNG_HASH)) {
        return new Response("Schlüssel ungültig.", {
          status: 403,
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
        });
      }
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
          "Cache-Control": "no-store",
          "Set-Cookie":
            ZUGANG_COOKIE + "=" + wert +
            "; Path=/; Max-Age=31536000; Secure; HttpOnly; SameSite=Lax",
        },
      });
    }

    /* Geraet abmelden */
    if (url.pathname === "/abmelden") {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
          "Cache-Control": "no-store",
          "Set-Cookie": ZUGANG_COOKIE + "=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax",
        },
      });
    }

    /* Das Logo im Browser-Tab darf die Wartungsseite mitbenutzen */
    const wartungFrei = url.pathname === "/assets/favicon.svg";

    if (env.WARTUNG === "an" && !wartungFrei && !(await darfRein(request, env))) {
      return wartungsseite();
    }

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
