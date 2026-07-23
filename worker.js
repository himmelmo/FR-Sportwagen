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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
            });
          }
        }

        const absender = form.get("E-Mail") || "";
        const marke = form.get("Marke und Modell") || "";

        const payload = {
          from: "FR Sportwagen Website <formular@frsportwagen.de>",
          to: ["kontakt@frsportwagen.de"],
          subject: (typ + (marke ? ": " + marke : "")).trim(),
          text:
            "Neue " + typ + " über die Website:\n\n" +
            lines.join("\n") +
            (attachments.length ? "\n\nFotos im Anhang: " + attachments.length : ""),
          attachments: attachments,
        };
        if (absender) payload.reply_to = absender;

        const resp = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + env.RESEND_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          return json({ error: "E-Mail-Versand fehlgeschlagen" }, 502);
        }
        return json({ ok: true });
      } catch (e) {
        return json({ error: "Ungültige Anfrage" }, 400);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
