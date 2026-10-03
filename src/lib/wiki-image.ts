import { SAMAY_RAINA_IMAGE } from './samay';

// In-memory cache to prevent redundant external API calls
const imageCache = new Map<string, string>();

// Pre-fill Samay
imageCache.set('samay raina', SAMAY_RAINA_IMAGE);

/**
 * Fetch public figure image from Wikipedia / Wikimedia Commons API
 */
export async function getWikiImage(name: string): Promise<string> {
  const normalized = name.trim().toLowerCase();
  if (normalized.includes('samay raina')) {
    return SAMAY_RAINA_IMAGE;
  }

  if (imageCache.has(normalized)) {
    return imageCache.get(normalized)!;
  }

  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=13141f&color=d4ff00&bold=true`;

  try {
    const headers = {
      'User-Agent': 'LatentLabApp/1.0 (contact@example.com) Mozilla/5.0',
    };

    // 1. Direct pageimage query on Wikipedia
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      name
    )}&prop=pageimages&format=json&pithumbsize=400&redirects=1`;

    const res = await fetch(wikiUrl, { headers, next: { revalidate: 86400 } });
    if (res.ok) {
      const data = await res.json();
      const pages = data.query?.pages || {};
      for (const id of Object.keys(pages)) {
        if (id !== '-1' && pages[id]?.thumbnail?.source) {
          const imgUrl = pages[id].thumbnail.source;
          imageCache.set(normalized, imgUrl);
          return imgUrl;
        }
      }
    }

    // 2. Search query on Wikipedia if direct title didn't hit
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      name
    )}&gsrlimit=1&prop=pageimages&pithumbsize=400&format=json`;

    const searchRes = await fetch(searchUrl, { headers, next: { revalidate: 86400 } });
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const searchPages = searchData.query?.pages || {};
      for (const id of Object.keys(searchPages)) {
        if (id !== '-1' && searchPages[id]?.thumbnail?.source) {
          const imgUrl = searchPages[id].thumbnail.source;
          imageCache.set(normalized, imgUrl);
          return imgUrl;
        }
      }
    }

    // 3. Query Wikimedia Commons directly for portrait photos
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      name
    )}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json`;

    const commonsRes = await fetch(commonsUrl, { headers, next: { revalidate: 86400 } });
    if (commonsRes.ok) {
      const commonsData = await commonsRes.json();
      const commonsPages = commonsData.query?.pages || {};
      for (const id of Object.keys(commonsPages)) {
        const info = commonsPages[id]?.imageinfo?.[0];
        if (info?.thumburl || info?.url) {
          const imgUrl = info.thumburl || info.url;
          imageCache.set(normalized, imgUrl);
          return imgUrl;
        }
      }
    }
  } catch (err) {
    // If network fails, use avatar fallback
  }

  imageCache.set(normalized, fallback);
  return fallback;
}

/**
 * Enrich a list of panel members with verified Wikimedia images
 */
export async function enrichPanelImages<T extends { name: string; image_url?: string }>(
  members: T[]
): Promise<T[]> {
  const promises = members.map(async (m) => {
    if (m.name.toLowerCase().includes('samay raina')) {
      m.image_url = SAMAY_RAINA_IMAGE;
      return m;
    }
    // If no image or it's a ui-avatars fallback, attempt wikimedia fetch
    if (!m.image_url || m.image_url.includes('ui-avatars.com')) {
      m.image_url = await getWikiImage(m.name);
    }
    return m;
  });

  return Promise.all(promises);
}
