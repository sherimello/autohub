"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Calendar, Search, Wrench, Clock, User, Car, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import { Storage } from "@/lib/storage";

interface Appointment {
  id: string;
  serviceType: string;
  status: string;
  scheduledAt: string;
  duration: number;
  totalAmount?: number;
  notes?: string;
  client: { name: string; email: string; phone?: string };
  vehicle: { make: string; model: string; year: number; licensePlate?: string };
}

const STATUSES = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function AdminAppointmentsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(() => {
    // Fetch data from Storage
    const allAppts = Storage.getAppointments();
    const allUsers = Storage.getUsers();
    const allVehicles = Storage.getVehicles();

    // Map relationships
    const mapped = allAppts.map((a: any) => ({
      ...a,
      client: allUsers.find((u: any) => u.id === a.clientId) || { name: "Unknown", email: "N/A" },
      vehicle: allVehicles.find((v: any) => v.id === a.vehicleId) || { make: "Unknown", model: "Vehicle", year: 0 },
    }));

    // Filter by status if needed
    const filteredByStatus = statusFilter === "ALL" 
      ? mapped 
      : mapped.filter((a: any) => a.status === statusFilter);

    setAppointments(filteredByStatus);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    if (session) load();
  }, [session, load]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    
    // Update in localStorage
    const allAppts = Storage.getAppointments();
    const updated = allAppts.map((a: any) => a.id === id ? { ...a, status } : a);
    Storage.setAppointments(updated);

    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setUpdating(null);
  };

  const filtered = appointments.filter((a) =>
    `${a.client.name} ${a.serviceType} ${a.vehicle.make} ${a.vehicle.model}`.toLowerCase().includes(search.toLowerCase())
  );

  if (!session) return null;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gold-400/50 text-xs uppercase tracking-[0.3em] mb-1 font-medium">Admin</p>
          <h1 className="text-3xl font-bold text-white">Appointments <span className="text-gold">Manager</span></h1>
          <p className="text-white/30 text-xs mt-1">(Mock Mode)</p>
        </div>
        <Badge variant="secondary">{filtered.length} shown</Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input placeholder="Search appointments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium uppercase tracking-wide transition-all ${
                statusFilter === s ? "bg-gold-500/10 text-gold-300 border border-gold-500/15" : "glass text-white/40 hover:text-white border border-white/5"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="glass rounded-2xl h-28 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <h3 className="text-xl font-semibold text-white/60">No appointments found</h3>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt, i) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-2xl p-5 border border-white/6 hover:border-white/10 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl glass-gold flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-6 h-6 text-gold-400" />
                </div>

                <div className="flex-1 grid md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold text-white">{appt.serviceType.replace(/_/g, " ")}</h3>
                    <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3" /> {appt.client.name}
                    </p>
                    <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                      <Car className="w-3 h-3" /> {appt.vehicle.year} {appt.vehicle.make} {appt.vehicle.model}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-white/40 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDateTime(appt.scheduledAt)}
                    </p>
                    <p className="text-xs text-white/30 mt-1">{appt.duration} minutes</p>
                    {appt.totalAmount && (
                      <p className="text-sm font-semibold text-gold-400 mt-1">{formatCurrency(appt.totalAmount)}</p>
                    )}
                    {appt.notes && <p className="text-xs text-white/25 mt-1 italic truncate">{appt.notes}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={({ PENDING: "warning", CONFIRMED: "info", IN_PROGRESS: "warning", COMPLETED: "success", CANCELLED: "destructive" } as any)[appt.status] || "secondary"}>
                        {appt.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {/* Quick status update */}
                    {appt.status !== "COMPLETED" && appt.status !== "CANCELLED" && (
                      <Select
                        value={appt.status}
                        onValueChange={(v) => updateStatus(appt.id, v)}
                        disabled={updating === appt.id}
                      >
                        <SelectTrigger className="h-8 text-xs bg-black/20">
                          {updating === appt.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <SelectValue />}
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
