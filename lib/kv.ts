import { Redis } from "@upstash/redis";

let _client: Redis | null = null;
function getClient(): Redis {
  if (!_client) {
    _client = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _client;
}

export const VOTES_KEY = "chobei:votes";
export const PERIOD_KEY = "chobei:period";

export const VALID_IDS = new Set([
  "shio","zakkoku","shiso","okaka","ume","takana","gyushigure",
  "sake","ika","mentai","uni","tuna","maze","karasumi",
  "saba","kakuni","anago","toncha",
]);

export async function getVotes(): Promise<Record<string, number>> {
  const raw = await getClient().hgetall<Record<string, string>>(VOTES_KEY);
  if (!raw) return Object.fromEntries([...VALID_IDS].map(id => [id, 0]));
  return Object.fromEntries(
    [...VALID_IDS].map(id => [id, parseInt(raw[id] ?? "0", 10)])
  );
}

export async function getPeriod(): Promise<{ start: string; end: string } | null> {
  return getClient().get<{ start: string; end: string }>(PERIOD_KEY);
}

export async function incrementVotes(ids: string[]): Promise<void> {
  await Promise.all(ids.map(id => getClient().hincrby(VOTES_KEY, id, 1)));
}

export async function setPeriod(start: string, end: string): Promise<void> {
  await getClient().set(PERIOD_KEY, { start, end });
}

export async function clearPeriod(): Promise<void> {
  await getClient().del(PERIOD_KEY);
}

export async function resetVotes(): Promise<void> {
  await getClient().del(VOTES_KEY);
}

export function checkAdminKey(request: Request): boolean {
  const key = request.headers.get("x-admin-key");
  return !!process.env.ADMIN_SECRET && key === process.env.ADMIN_SECRET;
}
