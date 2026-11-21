// Keep these in sync with the Supabase projects in next.config.js remotePatterns.
const supabaseHosts = new Set([
  "iskksotubtjejqlblkyf.supabase.co",
  "vxpityfkkkoyujulayck.supabase.co",
]);
const publicObjectPath = "/storage/v1/object/public/";

function publicImageUrl(src: string): URL | undefined {
  try {
    const url = new URL(src);
    if (
      url.protocol !== "https:" ||
      !supabaseHosts.has(url.host) ||
      url.username ||
      url.password ||
      !url.pathname.startsWith(publicObjectPath) ||
      !/^[^/]+\/.+/.test(url.pathname.slice(publicObjectPath.length)) ||
      /\.(svg|gif)$/i.test(decodeURIComponent(url.pathname)) ||
      url.searchParams.has("download")
    ) {
      return undefined;
    }
    return url;
  } catch {
    return undefined;
  }
}

/** Assign each source to one provider, consistently across widths and renders. */
export function shouldUseSupabase(src: string, percentage: number): boolean {
  if (!Number.isFinite(percentage) || percentage <= 0) return false;
  const url = publicImageUrl(src);
  if (!url) return false;

  // FNV-1a; ignore query strings so cache-busting doesn't change providers.
  let hash = 2166136261;
  for (const char of url.origin + url.pathname) {
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  }
  return hash % 100 < Math.min(percentage, 100);
}
