import {
  FaBrave,
  FaChrome,
  FaEdge,
  FaFirefoxBrowser,
  FaInternetExplorer,
  FaOpera,
  FaSafari,
} from 'react-icons/fa6';
import { SiDuckduckgo, SiSamsung } from 'react-icons/si';

/**
 * Maps ua-parser-js `browser.name` strings (and close variants) to a brand icon component.
 * @param {string | null | undefined} name
 * @returns {import('react').ComponentType<{ className?: string; size?: number; title?: string }> | null}
 */
export function getBrowserIcon(name) {
  const n = (name || '').trim().toLowerCase();
  if (!n || n === 'unknown') return null;

  if (n.includes('duckduckgo')) return SiDuckduckgo;
  if (n.includes('samsung')) return SiSamsung;
  if (n.includes('edge')) return FaEdge;
  if (n.includes('opera')) return FaOpera;
  if (n.includes('firefox')) return FaFirefoxBrowser;
  if (n.includes('brave')) return FaBrave;
  if (n.includes('explorer') || n === 'ie' || n.includes('internet explorer')) {
    return FaInternetExplorer;
  }
  if (n.includes('safari')) return FaSafari;
  if (n.includes('chrome') || n.includes('chromium') || n.includes('crios')) {
    return FaChrome;
  }

  return null;
}
