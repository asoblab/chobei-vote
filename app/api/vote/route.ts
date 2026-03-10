import { NextRequest, NextResponse } from "next/server";
import { VALID_IDS, getPeriod, incrementVotes } from "@/lib/kv";

export async function POST(req: NextRequest) {
  let ids: unknown;
  try {
    ({ ids } = await req.json());
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 3) {
    return NextResponse.json({ error: "ids must be 1–3 items" }, { status: 400 });
  }
  if (ids.some(id => typeof id !== "string" || !VALID_IDS.has(id))) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const period = await getPeriod();
  if (period) {
    const now = new Date();
    if (now < new Date(period.start) || now > new Date(period.end)) {
      return NextResponse.json({ error: "outside voting period" }, { status: 403 });
    }
  }

  await incrementVotes(ids as string[]);
  return NextResponse.json({ ok: true });
}
