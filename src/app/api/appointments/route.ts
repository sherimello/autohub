import { NextResponse } from "next/server";

// This app runs in mock/localStorage mode. These API routes are not used.
export async function GET() {
  return NextResponse.json({ error: "Mock mode – use client-side Storage" }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ error: "Mock mode – use client-side Storage" }, { status: 501 });
}
