import { Redis } from "@upstash/redis";
import { normName } from "./_utils.js";
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    const name = normName(req.query.nama_produk || "");
    if (!name) return res.status(400).json({ ok: false, msg: "nama_produk wajib" });

    const val = await redis.get("prod:" + name);
    res.status(200).json({ ok: true, nama: name, status: (val || "ON").toString().toUpperCase() });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
}
