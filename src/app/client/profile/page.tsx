"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Storage } from "@/lib/storage";
import { getInitials, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const userId = session.user.id;
    const allUsers = Storage.getUsers();
    const foundUser = allUsers.find((u: any) => u.id === userId);

    if (foundUser) {
      const vehicles = Storage.getVehiclesByOwner(userId);
      const appointments = Storage.getAppointmentsByClient(userId);
      const invoices = Storage.getInvoicesByClient(userId);

      setUser({
        ...foundUser,
        _count: {
          vehicles: vehicles.length,
          appointments: appointments.length,
          invoices: invoices.length,
        },
      });
    }
    setLoading(false);
  }, [session]);

  if (loading || !session || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Client Portal</p>
        <h1 className="text-3xl font-bold text-white">My <span className="text-gold">Profile</span></h1>
        <p className="text-white/30 text-sm mt-1">(Mock Mode)</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-2xl">{getInitials(user.name || "U")}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-white/50 text-sm mb-3">{user.email}</p>
              <div className="flex items-center gap-2">
                <Badge variant="gold">Client</Badge>
                <Badge variant="secondary">Member since {user.createdAt ? formatDate(user.createdAt) : "Recently"}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/8">
            {[
              { label: "Vehicles", value: user._count.vehicles },
              { label: "Appointments", value: user._count.appointments },
              { label: "Invoices", value: user._count.invoices },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: user.email },
            { icon: Phone, label: "Phone", value: user.phone || "Not provided" },
            { icon: MapPin, label: "Address", value: user.address || "Not provided" },
            { icon: Calendar, label: "Member Since", value: user.createdAt ? formatDate(user.createdAt) : "Recently" },
          ].map((field) => (
            <div key={field.label} className="flex items-start gap-3 p-3 glass rounded-xl border border-white/5">
              <div className="w-9 h-9 rounded-lg glass-gold flex items-center justify-center flex-shrink-0">
                <field.icon className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-0.5">{field.label}</p>
                <p className="text-sm text-white/80">{field.value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold-400" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 glass rounded-xl border border-white/5">
            <div>
              <p className="text-sm font-medium text-white/80">Password</p>
              <p className="text-xs text-white/40">Last updated recently</p>
            </div>
            <button className="text-xs text-gold-400 hover:text-gold-300 transition-colors font-medium">
              Change Password
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
