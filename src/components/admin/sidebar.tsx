"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Car, Users, Calendar, FileText, Settings,
  LogOut, Zap, ChevronLeft, ChevronRight, Wrench, BarChart3,
  Shield, Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── ADMIN PORTAL CONFIG ───────────────────────────────────────────────────
// To use this admin portal as a standalone project:
// 1. Copy the /admin folder and /components/admin folder
// 2. Update the API_BASE_URL below to point to your backend
// 3. Keep next-auth configured with same NEXTAUTH_SECRET
// ──────────────────────────────────────────────────────────────────────────

export const ADMIN_API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/admin/customers", icon: Users, label: "Customers" },
      { href: "/admin/vehicles", icon: Car, label: "Vehicles" },
      { href: "/admin/appointments", icon: Calendar, label: "Appointments" },
      { href: "/admin/invoices", icon: FileText, label: "Invoices" },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/services", icon: Wrench, label: "Services" },
      { href: "/admin/staff", icon: Shield, label: "Staff" },
      { href: "/admin/settings", icon: Settings, label: "Settings" },
    ],
  },
];

interface AdminSidebarProps {
  userName?: string;
  userEmail?: string;
}

export function AdminSidebar({ userName, userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative h-screen bg-[#030303] border-r border-gold-500/8 flex flex-col overflow-hidden flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 pb-3 border-b border-gold-500/8">
        <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold-700/30 glow-gold">
          <Zap className="w-4.5 h-4.5 text-black" fill="black" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <span className="text-lg font-bold text-white whitespace-nowrap">
                Auto<span className="text-gold">Hub</span>
              </span>
              <p className="text-[9px] text-gold-500/50 uppercase tracking-[0.2em] font-medium">Admin Console</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-gold-gradient rounded-full flex items-center justify-center text-black z-10 hover:scale-110 transition-transform shadow-lg shadow-gold-700/30"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Nav Groups */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[9px] font-semibold text-white/20 uppercase tracking-[0.2em] px-3 mb-1.5"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                      isActive
                        ? "bg-gold-500/10 text-gold-300 border border-gold-500/15"
                        : "text-white/40 hover:text-white/80 hover:bg-white/3"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-4.5 h-4.5 flex-shrink-0",
                        isActive ? "text-gold-400" : "group-hover:text-white/70"
                      )}
                    />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-sm font-medium whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && !collapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Notifications & User */}
      <div className="p-3 border-t border-gold-500/8 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/30 hover:text-white/70 hover:bg-white/3 transition-all">
          <Bell className="w-4.5 h-4.5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm whitespace-nowrap overflow-hidden">
                Notifications
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-400/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm whitespace-nowrap overflow-hidden">
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {!collapsed && (
          <div className="mt-2 px-3 py-3 bg-gold-500/5 rounded-xl border border-gold-500/10">
            <p className="text-sm font-semibold text-gold-300 truncate">{userName}</p>
            <p className="text-xs text-white/30 truncate">{userEmail}</p>
            <p className="text-[9px] text-gold-500/40 uppercase tracking-widest mt-0.5 font-medium">Administrator</p>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
