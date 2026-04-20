"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Car, Search, Gauge, Hash, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";
import { Storage } from "@/lib/storage";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate?: string;
  color?: string;
  mileage?: number;
  status: string;
}

export default function VehiclesPage() {
  const { data: session } = useSession();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    make: "", model: "", year: new Date().getFullYear().toString(),
    vin: "", licensePlate: "", color: "", mileage: "",
  });

  useEffect(() => {
    if (!session?.user?.id) return;

    // Load data from localStorage
    const clientVehicles = Storage.getVehiclesByOwner(session.user.id);
    setVehicles(clientVehicles);
    setLoading(false);
  }, [session]);

  const filtered = vehicles.filter((v) =>
    `${v.make} ${v.model} ${v.year} ${v.licensePlate}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setSaving(true);
    
    const newVehicleData = {
      ...form,
      ownerId: session.user.id,
      year: parseInt(form.year),
      mileage: form.mileage ? parseInt(form.mileage) : 0,
      status: "ACTIVE",
    };

    const savedVehicle = Storage.addVehicle(newVehicleData);
    
    setVehicles((prev) => [savedVehicle, ...prev]);
    setOpen(false);
    setForm({ make: "", model: "", year: new Date().getFullYear().toString(), vin: "", licensePlate: "", color: "", mileage: "" });
    setSaving(false);
  };

  if (!session) return null;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Client Portal</p>
          <h1 className="text-3xl font-bold text-white">My <span className="text-gold">Vehicles</span></h1>
          <p className="text-white/30 text-xs mt-1">(Mock Mode)</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <Input
          placeholder="Search vehicles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <Car className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <h3 className="text-xl font-semibold text-white/60 mb-2">No vehicles found</h3>
          <p className="text-white/30 text-sm mb-6">
            {search ? "Try a different search term" : "Add your first vehicle to get started"}
          </p>
          {!search && (
            <Button onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Vehicle
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((vehicle, i) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/client/vehicles/${vehicle.id}`} className="block group">
                  <Card className="h-full hover:border-gold-500/20 transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="w-full h-32 glass rounded-xl flex items-center justify-center mb-4 group-hover:glass-gold transition-all duration-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Car className="w-16 h-16 text-gold-400/30 group-hover:text-gold-400/60 transition-colors duration-300" />
                        <div
                          className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-white/20"
                          style={{ backgroundColor: vehicle.color || "#888" }}
                        />
                      </div>

                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-white text-lg leading-tight">
                            {vehicle.year} {vehicle.make}
                          </h3>
                          <p className="text-white/60 text-sm">{vehicle.model}</p>
                        </div>
                        <Badge variant={vehicle.status === "ACTIVE" ? "success" : vehicle.status === "IN_SERVICE" ? "warning" : "secondary"}>
                          {vehicle.status.replace("_", " ")}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {vehicle.licensePlate && (
                          <div className="flex items-center gap-1.5 text-xs text-white/40">
                            <Hash className="w-3 h-3" />
                            {vehicle.licensePlate}
                          </div>
                        )}
                        {vehicle.mileage && (
                          <div className="flex items-center gap-1.5 text-xs text-white/40">
                            <Gauge className="w-3 h-3" />
                            {vehicle.mileage.toLocaleString()} mi
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mt-4 text-xs text-gold-400/50 group-hover:text-gold-400 transition-colors">
                        <span>View details</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Vehicle Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="make">Make *</Label>
                <Input id="make" placeholder="BMW" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="model">Model *</Label>
                <Input id="model" placeholder="M3" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="year">Year *</Label>
                <Input id="year" type="number" min="1900" max="2030" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="color">Color</Label>
                <Input id="color" placeholder="Alpine White" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input id="licensePlate" placeholder="NYC-M3-22" value={form.licensePlate} onChange={(e) => setForm({ ...form, licensePlate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mileage">Mileage</Label>
                <Input id="mileage" type="number" placeholder="18500" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vin">VIN (optional)</Label>
              <Input id="vin" placeholder="WBS4Y9C03NCJ12345" value={form.vin} onChange={(e) => setForm({ ...form, vin: e.target.value })} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {saving ? "Adding..." : "Add Vehicle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
