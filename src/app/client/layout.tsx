import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ClientSidebar } from "@/components/client/sidebar";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) redirect("/auth/login");
  if (session.user.role === "ADMIN" || session.user.role === "STAFF") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex h-screen bg-[#060606] overflow-hidden">
      <ClientSidebar userName={session.user.name ?? ""} userEmail={session.user.email ?? ""} />
      <main className="flex-1 overflow-auto">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}
