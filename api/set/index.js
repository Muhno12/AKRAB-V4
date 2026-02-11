import { Redis } from "@upstash/redis";
import { normName, requireAdminKey, deny } from "../_utils.js";
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return deny(res, 405, "Method not allowed");
    if (!requireAdminKey(req, res)) return;

    const { nama_produk, status } = req.body || {};
    const name = normName(nama_produk || "");
    if (!name) return deny(res, 400, "nama_produk wajib");

    const s = (status || "ON").toString().toUpperCase();
    if (!["ON", "OFF"].includes(s)) return deny(res, 400, "status harus ON/OFF");

    await redis.set("prod:" + name, s);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
}
