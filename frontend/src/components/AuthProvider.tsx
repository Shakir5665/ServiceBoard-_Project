"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAuthRoute = pathname === "/login" || pathname === "/register";

    if (!token && !isAuthRoute) {
      router.push("/login");
    } else if (token && isAuthRoute) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBEB]">
        <div className="w-12 h-12 rounded-full border-4 border-orange-100 border-t-orange-600 animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
