"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Download, Search, DollarSign, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Storage } from "@/lib/storage";

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  total: number;
  subtotal: number;
  tax: number;
  vehicleId?: string;
  vehicle?: { make: string; model: string };
}

const STATUS_MAP: Record<string, { variant: string; label: string }> = {
  DRAFT: { variant: "secondary", label: "Draft" },
  SENT: { variant: "info", label: "Sent" },
  PAID: { variant: "success", label: "Paid" },
  OVERDUE: { variant: "destructive", label: "Overdue" },
  CANCELLED: { variant: "secondary", label: "Cancelled" },
};

export default function InvoicesPage() {
  const { data: session } = useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!session?.user?.id) return;

    // Load data from localStorage
    const userId = session.user.id;
    const clientInvoices = Storage.getInvoicesByClient(userId);
    const clientVehicles = Storage.getVehiclesByOwner(userId);

    // Map vehicle details to invoices
    const mappedInvoices = clientInvoices.map((inv: any) => ({
      ...inv,
      vehicle: clientVehicles.find((v: any) => v.id === inv.vehicleId) || undefined
    }));

    setInvoices(mappedInvoices);
    setLoading(false);
  }, [session]);

  const filtered = invoices.filter((inv) => {
    const matchSearch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || inv.status === filter;
    return matchSearch && matchFilter;
  });

  const totalPaid = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.total, 0);
  const totalPending = invoices.filter((i) => ["SENT", "DRAFT"].includes(i.status)).reduce((s, i) => s + i.total, 0);
  const totalOverdue = invoices.filter((i) => i.status === "OVERDUE").reduce((s, i) => s + i.total, 0);

  if (!session) return null;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Client Portal</p>
        <h1 className="text-3xl font-bold text-white">My <span className="text-gold">Invoices</span></h1>
        <p className="text-white/30 text-xs mt-1">(Mock Mode)</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Paid", value: totalPaid, icon: CheckCircle2, color: "text-emerald-400", bg: "glass" },
          { label: "Pending", value: totalPending, icon: Clock, color: "text-amber-400", bg: "glass" },
          { label: "Overdue", value: totalOverdue, icon: DollarSign, color: "text-red-400", bg: "glass" },
        ].map((s) => (
          <Card key={s.label} className={s.bg}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40 uppercase tracking-wider">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{formatCurrency(s.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input placeholder="Search invoice number..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL", "DRAFT", "SENT", "PAID", "OVERDUE"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium uppercase tracking-wide transition-all ${
                filter === s ? "glass-gold text-gold-300 border border-gold-500/20" : "glass text-white/50 hover:text-white border border-white/5"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="glass rounded-2xl h-20 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <FileText className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <h3 className="text-xl font-semibold text-white/60 mb-2">No invoices found</h3>
          <p className="text-white/30 text-sm">Invoices will appear here after services are completed</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((inv, i) => {
              const status = STATUS_MAP[inv.status] || { variant: "secondary", label: inv.status };
              return (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass rounded-2xl p-5 border border-white/6 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl glass flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-silver-400/60" />
                      </div>
                      <div>
                        <p className="font-mono font-semibold text-white">{inv.invoiceNumber}</p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {inv.vehicle ? `${inv.vehicle.make} ${inv.vehicle.model} · ` : ""}
                          Issued {inv.issueDate ? formatDate(inv.issueDate) : "Now"} · Due {inv.dueDate ? formatDate(inv.dueDate) : "Soon"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xl font-bold text-white">{formatCurrency(inv.total)}</p>
                      <Badge variant={status.variant as any}>{status.label}</Badge>
                      <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:glass-gold transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
