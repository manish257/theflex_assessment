import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = req.nextUrl.searchParams.get('placeId');
  if (!key) {
    return new Response(
      JSON.stringify({ configured: false, message: 'GOOGLE_PLACES_API_KEY not set' }),
      { headers: { 'content-type': 'application/json' } }
    );
  }
  if (!placeId) {
    return new Response(JSON.stringify({ error: 'placeId required' }), { status: 400 });
  }
  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?fields=reviews&key=${key}`;
    const res = await fetch(url, { cache: 'no-store' });
    const json = await res.json();
    return new Response(JSON.stringify(json), { headers: { 'content-type': 'application/json' } });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to fetch Google reviews' }), { status: 500 });
  }
}


