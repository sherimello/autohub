"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Storage } from "@/lib/storage";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Car, Users, Calendar, DollarSign, BarChart3, PieChart, Activity } from "lucide-react";

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load analytics from localStorage
    const analytics = Storage.getAnalytics();
    setData(analytics);
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
      <div>
        <p className="text-gold-400/50 text-xs uppercase tracking-[0.3em] mb-1 font-medium">Admin</p>
        <h1 className="text-3xl font-bold text-white">Analytics <span className="text-gold">&amp; Insights</span></h1>
        <p className="text-white/30 text-sm mt-1">Platform performance overview (Mock Mode)</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(data.totalRevenue), icon: DollarSign, color: "text-gold-400", sub: "From paid invoices" },
          { label: "New Clients (30d)", value: data.recentGrowth, icon: Users, color: "text-blue-400", sub: "Past 30 days" },
          { label: "Total Appointments", value: data.totalAppointments, icon: Calendar, color: "text-silver-400", sub: "All time" },
          { label: "Completion Rate", value: `${Math.round((data.appointmentsByStatus.find((a: any) => a.status === "COMPLETED")?._count || 0) / Math.max(data.totalAppointments, 1) * 100)}%`, icon: Activity, color: "text-emerald-400", sub: "Of all appointments" },
        ].map((kpi) => (
          <Card key={kpi.label} className="hover:border-gold-500/20 transition-all duration-300">
            <CardContent className="p-5">
              <div className="w-11 h-11 glass-gold rounded-xl flex items-center justify-center mb-4">
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <p className={`text-3xl font-bold mb-0.5 ${kpi.color}`}>{kpi.value}</p>
              <p className="text-xs text-white/40">{kpi.label}</p>
              <p className="text-xs text-white/20 mt-0.5">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Vehicle Status Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <PieChart className="w-5 h-5 text-gold-400" />
            <CardTitle>Fleet Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.vehiclesByStatus.map((v: any) => {
              const total = data.vehiclesByStatus.reduce((s: number, x: any) => s + x._count, 0);
              const pct = Math.round((v._count / total) * 100);
              return (
                <div key={v.status}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-white/60">{v.status.replace("_", " ")}</span>
                    <span className="text-sm font-bold text-white">{v._count} <span className="text-white/30 font-normal">({pct}%)</span></span>
                  </div>
                  <Progress value={pct} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Appointment Status */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gold-400" />
            <CardTitle>Appointment Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.appointmentsByStatus.map((a: any) => {
              const pct = Math.round((a._count / Math.max(data.totalAppointments, 1)) * 100);
              return (
                <div key={a.status}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-white/60">{a.status.replace("_", " ")}</span>
                    <span className="text-sm font-bold text-white">{a._count} <span className="text-white/30 font-normal">({pct}%)</span></span>
                  </div>
                  <Progress value={pct} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Most Popular Services */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold-400" />
            <CardTitle>Service Popularity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.serviceTypeCounts.map((s: any) => {
              const max = data.serviceTypeCounts[0]?._count || 1;
              const pct = Math.round((s._count / max) * 100);
              return (
                <div key={s.serviceType}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-white/60">{s.serviceType.replace(/_/g, " ")}</span>
                    <span className="text-sm font-bold text-gold-400">{s._count} bookings</span>
                  </div>
                  <Progress value={pct} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Revenue by Status */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <DollarSign className="w-5 h-5 text-gold-400" />
            <CardTitle>Revenue by Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.invoiceRevenue.map((inv: any) => {
              const amount = inv._sum?.total || 0;
              const maxRev = Math.max(...data.invoiceRevenue.map((x: any) => x._sum?.total || 0));
              const pct = Math.round((amount / Math.max(maxRev, 1)) * 100);
              return (
                <div key={inv.status}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-white/60">{inv.status} <span className="text-white/30">({inv._count} invoices)</span></span>
                    <span className="text-sm font-bold text-gold-400">{formatCurrency(amount)}</span>
                  </div>
                  <Progress value={pct} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
