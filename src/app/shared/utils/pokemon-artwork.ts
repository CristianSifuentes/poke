// jsDelivr mirrors the same PokeAPI/sprites repo behind a real CDN with
// proper caching. raw.githubusercontent.com serves the identical file but
// isn't meant for production hotlinking — GitHub rate-limits and resets
// connections to it under load, which is what caused artwork to
// intermittently fail to load here.
export function pokemonArtwork(id: number): string {
  return `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/${id}.png`;
}

// A same-domain SVG silhouette so a still-broken image never shows the
// browser's broken-image icon — it never touches the network, so it can't
// fail the way the CDN request just did.
export const FALLBACK_ARTWORK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">' +
      '<circle cx="48" cy="48" r="44" fill="none" stroke="#e5e5ea" stroke-width="4"/>' +
      '<path d="M4 48h34a10 10 0 0 0 20 0h34" fill="none" stroke="#e5e5ea" stroke-width="4"/>' +
      '<circle cx="48" cy="48" r="8" fill="#e5e5ea"/>' +
      '</svg>',
  );
