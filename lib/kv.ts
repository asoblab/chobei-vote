import { kv } from "@vercel/kv";

export const VOTES_KEY = "chobei:votes";
export const PERIOD_KEY = "chobei:period";

export const VALID_IDS = new Set([
  "shio","zakkoku","shiso","okaka","ume","takana","gyushigure",
  "sake","ika","mentai","uni","tuna","maze","karasumi",
  "saba","kakuni","anago","toncha",
]);

export async function getVotes(): Promise<Record<string, number>> {
  const raw = await kv.hgetall<Record<string, string>>(VOTES_KEY);
  if (!raw) return Object.fromEntries([...VALID_IDS].map(id => [id, 0]));
  return Object.fromEntries(
    [...VALID_IDS].map(id => [id, parseInt(raw[id] ?? "0", 10)])
  );
}

export async function getPeriod(): Promise<{ start: string; end: string } | null> {
  return kv.get<{ start: string; end: string }>(PERIOD_KEY);
}

export async function incrementVotes(ids: string[]): Promise<void> {
  await Promise.all(ids.map(id => kv.hincrby(VOTES_KEY, id, 1)));
}

export async function setPeriod(start: string, end: string): Promise<void> {
  await kv.set(PERIOD_KEY, { start, end });
}

export async function clearPeriod(): Promise<void> {
  await kv.del(PERIOD_KEY);
}

export async function resetVotes(): Promise<void> {
  await kv.del(VOTES_KEY);
}

export function checkAdminKey(request: Request): boolean {
  const key = request.headers.get("x-admin-key");
  return !!process.env.ADMIN_SECRET && key === process.env.ADMIN_SECRET;
}
