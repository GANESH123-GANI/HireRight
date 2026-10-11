"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  name: string | null;
  phone?: string | null;
  role?: string;
  organizationId?: string;
  emailVerified?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  isGovernment: boolean;
  plan: string;
}

const DEFAULT_USER: User = {
  id: "ae84fe97-4617-44d4-aaca-d07a55030689",
  email: "admin@techcitta.com",
  name: "Admin User",
  role: "admin",
  organizationId: "36c03a74-334a-4bcf-b069-ac61e1fa8325",
  emailVerified: true,
};

const DEFAULT_CANDIDATE: User = {
  id: "a024af62-5ea3-4fbd-8387-31a14995f1e8",
  email: "candidate@techcitta.com",
  name: "Alex Morgan",
  role: "jobseeker",
  organizationId: "36c03a74-334a-4bcf-b069-ac61e1fa8325",
  emailVerified: true,
};

const DEFAULT_ORG: Organization = {
  id: "36c03a74-334a-4bcf-b069-ac61e1fa8325",
  name: "HireRight AI",
  slug: "hireright",
  logoUrl: null,
  primaryColor: "#D97757",
  accentColor: "#B95F42",
  isGovernment: false,
  plan: "enterprise",
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  organization: Organization | null;
  login: (token: string, user: User, organization: Organization) => void;
  logout: () => void;
  loginAsDemo: (role: "admin" | "jobseeker") => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      // Clean up any stale bypass or unverified sessions
      if (
        storedToken === "bypass-session" ||
        storedToken === "cookie-session" ||
        (storedUser && (storedUser.includes("bypass-session") || storedUser.includes("candidate@techcitta.com")))
      ) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("organization");
      }
    } catch (e) {
      console.warn("Storage sync warning:", e);
    }

    // Verify session with server (handles SSO redirects & cookie sessions)
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data && data.authenticated && data.user) {
          setUser(data.user);
          setToken("active-session");
          if (data.organization) setOrganization(data.organization);
          try {
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", "cookie-session");
            if (data.organization) {
              localStorage.setItem("organization", JSON.stringify(data.organization));
            }
          } catch {}
        } else {
          // If server reports not authenticated, clear user and clean storage
          setUser(null);
          setToken(null);
          setOrganization(null);
          try {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("organization");
          } catch {}
        }
      })
      .catch((err) => {
        console.warn("Session check error:", err);
        setUser(null);
        setToken(null);
        setOrganization(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (newToken: string, newUser: User, newOrganization: Organization) => {
    try {
      localStorage.setItem("token", newToken || "cookie-session");
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("organization", JSON.stringify(newOrganization));
    } catch {}
    setUser(newUser);
    setToken(newToken || "cookie-session");
    setOrganization(newOrganization);
  };

  const loginAsDemo = async (role: "admin" | "jobseeker") => {
    const targetUser = role === "admin" ? DEFAULT_USER : DEFAULT_CANDIDATE;
    try {
      localStorage.setItem("token", "cookie-session");
      localStorage.setItem("user", JSON.stringify(targetUser));
      localStorage.setItem("organization", JSON.stringify(DEFAULT_ORG));
    } catch {}
    setUser(targetUser);
    setToken("cookie-session");
    setOrganization(DEFAULT_ORG);

    try {
      await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
    } catch (e) {
      console.warn("Demo cookie setup:", e);
    }

    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/profile");
    }
  };

  const logout = () => {
    void fetch("/api/auth/logout", { method: "POST" });
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("organization");
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.style.removeProperty("--primary");
      document.documentElement.style.removeProperty("--primary-dark");
      document.documentElement.style.removeProperty("--primary-hover");
      document.documentElement.style.removeProperty("--primary-glow");
      document.documentElement.style.removeProperty("--primary-glow-strong");
      document.documentElement.style.removeProperty("--secondary");
    }
    setUser(null);
    setToken(null);
    setOrganization(null);
    if (typeof window !== "undefined") {
      window.location.href = "/";
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, organization, login, logout, loginAsDemo, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
