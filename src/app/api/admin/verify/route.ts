import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const expected = process.env.ADMIN_API_KEY;
  const authorization = request.headers.get("authorization") ?? "";
  if (!expected || expected.length < 32 || !authorization.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  const supplied = Buffer.from(authorization.slice(7).trim(), "utf8");
  const configured = Buffer.from(expected, "utf8");
  if (supplied.length !== configured.length || !timingSafeEqual(supplied, configured)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json({ data: { authorized: true } }, { headers: { "Cache-Control": "no-store" } });
}
