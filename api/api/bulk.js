import { Redis } from "@upstash/redis";
import { normName, requireAdminKey, deny } from "./_utils.js";
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return deny(res, 405, "Method not allowed");
    if (!requireAdminKey(req, res)) return;

    const { items } = req.body || {};
    if (!Array.isArray(items)) return deny(res, 400, "items harus array");

    let okCount = 0;
    for (const it of items) {
      const name = normName(it?.nama_produk || "");
      const s = (it?.status || "ON").toString().toUpperCase();
      if (!name) continue;
      if (!["ON", "OFF"].includes(s)) continue;

      await redis.set("prod:" + name, s);
      okCount++;
    }

    res.status(200).json({ ok: true, updated: okCount });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
}
