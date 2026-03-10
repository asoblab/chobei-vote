import { NextResponse } from "next/server";
import { getVotes, getPeriod } from "@/lib/kv";

export async function GET() {
  const [votes, period] = await Promise.all([getVotes(), getPeriod()]);
  return NextResponse.json({ votes, period });
}
