import { NextRequest, NextResponse } from "next/server";

// Mock implementation of API routes so they return success/data without DB
// even if components still call them.

export async function GET() {
  return NextResponse.json({ message: "Mock API. Use Storage utility on client instead." });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "Mock API. Data saved to browser cache instead." }, { status: 201 });
}
