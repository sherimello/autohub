"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Car, Search, Gauge, Hash, User, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
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
  createdAt: string;
  ownerId: string;
  owner: { id: string; name: string; email: string };
}

const STATUS_VARIANTS: Record<string, Parameters<typeof Badge>[0]["variant"]> = {
  ACTIVE: "success",
  IN_SERVICE: "warning",
  SOLD: "secondary",
  INACTIVE: "destructive",
};

export default function AdminVehiclesPage() {
  const { data: session } = useSession();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!session) return;

    // Load data from Storage
    const allVehicles = Storage.getVehicles();
    const allUsers = Storage.getUsers();

    // Map owner details
    const mapped = allVehicles.map((v: any) => ({
      ...v,
      owner: allUsers.find((u: any) => u.id === v.ownerId) || { id: "0", name: "Unknown", email: "N/A" }
    }));

    setVehicles(mapped);
    setLoading(false);
  }, [session]);

  const filtered = vehicles.filter((v) =>
    `${v.make} ${v.model} ${v.year} ${v.licensePlate} ${v.owner.name}`.toLowerCase().includes(search.toLowerCase())
  );

  if (!session) return null;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gold-400/50 text-xs uppercase tracking-[0.3em] mb-1 font-medium">Admin</p>
          <h1 className="text-3xl font-bold text-white">Vehicle <span className="text-gold">Registry</span></h1>
          <p className="text-white/30 text-xs mt-1">(Mock Mode)</p>
        </div>
        <Badge variant="secondary">{filtered.length} vehicles</Badge>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <Input placeholder="Search by make, model, plate, owner..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="glass rounded-2xl h-52 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="hover:border-gold-500/20 transition-all duration-300 group">
                <CardContent className="p-5">
                  {/* Car visual */}
                  <div className="w-full h-28 glass rounded-xl flex items-center justify-center mb-4 group-hover:glass-gold transition-all duration-300 relative">
                    <Car className="w-14 h-14 text-gold-400/25 group-hover:text-gold-400/50 transition-colors duration-300" />
                    {v.color && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-white/20" style={{ backgroundColor: v.color }} />
                    )}
                    <Badge variant={STATUS_VARIANTS[v.status] || "secondary"} className="absolute bottom-2 left-2">
                      {v.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-white text-lg">{v.year} {v.make} {v.model}</h3>

                  <div className="mt-2 space-y-1.5">
                    <p className="text-xs text-white/50 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-gold-400/50" /> {v.owner.name}
                    </p>
                    {v.licensePlate && (
                      <p className="text-xs text-white/40 flex items-center gap-1.5">
                        <Hash className="w-3 h-3" /> {v.licensePlate}
                      </p>
                    )}
                    {v.mileage && (
                      <p className="text-xs text-white/40 flex items-center gap-1.5">
                        <Gauge className="w-3 h-3" /> {v.mileage.toLocaleString()} mi
                      </p>
                    )}
                    <p className="text-xs text-white/30 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> Added {v.createdAt ? formatDate(v.createdAt) : "Recently"}
                    </p>
                  </div>

                  {v.vin && (
                    <p className="mt-3 text-[10px] font-mono text-white/20 truncate">{v.vin}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
