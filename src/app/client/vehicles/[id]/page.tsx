"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, use } from "react";
import { Storage } from "@/lib/storage";
import { formatDate, formatDateTime, formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Car, Gauge, Hash, Palette, Calendar, FileText, ChevronLeft, Wrench, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VehicleDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const { data: session } = useSession();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id || !params.id) return;

    const vehicles = Storage.getVehicles();
    const foundVehicle = vehicles.find((v: any) => v.id === params.id);

    if (foundVehicle) {
      const allAppts = Storage.getAppointments();
      const allInvoices = Storage.getInvoices();

      const vehicleAppts = allAppts
        .filter((a: any) => a.vehicleId === foundVehicle.id)
        .sort((a: any, b: any) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

      const vehicleInvoices = allInvoices
        .filter((i: any) => i.vehicleId === foundVehicle.id)
        .sort((a: any, b: any) => new Date(b.issueDate || b.createdAt).getTime() - new Date(a.issueDate || a.createdAt).getTime());

      setVehicle({
        ...foundVehicle,
        appointments: vehicleAppts,
        invoices: vehicleInvoices,
        totalSpent: vehicleInvoices.filter((i: any) => i.status === "PAID").reduce((s: number, i: any) => s + i.total, 0),
      });
    }
    setLoading(false);
  }, [session, params.id]);

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/40">Vehicle not found</p>
        <Link href="/client/vehicles" className="text-gold-400 mt-4 inline-block">Back to Vehicles</Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Back */}
      <Link href="/client/vehicles" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Back to Vehicles
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {vehicle.year} {vehicle.make} <span className="text-gold">{vehicle.model}</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={vehicle.status === "ACTIVE" ? "success" : vehicle.status === "IN_SERVICE" ? "warning" : "secondary"}>
              {vehicle.status.replace("_", " ")}
            </Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/client/appointments">
            <Calendar className="w-4 h-4" />
            Book Service
          </Link>
        </Button>
      </div>

      {/* Vehicle Details Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Vehicle Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: Car, label: "Make / Model", value: `${vehicle.make} ${vehicle.model}` },
              { icon: Calendar, label: "Year", value: vehicle.year.toString() },
              { icon: Palette, label: "Color", value: vehicle.color || "—" },
              { icon: Gauge, label: "Mileage", value: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : "—" },
              { icon: Hash, label: "License Plate", value: vehicle.licensePlate || "—" },
              { icon: Hash, label: "VIN", value: vehicle.vin || "—" },
            ].map((field) => (
              <div key={field.label} className="flex items-center gap-3 p-3 glass rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-lg glass-gold flex items-center justify-center flex-shrink-0">
                  <field.icon className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-wider">{field.label}</p>
                  <p className="text-sm text-white/80">{field.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Service Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-4 text-center border border-white/5">
                <p className="text-2xl font-bold text-gold-400">{vehicle.appointments.length}</p>
                <p className="text-xs text-white/40 uppercase tracking-wider mt-0.5">Total Services</p>
              </div>
              <div className="glass rounded-xl p-4 text-center border border-white/5">
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(vehicle.totalSpent)}</p>
                <p className="text-xs text-white/40 uppercase tracking-wider mt-0.5">Total Spent</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 border border-white/5">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Added to AutoHub</p>
              <p className="text-sm text-white/70">{vehicle.createdAt ? formatDate(vehicle.createdAt) : "Recently"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service History */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Wrench className="w-5 h-5 text-gold-400" />Service History</CardTitle></CardHeader>
        <CardContent>
          {vehicle.appointments.length === 0 ? (
            <p className="text-center py-8 text-white/30 text-sm">No service history yet</p>
          ) : (
            <div className="space-y-3">
              {vehicle.appointments.map((appt: any) => (
                <div key={appt.id} className="flex items-center justify-between p-4 glass rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                      <Wrench className="w-4 h-4 text-gold-400/50" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/80">{appt.serviceType.replace(/_/g, " ")}</p>
                      <p className="text-xs text-white/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDateTime(appt.scheduledAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={({ PENDING: "warning", CONFIRMED: "info", IN_PROGRESS: "warning", COMPLETED: "success", CANCELLED: "destructive" } as any)[appt.status] || "secondary"}>
                    {appt.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-silver-400" />Invoices</CardTitle></CardHeader>
        <CardContent>
          {vehicle.invoices.length === 0 ? (
            <p className="text-center py-8 text-white/30 text-sm">No invoices for this vehicle</p>
          ) : (
            <div className="space-y-3">
              {vehicle.invoices.map((inv: any) => (
                <div key={inv.id} className="flex items-center justify-between p-4 glass rounded-xl border border-white/5">
                  <div>
                    <p className="font-mono text-sm font-semibold text-white/80">{inv.invoiceNumber}</p>
                    <p className="text-xs text-white/30">{formatDate(inv.issueDate)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-white">{formatCurrency(inv.total)}</p>
                    <Badge variant={({ PAID: "success", SENT: "info", DRAFT: "secondary", OVERDUE: "destructive", CANCELLED: "secondary" } as any)[inv.status] || "secondary"}>
                      {inv.status}
                    </Badge>
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
