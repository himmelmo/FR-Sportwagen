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
  const imgs = (ad.images && (ad.images.image || ad.images)) || [];
  const liste = Array.isArray(imgs) ? imgs : [imgs];
  for (const img of liste) {
    if (!img) continue;
    if (typeof img === "string") { urls.push(img); continue; }
    const reps = img.representation || img.representations || [];
    const repListe = Array.isArray(reps) ? reps : [reps];
    let beste = null;
    for (const rep of repListe) {
      const url = rep["@url"] || rep.url;
      const size = rep["@size"] || rep.size || "";
      if (!url) continue;
      if (!beste || size === "XXL" || (size === "XL" && beste.size !== "XXL")) {
        beste = { url, size };
      }
    }
    if (beste) {
      urls.push(beste.url.startsWith("http") ? beste.url : "https:" + beste.url);
    } else if (img.ref) {
      let ref = String(img.ref);
      if (!ref.startsWith("http")) ref = "https:" + ref;
      if (ref.includes("classistatic") && !ref.includes("?")) ref += "?rule=mo-1024.jpg";
      urls.push(ref);
    }
  }
  return urls;
}

function mapAd(ad) {
  try {
    const id = String(ad.mobileAdId || ad["@key"] || ad.id || ad.internalNumber || "");
    const marke = titleCase(ad.make || (ad.vehicle && ad.vehicle.make) || "");
    const modell = ad.model || (ad.vehicle && ad.vehicle.model) || "";
    const beschreibung = ad.modelDescription || (ad.vehicle && ad.vehicle.modelDescription) || "";
    const titel = (beschreibung || modell || "Fahrzeug").trim();
    const bilder = bilderVonAd(ad);

    const fakten = [];
    const push = (label, wert) => { if (wert) fakten.push([label, wert]); };
    push("Erstzulassung", erstzulassung(ad.firstRegistration));
    push("Kilometerstand", kmFormat(ad.mileage));
    push("Leistung", leistungFormat(ad.power));
    push("Getriebe", GETRIEBE[ad.gearbox] || ad.gearbox);
    push("Kraftstoffart", KRAFTSTOFF[ad.fuel] || ad.fuel);
    push("Schadstoffklasse", (ad.emissionClass || "").replace("EURO", "Euro "));
    push("Farbe (Hersteller)", ad.manufacturerColorName);
    push("Farbe", ad.exteriorColor);
    push("Innenausstattung", ad.interiorType);
    push("Anzahl der Fahrzeughalter", ad.numberOfPreviousOwners);
    push("Anzahl Sitzplätze", ad.seats);
    push("Türen", ad.doorCount);

    const alleDaten = fakten.slice();
    const pushAll = (label, wert) => { if (wert) alleDaten.push([label, wert]); };
    pushAll("Hubraum", ad.cubicCapacity ? Number(ad.cubicCapacity).toLocaleString("de-DE") + " cm³" : "");
    pushAll("Klimatisierung", ad.climatisation);
    pushAll("Einparkhilfe", Array.isArray(ad.parkAssists) ? ad.parkAssists.join(", ") : ad.parkAssists);
    pushAll("Kategorie", ad.category);

    return {
      id: id || (marke + "-" + titel).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      marke,
      titel,
      untertitel: beschreibung !== titel ? beschreibung : "",
      preis: preisFormat(ad),
      preisHinweis: "(Brutto)",
      bilder,
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
        const kandidaten = [
          "https://services.mobile.de/seller-api/sellers/" + MOBILE_KUNDENNUMMER + "/ads",
          "https://services.mobile.de/search-api/search?customerNumber=" + MOBILE_KUNDENNUMMER + "&page.size=100",
        ];
        const headers = {
          Authorization: "Basic " + btoa(env.MOBILEDE_USER + ":" + env.MOBILEDE_PASSWORD),
          Accept: "application/vnd.de.mobile.api+json",
        };
        let daten = null;
        let letzterStatus = 0;
        for (const apiUrl of kandidaten) {
          const resp = await fetch(apiUrl, { headers, cf: { cacheTtl: 600, cacheEverything: true } });
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
        if (url.searchParams.get("debug") === "1") {
          return json({
            anzahl: adListe.length,
            felderErstesInserat: adListe[0] ? Object.keys(adListe[0]) : [],
          });
        }
        const fahrzeuge = adListe.map(mapAd).filter(Boolean);
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
