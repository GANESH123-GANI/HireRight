"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Branding() {
  const { organization } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    // On the public landing page or when no organization is active,
    // ALWAYS remove any inline override and use the default warm brand palette (#D97757)
    if (!organization || pathname === "/") {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--primary-dark");
      root.style.removeProperty("--primary-hover");
      root.style.removeProperty("--primary-glow");
      root.style.removeProperty("--primary-glow-strong");
      root.style.removeProperty("--secondary");
      document.title = "HireRight AI — Autonomous AI Video Interviews & MediaPipe Proctoring";
      return;
    }

    // Only apply custom colors if they are not the legacy #4f46e5/#7c3aed defaults
    if (organization.primaryColor && organization.primaryColor !== "#4f46e5") {
      root.style.setProperty("--primary", organization.primaryColor);
    } else {
      root.style.removeProperty("--primary");
    }

    if (organization.accentColor && organization.accentColor !== "#7c3aed") {
      root.style.setProperty("--primary-dark", organization.accentColor);
    } else {
      root.style.removeProperty("--primary-dark");
    }

    if (organization.name && organization.name !== "Techcitta") {
      document.title = `${organization.name} | AI-Powered Talent Screening`;
    }

    return () => {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--primary-dark");
      root.style.removeProperty("--primary-hover");
      root.style.removeProperty("--primary-glow");
      root.style.removeProperty("--primary-glow-strong");
      root.style.removeProperty("--secondary");
    };
  }, [organization, pathname]);

  return null;
}
