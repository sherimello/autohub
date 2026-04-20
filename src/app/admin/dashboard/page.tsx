"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Storage } from "@/lib/storage";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  Users, Car, Calendar, DollarSign, TrendingUp, Wrench,
  ChevronRight, AlertCircle, CheckCircle2, Clock, ArrowUpRight,
} from "lucide-react";

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; variant: any }> = {
    PENDING: { label: "Pending", variant: "warning" },
    CONFIRMED: { label: "Confirmed", variant: "info" },
    IN_PROGRESS: { label: "In Progress", variant: "warning" },
    COMPLETED: { label: "Completed", variant: "success" },
    CANCELLED: { label: "Cancelled", variant: "destructive" },
  };
  const c = map[status] || { label: status, variant: "secondary" };
  return <Badge variant={c.variant}>{c.label}</Badge>;
};

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load stats from localStorage
    const data = Storage.getAdminStats();
    setStats(data);
    setLoading(false);
  }, []);

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gold-400/50 text-xs uppercase tracking-[0.3em] mb-1 font-medium">Admin Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Operations <span className="text-gold">Command</span>
          </h1>
          <p className="text-white/30 text-sm mt-1">All systems operational (Mock Mode)</p>
        </div>
        <div className="flex items-center gap-2 glass-gold rounded-xl px-4 py-2 border border-gold-500/15">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-gold-400/70 font-medium">System Ready</span>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(stats.totalRevenue || 0), icon: DollarSign, sub: "All time paid", color: "text-gold-400", glow: true },
          { label: "Customers", value: stats.totalCustomers, icon: Users, sub: "Active clients", color: "text-blue-400" },
          { label: "Vehicles", value: stats.totalVehicles, icon: Car, sub: "In registry", color: "text-silver-400" },
          { label: "Active Jobs", value: stats.activeCount, icon: Wrench, sub: `${stats.pendingCount} pending`, color: "text-amber-400" },
        ].map((stat) => (
          <Card key={stat.label} className={`hover:border-gold-500/20 transition-all duration-300 group ${stat.glow ? "border-gold-500/10" : ""}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${stat.glow ? "glass-gold" : "glass"} flex items-center justify-center group-hover:glass-gold transition-all duration-300`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-gold-400/30 transition-colors" />
              </div>
              <div className={`text-3xl font-bold mb-0.5 ${stat.glow ? "text-gold" : "text-white"}`}>{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
              <div className="text-xs text-white/20 mt-0.5">{stat.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Appointments", value: stats.totalAppointments, icon: Calendar, pct: 78 },
          { label: "Pending Reviews", value: stats.pendingCount, icon: AlertCircle, pct: (stats.pendingCount / Math.max(stats.totalAppointments, 1)) * 100 },
          { label: "Ready to Start", value: stats.pendingCount, icon: CheckCircle2, pct: 100 },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <stat.icon className="w-4 h-4 text-white/40" />
                  <span className="text-sm text-white/50">{stat.label}</span>
                </div>
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <Progress value={stat.pct} />
              <p className="text-xs text-white/30 mt-1.5">{Math.round(stat.pct)}% of target</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Recent Appointments */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Appointments</CardTitle>
            <Link href="/admin/appointments" className="text-xs text-gold-400/60 hover:text-gold-400 flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.recentAppointments.map((appt: any) => (
              <div key={appt.id} className="flex items-center gap-3 p-3 glass rounded-xl border border-white/4 hover:border-white/8 transition-all">
                <div className="w-8 h-8 rounded-lg glass-gold flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-4 h-4 text-gold-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/90 truncate">{appt.client?.name || "Customer"}</p>
                  <p className="text-xs text-white/40">
                    {appt.serviceType.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <StatusBadge status={appt.status} />
                  <p className="text-xs text-white/20 mt-0.5 flex items-center gap-1 justify-end">
                    <Clock className="w-2.5 h-2.5" />
                    {formatDateTime(appt.scheduledAt)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Revenue Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold-400" />
              Recent Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {stats.recentInvoices.map((inv: any) => (
                <div key={inv.id} className="flex items-center justify-between text-xs p-2 glass rounded-lg">
                  <span className="text-white/40 font-mono">{inv.invoiceNumber}</span>
                  <span className="text-gold-400/80 font-semibold">{formatCurrency(inv.total)}</span>
                </div>
              ))}
            </div>
            <Link href="/admin/invoices" className="mt-4 flex items-center gap-1 text-xs text-gold-400/50 hover:text-gold-400 transition-colors">
              View all invoices <ChevronRight className="w-3 h-3" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
