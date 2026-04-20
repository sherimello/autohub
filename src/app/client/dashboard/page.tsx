"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Storage } from "@/lib/storage";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  Car, Calendar, FileText, ChevronRight, TrendingUp,
  Clock, CheckCircle2, AlertCircle, Wrench, Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: any }> = {
    PENDING: { label: "Pending", variant: "warning" },
    CONFIRMED: { label: "Confirmed", variant: "info" },
    IN_PROGRESS: { label: "In Progress", variant: "warning" },
    COMPLETED: { label: "Completed", variant: "success" },
    CANCELLED: { label: "Cancelled", variant: "destructive" },
    PAID: { label: "Paid", variant: "success" },
    SENT: { label: "Sent", variant: "info" },
    DRAFT: { label: "Draft", variant: "secondary" },
    OVERDUE: { label: "Overdue", variant: "destructive" },
  };
  const config = map[status] || { label: status, variant: "secondary" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export default function ClientDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Load data from localStorage
    const userId = session.user.id;
    const vehicles = Storage.getVehiclesByOwner(userId);
    const appointments = Storage.getAppointmentsByClient(userId);
    const invoices = Storage.getInvoicesByClient(userId);

    setData({
      vehicles,
      appointments,
      invoices,
      pendingCount: appointments.filter((a: any) => ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(a.status)).length,
      unpaidAmount: invoices.filter((i: any) => i.status !== "PAID" && i.status !== "CANCELLED").reduce((s: number, i: any) => s + i.total, 0),
    });
    setLoading(false);
  }, [session]);

  if (loading || !session || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/40 text-sm uppercase tracking-widest mb-1">Client Portal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Welcome back, <span className="text-gold">{session.user.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-white/40 mt-1">{formatDate(new Date())} (Mock Mode)</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/client/appointments">
            <Calendar className="w-4 h-4" />
            Book Service
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "My Vehicles", value: data.vehicles.length, icon: Car, sub: "Registered", color: "text-gold-400" },
          { label: "Appointments", value: data.appointments.length, icon: Calendar, sub: `${data.pendingCount} active`, color: "text-blue-400" },
          { label: "Invoices", value: data.invoices.length, icon: FileText, sub: formatCurrency(data.unpaidAmount) + " due", color: "text-silver-400" },
          { label: "Services Done", value: data.appointments.filter((a: any) => a.status === "COMPLETED").length, icon: CheckCircle2, sub: "All time", color: "text-emerald-400" },
        ].map((stat) => (
          <Card key={stat.label} className="hover:border-gold-500/20 transition-all duration-300 group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl glass-gold flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-0.5">{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
              <div className="text-xs text-white/25 mt-0.5">{stat.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Vehicles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Vehicles</CardTitle>
            <Link href="/client/vehicles" className="text-xs text-gold-400/70 hover:text-gold-400 flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.vehicles.length === 0 ? (
              <div className="text-center py-8 text-white/30">
                <Car className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No vehicles registered yet</p>
                <Link href="/client/vehicles" className="text-xs text-gold-400 mt-1 inline-block hover:text-gold-300 transition-colors">
                  Add your first vehicle
                </Link>
              </div>
            ) : (
              data.vehicles.map((v: any) => (
                <Link key={v.id} href={`/client/vehicles/${v.id}`}
                  className="flex items-center gap-3 p-3 glass rounded-xl border border-white/5 hover:border-gold-500/20 hover:glass-gold transition-all group">
                  <div className="w-10 h-10 rounded-lg glass flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 text-gold-400/60 group-hover:text-gold-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white/90 text-sm">{v.year} {v.make} {v.model}</p>
                    <p className="text-xs text-white/40">{v.licensePlate || v.vin || "No plate"}</p>
                  </div>
                  <Badge variant={v.status === "ACTIVE" ? "success" : v.status === "IN_SERVICE" ? "warning" : "secondary"}>
                    {v.status.replace("_", " ")}
                  </Badge>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Appointments</CardTitle>
            <Link href="/client/appointments" className="text-xs text-gold-400/70 hover:text-gold-400 flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.appointments.length === 0 ? (
              <div className="text-center py-8 text-white/30">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No appointments yet</p>
                <Link href="/client/appointments" className="text-xs text-gold-400 mt-1 inline-block hover:text-gold-300 transition-colors">
                  Book your first service
                </Link>
              </div>
            ) : (
              data.appointments.slice(0, 4).map((appt: any) => (
                <div key={appt.id} className="flex items-start justify-between gap-3 p-3 glass rounded-xl border border-white/5">
                  <div className="w-9 h-9 rounded-lg glass flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Wrench className="w-4 h-4 text-gold-400/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white/90 text-sm">
                      {appt.serviceType.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-white/40">
                      Vehicle: {appt.vehicleId}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(appt.scheduledAt)}
                    </p>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Invoices</CardTitle>
          <Link href="/client/invoices" className="text-xs text-gold-400/70 hover:text-gold-400 flex items-center gap-1 transition-colors">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {data.invoices.length === 0 ? (
            <div className="text-center py-8 text-white/30">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No invoices yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.invoices.map((inv: any) => (
                <div key={inv.id} className="flex items-center justify-between p-4 glass rounded-xl border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg glass flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-silver-400/60" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-medium text-white/80">{inv.invoiceNumber}</p>
                      <p className="text-xs text-white/40">{formatDate(inv.issueDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-white">{formatCurrency(inv.total)}</p>
                    <StatusBadge status={inv.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
