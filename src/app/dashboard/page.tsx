"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role === "admin" || user.role === "employer") {
      router.replace("/admin");
    } else {
      router.replace("/profile");
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center text-[#382A25] text-sm font-medium">
      Redirecting to dashboard...
    </div>
  );
}
