import { NextRequest, NextResponse } from "next/server";
import { getVotes, getPeriod, checkAdminKey } from "@/lib/kv";

export async function GET(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const [votes, period] = await Promise.all([getVotes(), getPeriod()]);
  return NextResponse.json({ votes, period });
}
