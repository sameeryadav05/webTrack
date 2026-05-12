/**
 * Normalizes a raw IP string from X-Forwarded-For, socket.remoteAddress, etc.
 * geoip-lite requires a single address, not a comma-separated proxy chain.
 */
export function normalizeIpFromString(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;

  const first = s.split(",")[0].trim();
  if (!first) return null;

  const noZone = first.split("%")[0].trim();

  if (noZone.startsWith("::ffff:")) {
    return noZone.slice(7);
  }

  if (noZone.startsWith("[") && noZone.includes("]")) {
    const end = noZone.indexOf("]");
    return noZone.slice(1, end);
  }

  return noZone;
}

export function getClientIpFromRequest(req) {
  const forwarded = req.headers["x-forwarded-for"];
  let raw = null;
  if (typeof forwarded === "string") {
    raw = forwarded;
  } else if (Array.isArray(forwarded) && forwarded.length > 0) {
    raw = forwarded[0];
  }

  const fromHeader = normalizeIpFromString(raw);
  if (fromHeader) return fromHeader;

  const ra = req.socket?.remoteAddress;
  return normalizeIpFromString(ra);
}
