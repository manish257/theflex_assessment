export function toIsoString(input: string | Date | null | undefined): string {
  if (!input) return new Date(0).toISOString();
  const d = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return new Date(0).toISOString();
  return d.toISOString();
}

export function monthKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const m = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  return `${y}-${m}`;
}

export function safeNumber(n: unknown): number | null {
  const v = typeof n === 'string' ? Number(n) : (n as number);
  return Number.isFinite(v) ? v : null;
}

export function simpleSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function listingKeyFrom(id: string | number | null | undefined, name: string | null | undefined): string {
  if (id !== null && id !== undefined && `${id}`.trim().length > 0) {
    return `listing-${id}`;
  }
  return `listing-${simpleSlug(name || 'unknown')}`;
}


