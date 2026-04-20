import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const vehicle = await db.vehicle.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true, phone: true } },
      appointments: { orderBy: { scheduledAt: "desc" }, take: 10 },
      invoices: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!vehicle) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "STAFF";
  if (!isAdmin && vehicle.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ vehicle });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const vehicle = await db.vehicle.findUnique({ where: { id } });
  if (!vehicle) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "STAFF";
  if (!isAdmin && vehicle.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await db.vehicle.update({ where: { id }, data: body });
  return NextResponse.json({ vehicle: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const vehicle = await db.vehicle.findUnique({ where: { id } });
  if (!vehicle) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "STAFF";
  if (!isAdmin && vehicle.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.vehicle.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
