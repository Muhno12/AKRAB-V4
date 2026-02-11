export function normName(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function deny(res, code, msg) {
  res.status(code).json({ ok: false, msg });
}

export function requireAdminKey(req, res) {
  const got = req.headers["x-admin-key"];
  const want = process.env.ADMIN_KEY;

  if (!want) {
    deny(res, 500, "ADMIN_KEY belum diset di Vercel env");
    return false;
  }
  if (!got || got !== want) {
    deny(res, 401, "Unauthorized (admin key salah)");
    return false;
  }
  return true;
}
