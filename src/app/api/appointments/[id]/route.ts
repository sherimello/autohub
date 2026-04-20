import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "STAFF";

  const appointment = await db.appointment.findUnique({ where: { id } });
  if (!appointment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!isAdmin && appointment.clientId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await db.appointment.update({
    where: { id },
    data: body,
    include: {
      client: { select: { name: true, email: true } },
      vehicle: { select: { make: true, model: true, year: true } },
    },
  });

  return NextResponse.json({ appointment: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "STAFF";
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await db.appointment.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
