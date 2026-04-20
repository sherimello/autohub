"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Users, Search, Mail, Phone, Car, Calendar, FileText, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, formatDate } from "@/lib/utils";
import { Storage } from "@/lib/storage";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  _count: { vehicles: number; appointments: number; invoices: number };
}

export default function CustomersPage() {
  const { data: session } = useSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!session) return;

    // Load data from Storage
    const allUsers = Storage.getUsers().filter((u: any) => u.role === "CLIENT");
    const allVehicles = Storage.getVehicles();
    const allAppts = Storage.getAppointments();
    const allInvoices = Storage.getInvoices();

    // Map counts
    const mapped = allUsers.map((u: any) => ({
      ...u,
      _count: {
        vehicles: allVehicles.filter((v: any) => v.ownerId === u.id).length,
        appointments: allAppts.filter((a: any) => a.clientId === u.id).length,
        invoices: allInvoices.filter((i: any) => i.clientId === u.id).length,
      }
    }));

    // Filter by search
    const filtered = mapped.filter((u: any) => 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase())
    );

    setCustomers(filtered);
    setLoading(false);
  }, [session, search]);

  if (!session) return null;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gold-400/50 text-xs uppercase tracking-[0.3em] mb-1 font-medium">Admin</p>
          <h1 className="text-3xl font-bold text-white">Customer <span className="text-gold">Registry</span></h1>
          <p className="text-white/30 text-xs mt-1">(Mock Mode)</p>
        </div>
        <Badge variant="secondary">{customers.length} total</Badge>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="glass rounded-2xl h-40 animate-pulse" />)}
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-24">
          <Users className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <h3 className="text-xl font-semibold text-white/60">No customers found</h3>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {customers.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="hover:border-gold-500/20 transition-all duration-300 group cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{getInitials(customer.name || "U")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-gold-300 transition-colors">
                        {customer.name}
                      </h3>
                      <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </p>
                      {customer.phone && (
                        <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { icon: Car, value: customer._count.vehicles, label: "Vehicles" },
                      { icon: Calendar, value: customer._count.appointments, label: "Bookings" },
                      { icon: FileText, value: customer._count.invoices, label: "Invoices" },
                    ].map((s) => (
                      <div key={s.label} className="glass rounded-lg p-2 text-center border border-white/4">
                        <s.icon className="w-3.5 h-3.5 text-gold-400/50 mx-auto mb-1" />
                        <p className="text-sm font-bold text-white">{s.value}</p>
                        <p className="text-[9px] text-white/30 uppercase tracking-wide">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/30">Since {customer.createdAt ? formatDate(customer.createdAt) : "Recently"}</p>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-gold-400 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
