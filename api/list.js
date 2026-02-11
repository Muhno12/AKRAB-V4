import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    const keys = await redis.keys("prod:*");
    const out = {};
    for (const k of keys) {
      const val = await redis.get(k);
      out[k.replace("prod:", "")] = (val || "ON").toString().toUpperCase();
    }
    res.status(200).json({ ok: true, data: out });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
}
