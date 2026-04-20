import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const appointmentSchema = z.object({
  vehicleId: z.string(),
  serviceType: z.string(),
  scheduledAt: z.string(),
  duration: z.number().int().optional().default(60),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "STAFF";

  const where: Record<string, unknown> = isAdmin ? {} : { clientId: session.user.id };
  if (status) where.status = status;

  const appointments = await db.appointment.findMany({
    where,
    include: {
      client: { select: { id: true, name: true, email: true, phone: true } },
      vehicle: { select: { id: true, make: true, model: true, year: true, licensePlate: true } },
    },
    orderBy: { scheduledAt: "desc" },
  });

  return NextResponse.json({ appointments });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = appointmentSchema.parse(body);

    const appointment = await db.appointment.create({
      data: {
        ...data,
        scheduledAt: new Date(data.scheduledAt),
        clientId: session.user.id,
        serviceType: data.serviceType as Parameters<typeof db.appointment.create>[0]["data"]["serviceType"],
      },
      include: {
        vehicle: { select: { make: true, model: true, year: true } },
      },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
