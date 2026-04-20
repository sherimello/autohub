"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Storage } from "@/lib/storage";
import { getInitials, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, Plus, Mail, Phone, Calendar } from "lucide-react";

export default function StaffPage() {
  const { data: session } = useSession();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load staff from localStorage
    const staffMembers = Storage.getStaff();
    const appts = Storage.getAppointments();

    // Map staff with appointment counts
    const staffWithCounts = staffMembers.map(member => ({
      ...member,
      _count: {
        appointments: appts.filter((a: any) => a.assignedTo === member.id).length
      }
    }));

    setStaff(staffWithCounts);
    setLoading(false);
  }, []);

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gold-400/50 text-xs uppercase tracking-[0.3em] mb-1 font-medium">Admin</p>
          <h1 className="text-3xl font-bold text-white">Staff <span className="text-gold">Management</span></h1>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 max-w-sm">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-white">{staff.length}</p>
            <p className="text-xs text-white/40 uppercase tracking-wider mt-0.5">Team Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gold-400">{staff.filter((s) => s.role === "ADMIN").length}</p>
            <p className="text-xs text-white/40 uppercase tracking-wider mt-0.5">Admins</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <Card key={member.id} className="hover:border-gold-500/20 transition-all duration-300 group">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="text-lg">{getInitials(member.name || "U")}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-gold-300 transition-colors">
                    {member.name}
                  </h3>
                  <div className="mt-1">
                    <Badge variant={member.role === "ADMIN" ? "gold" : "secondary"}>
                      {member.role === "ADMIN" ? (
                        <span className="flex items-center gap-1"><Shield className="w-2.5 h-2.5" /> Admin</span>
                      ) : (
                        "Staff"
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-white/40 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gold-400/50" />
                  {member.email}
                </p>
                {member.phone && (
                  <p className="text-xs text-white/40 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gold-400/50" />
                    {member.phone}
                  </p>
                )}
                <p className="text-xs text-white/30 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {member.createdAt ? formatDate(member.createdAt) : "Recently"}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{member._count.appointments}</p>
                  <p className="text-[9px] text-white/30 uppercase tracking-wider">Handled</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
