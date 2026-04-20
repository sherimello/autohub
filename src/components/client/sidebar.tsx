"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Car, Calendar, FileText, User, LogOut,
  Zap, ChevronLeft, ChevronRight, Settings, Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/client/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/client/vehicles", icon: Car, label: "My Vehicles" },
  { href: "/client/appointments", icon: Calendar, label: "Appointments" },
  { href: "/client/invoices", icon: FileText, label: "Invoices" },
  { href: "/client/profile", icon: User, label: "Profile" },
];

interface SidebarProps {
  userName?: string;
  userEmail?: string;
}

export function ClientSidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative h-screen glass-dark border-r border-white/6 flex flex-col overflow-hidden flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-white/6">
        <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold-700/20">
          <Zap className="w-4.5 h-4.5 text-black" fill="black" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-lg font-bold text-white whitespace-nowrap overflow-hidden"
            >
              Auto<span className="text-gold">Hub</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 glass-gold rounded-full flex items-center justify-center text-gold-400 border border-gold-500/20 z-10 hover:scale-110 transition-transform"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                isActive
                  ? "glass-gold text-gold-300 border border-gold-500/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-gold-400" : "group-hover:text-white/80")} />
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
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-3 border-t border-white/6 space-y-1">
        <Link
          href="/client/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm whitespace-nowrap overflow-hidden">
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
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
          <div className="mt-3 px-3 py-3 glass rounded-xl border border-white/5">
            <p className="text-sm font-medium text-white/90 truncate">{userName}</p>
            <p className="text-xs text-white/40 truncate">{userEmail}</p>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
