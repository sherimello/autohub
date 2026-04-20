import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

// ─── ADMIN PORTAL LAYOUT ───────────────────────────────────────────────────
// This admin portal is self-contained. To extract as a separate project:
// 1. Copy /app/(admin), /components/admin, /lib/auth.ts, /lib/db.ts
// 2. Set NEXTAUTH_SECRET & DATABASE_URL in your new project .env
// 3. The admin portal connects to the same database/backend
// ──────────────────────────────────────────────────────────────────────────

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) redirect("/auth/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "STAFF") {
    redirect("/client/dashboard");
  }

  return (
    <div className="flex h-screen bg-[#030303] overflow-hidden">
      <AdminSidebar userName={session.user.name ?? ""} userEmail={session.user.email ?? ""} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Top Bar */}
        <div className="h-14 border-b border-gold-500/8 bg-[#030303] flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-xs text-gold-400/60 uppercase tracking-widest font-medium">Live Admin Console</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/20">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
