"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { FileText, Search, DollarSign, Download, Eye, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  client: { name: string; email: string };
  vehicle?: { make: string; model: string };
}

const STATUS_MAP: Record<string, Parameters<typeof Badge>[0]["variant"]> = {
  DRAFT: "secondary",
  SENT: "info",
  PAID: "success",
  OVERDUE: "destructive",
  CANCELLED: "secondary",
};

export default function AdminInvoicesPage() {
  const { data: session } = useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!session) return;

    // Load data from Storage
    const allInvoices = Storage.getInvoices();
    const allUsers = Storage.getUsers();
    const allVehicles = Storage.getVehicles();

    // Map relationships
    const mapped = allInvoices.map((inv: any) => ({
      ...inv,
      client: allUsers.find((u: any) => u.id === inv.clientId) || { name: "Unknown", email: "N/A" },
      vehicle: allVehicles.find((v: any) => v.id === inv.vehicleId) || undefined,
    }));

    setInvoices(mapped);
    setLoading(false);
  }, [session]);

  const filtered = invoices.filter((inv) => {
    const matchSearch = `${inv.invoiceNumber} ${inv.client.name}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || inv.status === filter;
    return matchSearch && matchFilter;
  });

  const totalRevenue = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.total, 0);
  const totalPending = invoices.filter((i) => ["SENT", "DRAFT"].includes(i.status)).reduce((s, i) => s + i.total, 0);

  if (!session) return null;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gold-400/50 text-xs uppercase tracking-[0.3em] mb-1 font-medium">Admin</p>
          <h1 className="text-3xl font-bold text-white">Invoice <span className="text-gold">Management</span></h1>
          <p className="text-white/30 text-xs mt-1">(Mock Mode)</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: TrendingUp, color: "text-gold-400" },
          { label: "Pending", value: formatCurrency(totalPending), icon: DollarSign, color: "text-amber-400" },
          { label: "Total Invoices", value: invoices.length, icon: FileText, color: "text-silver-400" },
          { label: "Paid", value: invoices.filter((i) => i.status === "PAID").length, icon: DollarSign, color: "text-emerald-400" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 glass-gold rounded-xl flex items-center justify-center flex-shrink-0">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-white/40">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL", "DRAFT", "SENT", "PAID", "OVERDUE"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium uppercase tracking-wide transition-all ${
                filter === s ? "bg-gold-500/10 text-gold-300 border border-gold-500/15" : "glass text-white/40 hover:text-white border border-white/5"
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
      ) : (
        <div className="space-y-3">
          {filtered.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-2xl p-5 border border-white/6 hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-silver-400/60" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="font-mono font-semibold text-white">{inv.invoiceNumber}</p>
                      <Badge variant={STATUS_MAP[inv.status] || "secondary"}>{inv.status}</Badge>
                    </div>
                    <p className="text-xs text-white/40 mt-0.5 truncate">
                      {inv.client.name} · {inv.vehicle ? `${inv.vehicle.make} ${inv.vehicle.model}` : "General"} · Issued {inv.issueDate ? formatDate(inv.issueDate) : "Now"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">{formatCurrency(inv.total)}</p>
                    <p className="text-xs text-white/30">Due {inv.dueDate ? formatDate(inv.dueDate) : "Soon"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:glass-gold transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:glass-gold transition-all">
                      <Download className="w-4 h-4" />
                    </button>
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
