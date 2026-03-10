import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;
function getClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _client;
}
// supabase → getClient() に置き換え用エイリアス
const supabase = { get from() { return getClient().from.bind(getClient()); }, get rpc() { return getClient().rpc.bind(getClient()); } };

export const VALID_IDS = new Set([
  "shio","zakkoku","shiso","okaka","ume","takana","gyushigure",
  "sake","ika","mentai","uni","tuna","maze","karasumi",
  "saba","kakuni","anago","toncha",
]);

export async function getVotes(): Promise<Record<string, number>> {
  const { data } = await supabase.from("votes").select("id, count");
  if (!data) return Object.fromEntries([...VALID_IDS].map(id => [id, 0]));
  return Object.fromEntries(data.map((r: { id: string; count: number }) => [r.id, r.count]));
}

export async function getPeriod(): Promise<{ start: string; end: string } | null> {
  const { data } = await supabase.from("period").select("start_at, end_at").eq("id", 1).single();
  if (!data || !data.start_at) return null;
  return { start: data.start_at, end: data.end_at };
}

export async function incrementVotes(ids: string[]): Promise<void> {
  await supabase.rpc("increment_votes", { vote_ids: ids });
}

export async function setPeriod(start: string, end: string): Promise<void> {
  await supabase.from("period").upsert({ id: 1, start_at: start, end_at: end });
}

export async function clearPeriod(): Promise<void> {
  await supabase.from("period").update({ start_at: null, end_at: null }).eq("id", 1);
}

export async function resetVotes(): Promise<void> {
  await supabase.from("votes").update({ count: 0 }).in("id", [...VALID_IDS]);
}

export function checkAdminKey(request: Request): boolean {
  const key = request.headers.get("x-admin-key");
  return !!process.env.ADMIN_SECRET && key === process.env.ADMIN_SECRET;
}
