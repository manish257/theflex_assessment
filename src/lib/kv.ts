// Thin wrapper around Vercel KV with an in-memory fallback for local/dev

type KvClient = {
  sadd: (key: string, member: string) => Promise<number>;
  srem: (key: string, member: string) => Promise<number>;
  smembers: (key: string) => Promise<string[]>;
};

class MemoryKV implements KvClient {
  private get store(): Map<string, Set<string>> {
    const g = globalThis as unknown as { __kv_sets?: Map<string, Set<string>> };
    if (!g.__kv_sets) g.__kv_sets = new Map<string, Set<string>>();
    return g.__kv_sets;
  }
  async sadd(key: string, member: string): Promise<number> {
    const s = this.store.get(key) ?? new Set<string>();
    const before = s.size;
    s.add(member);
    this.store.set(key, s);
    return s.size - before;
  }
  async srem(key: string, member: string): Promise<number> {
    const s = this.store.get(key) ?? new Set<string>();
    const had = s.delete(member);
    return had ? 1 : 0;
  }
  async smembers(key: string): Promise<string[]> {
    const s = this.store.get(key) ?? new Set<string>();
    return Array.from(s);
  }
}

import { kv as vercelKv } from '@vercel/kv';

let client: KvClient | null = null;

export function getKV(): KvClient {
  if (client) return client;
  const hasVercelKv = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;
  if (hasVercelKv && vercelKv) {
    client = vercelKv as unknown as KvClient;
    return client;
  }
  client = new MemoryKV();
  return client;
}

export function approvedKey(listingKey: string): string {
  return `approved:${listingKey}`;
}


