import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "STAFF";

  if (isAdmin) {
    const [totalCustomers, totalVehicles, totalAppointments, pendingAppointments, totalRevenue, recentAppointments] =
      await Promise.all([
        db.user.count({ where: { role: "CLIENT" } }),
        db.vehicle.count(),
        db.appointment.count(),
        db.appointment.count({ where: { status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] } } }),
        db.invoice.aggregate({ where: { status: "PAID" }, _sum: { total: true } }),
        db.appointment.findMany({
          take: 5,
          orderBy: { scheduledAt: "desc" },
          include: {
            client: { select: { name: true, email: true } },
            vehicle: { select: { make: true, model: true, year: true } },
          },
        }),
      ]);

    return NextResponse.json({
      totalCustomers,
      totalVehicles,
      totalAppointments,
      pendingAppointments,
      totalRevenue: totalRevenue._sum.total || 0,
      recentAppointments,
    });
  } else {
    const [myVehicles, myAppointments, pendingAppointments, myInvoices] = await Promise.all([
      db.vehicle.count({ where: { ownerId: session.user.id } }),
      db.appointment.count({ where: { clientId: session.user.id } }),
      db.appointment.count({
        where: { clientId: session.user.id, status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] } },
      }),
      db.invoice.findMany({
        where: { clientId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { vehicle: { select: { make: true, model: true } } },
      }),
    ]);

    return NextResponse.json({
      myVehicles,
      myAppointments,
      pendingAppointments,
      myInvoices,
    });
  }
}
