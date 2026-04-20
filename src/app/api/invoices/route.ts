import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const invoiceItemSchema = z.object({
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  total: z.number(),
});

const invoiceSchema = z.object({
  clientId: z.string(),
  vehicleId: z.string().optional(),
  appointmentId: z.string().optional(),
  dueDate: z.string(),
  items: z.array(invoiceItemSchema),
  tax: z.number().optional().default(0),
  discount: z.number().optional().default(0),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "STAFF";

  const invoices = await db.invoice.findMany({
    where: isAdmin ? {} : { clientId: session.user.id },
    include: {
      client: { select: { id: true, name: true, email: true } },
      vehicle: { select: { make: true, model: true, year: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ invoices });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "STAFF";
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const { clientId, vehicleId, appointmentId, dueDate, items, tax, discount, notes } = invoiceSchema.parse(body);

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal + (tax || 0) - (discount || 0);

    const count = await db.invoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

    const invoice = await db.invoice.create({
      data: {
        clientId,
        vehicleId,
        appointmentId,
        invoiceNumber,
        dueDate: new Date(dueDate),
        subtotal,
        tax: tax || 0,
        discount: discount || 0,
        total,
        notes,
        items: { create: items },
      },
      include: { items: true, client: true, vehicle: true },
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
