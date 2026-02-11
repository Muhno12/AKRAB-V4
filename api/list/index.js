import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  // ✅ CORS harus di dalam handler
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-key");

  // ✅ preflight
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const keys = await redis.keys("prod:*");
    const out = {};

    for (const k of keys) {
      const val = await redis.get(k);
      out[k.replace("prod:", "")] = (val || "ON").toString().toUpperCase();
    }

    return res.status(200).json({ ok: true, data: out });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
