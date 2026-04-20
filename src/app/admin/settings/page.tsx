import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, Shield, Bell, Palette, Globe, Key, ChevronRight } from "lucide-react";

const settingGroups = [
  {
    title: "General",
    icon: Globe,
    items: [
      { label: "Company Name", value: "AutoHub Workshop", description: "Displayed across all portals" },
      { label: "Timezone", value: "America/New_York", description: "System-wide timezone" },
      { label: "Currency", value: "USD ($)", description: "Invoice currency format" },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    items: [
      { label: "Two-Factor Auth", value: "Enabled", description: "For all admin accounts", badge: "success" },
      { label: "Session Timeout", value: "24 hours", description: "Auto-logout after inactivity" },
      { label: "IP Whitelist", value: "Not configured", description: "Restrict admin access by IP" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Email Alerts", value: "Enabled", description: "For new bookings and payments", badge: "success" },
      { label: "SMS Notifications", value: "Disabled", description: "Text alerts for appointments" },
      { label: "In-app Alerts", value: "Enabled", description: "Real-time dashboard alerts", badge: "success" },
    ],
  },
  {
    title: "Database",
    icon: Database,
    items: [
      { label: "Database", value: "PostgreSQL 15", description: "Primary data store" },
      { label: "Auto Backup", value: "Daily at 2:00 AM", description: "Automated backup schedule" },
      { label: "Last Backup", value: "Today 02:00 AM", description: "Most recent backup", badge: "success" },
    ],
  },
];

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session) return null;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <p className="text-gold-400/50 text-xs uppercase tracking-[0.3em] mb-1 font-medium">Admin</p>
        <h1 className="text-3xl font-bold text-white">System <span className="text-gold">Settings</span></h1>
        <p className="text-white/30 text-sm mt-1">Configure your AutoHub platform</p>
      </div>

      {/* API Keys Section */}
      <Card className="border-gold-500/10">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-10 h-10 glass-gold rounded-xl flex items-center justify-center">
            <Key className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <CardTitle>API Configuration</CardTitle>
            <p className="text-xs text-white/40 mt-0.5">For standalone admin portal setup</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="glass rounded-xl p-4 border border-white/5 font-mono text-xs space-y-2">
            <p className="text-white/30"># Admin Portal Environment Variables</p>
            <p><span className="text-gold-400/70">DATABASE_URL</span>=<span className="text-emerald-400/70">&quot;postgresql://...&quot;</span></p>
            <p><span className="text-gold-400/70">NEXTAUTH_SECRET</span>=<span className="text-emerald-400/70">&quot;same-as-main-backend&quot;</span></p>
            <p><span className="text-gold-400/70">NEXTAUTH_URL</span>=<span className="text-emerald-400/70">&quot;https://admin.autohub.com&quot;</span></p>
            <p><span className="text-gold-400/70">NEXT_PUBLIC_API_URL</span>=<span className="text-emerald-400/70">&quot;https://api.autohub.com&quot;</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Settings Groups */}
      {settingGroups.map((group) => (
        <Card key={group.title}>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
              <group.icon className="w-5 h-5 text-silver-400" />
            </div>
            <CardTitle>{group.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {group.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 glass rounded-xl border border-white/5 hover:border-white/10 cursor-pointer group transition-all">
                <div>
                  <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{item.label}</p>
                  <p className="text-xs text-white/30 mt-0.5">{item.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  {item.badge ? (
                    <Badge variant={item.badge as Parameters<typeof Badge>[0]["variant"]}>{item.value}</Badge>
                  ) : (
                    <span className="text-sm text-white/50">{item.value}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-gold-400 transition-colors" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
