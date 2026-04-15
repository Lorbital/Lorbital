/**
 * Poster preview URLs for orbital hover cards (PNG/WebP).
 * Resolves paths compatible with GitHub Pages subpaths via same logic as modelRegistry base path.
 */

function getBasePath() {
  const pathname = window.location.pathname;
  if (pathname === '/' || pathname === '/index.html') return '';
  const pathParts = pathname.split('/').filter((p) => p && !p.includes('.html'));
  if (pathParts.length > 0) return `/${pathParts[0]}`;
  return '';
}

/**
 * @param {string} orbitalId
 * @returns {{ webp: string, png: string }}
 */
export function getOrbitalPosterUrls(orbitalId) {
  const base = getBasePath();
  const encoded = encodeURIComponent(orbitalId);
  const dir = `${base}/public/previews/orbitals`;
  return {
    webp: `${dir}/${encoded}.webp`,
    png: `${dir}/${encoded}.png`
  };
}
