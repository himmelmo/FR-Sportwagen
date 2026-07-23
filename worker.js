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
