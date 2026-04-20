"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Plus, Clock, Car, Wrench, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateTime } from "@/lib/utils";
import { Storage } from "@/lib/storage";

interface Appointment {
  id: string;
  serviceType: string;
  status: string;
  scheduledAt: string;
  duration: number;
  notes?: string;
  vehicle: { make: string; model: string; year: number };
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
}

const SERVICE_TYPES = [
  "OIL_CHANGE", "TIRE_ROTATION", "BRAKE_SERVICE", "ENGINE_DIAGNOSTIC",
  "TRANSMISSION_SERVICE", "AC_SERVICE", "BODY_REPAIR", "DETAILING", "INSPECTION", "CUSTOM",
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "warning", CONFIRMED: "info", IN_PROGRESS: "warning",
  COMPLETED: "success", CANCELLED: "destructive",
};

export default function AppointmentsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [form, setForm] = useState({ vehicleId: "", serviceType: "", scheduledAt: "", notes: "" });

  useEffect(() => {
    if (!session?.user?.id) return;

    // Load data from localStorage via Storage utility
    const userId = session.user.id;
    const clientVehicles = Storage.getVehiclesByOwner(userId);
    const clientAppts = Storage.getAppointmentsByClient(userId);

    // Map vehicle details to appointments for the UI
    const mappedAppts = clientAppts.map((a: any) => ({
      ...a,
      vehicle: clientVehicles.find((v: any) => v.id === a.vehicleId) || { make: "Unknown", model: "Vehicle", year: 0 }
    }));

    setAppointments(mappedAppts);
    setVehicles(clientVehicles);
    setLoading(false);
  }, [session]);

  const filtered = appointments.filter((a) => filter === "ALL" ? true : a.status === filter);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setSaving(true);
    
    const newApptData = {
      ...form,
      clientId: session.user.id,
      status: "PENDING",
      duration: 60, // Default duration
    };

    const savedAppt = Storage.addAppointment(newApptData);
    
    // Add vehicle detail for immediate UI update
    const apptWithVehicle = {
      ...savedAppt,
      vehicle: vehicles.find(v => v.id === savedAppt.vehicleId) || { make: "Unknown", model: "Vehicle", year: 0 }
    };

    setAppointments((prev) => [apptWithVehicle, ...prev]);
    setOpen(false);
    setForm({ vehicleId: "", serviceType: "", scheduledAt: "", notes: "" });
    setSaving(false);
  };

  if (!session) return null;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Client Portal</p>
          <h1 className="text-3xl font-bold text-white">My <span className="text-gold">Appointments</span></h1>
          <p className="text-white/30 text-xs mt-1">(Mock Mode)</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          Book Service
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {["ALL", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-medium uppercase tracking-wide transition-all duration-200 ${
              filter === s ? "glass-gold text-gold-300 border border-gold-500/20" : "glass text-white/50 hover:text-white border border-white/5"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="glass rounded-2xl h-24 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <h3 className="text-xl font-semibold text-white/60 mb-2">No appointments</h3>
          <p className="text-white/30 text-sm mb-6">Book a service to get started</p>
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" />
            Book Service
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((appt, i) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 border border-white/6 hover:border-white/10 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl glass-gold flex items-center justify-center flex-shrink-0">
                      <Wrench className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {appt.serviceType.replace(/_/g, " ")}
                      </h3>
                      <p className="text-sm text-white/50 flex items-center gap-1.5 mt-0.5">
                        <Car className="w-3.5 h-3.5" />
                        {appt.vehicle.year} {appt.vehicle.make} {appt.vehicle.model}
                      </p>
                      <p className="text-xs text-white/30 flex items-center gap-1.5 mt-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(appt.scheduledAt)} · {appt.duration} min
                      </p>
                      {appt.notes && (
                        <p className="text-xs text-white/30 mt-2 italic">{appt.notes}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={STATUS_COLORS[appt.status] as any || "secondary"}>
                    {appt.status.replace("_", " ")}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Book Appointment Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book a Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBook} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Vehicle *</Label>
              <Select value={form.vehicleId} onValueChange={(v) => setForm({ ...form, vehicleId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Service Type *</Label>
              <Select value={form.serviceType} onValueChange={(v) => setForm({ ...form, serviceType: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="scheduledAt">Preferred Date & Time *</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                className="bg-black/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="Any special requests..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="bg-black/20"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving || !form.vehicleId || !form.serviceType || !form.scheduledAt}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {saving ? "Booking..." : "Book Appointment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
