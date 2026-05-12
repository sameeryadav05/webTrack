import geopip from "geoip-lite";
import { normalizeIpFromString } from "./clientIp.js";

const isLocalOrUnusable = (ip) => {
  if (!ip) return true;
  if (ip === "::1" || ip === "127.0.0.1") return true;
  return false;
};

/**
 * @param {string | null | undefined} ip
 * @returns {{ country: string | null, city: string | null }}
 * `country` is ISO 3166-1 alpha-2 when known (geoip-lite format).
 */
const getLocation = (ip) => {
  const normalized = normalizeIpFromString(ip);
  if (isLocalOrUnusable(normalized)) {
    return { country: null, city: null };
  }

  const geo = geopip.lookup(normalized);
  if (!geo || !geo.country) {
    return { country: null, city: null };
  }

  const city =
    geo.city && String(geo.city).trim() ? String(geo.city).trim() : null;

  return {
    country: geo.country,
    city,
  };
};

export default getLocation;
