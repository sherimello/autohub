"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import { Storage } from "@/lib/storage";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Storage.init();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
