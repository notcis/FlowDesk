"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserRole } from "@/lib/constants";
import { UserSummary } from "@/types";

interface RoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserSummary;
}

const mockUsers: Record<UserRole, UserSummary> = {
  USER: {
    id: "usr-1",
    name: "สมชาย ชัยชนะ (User)",
    email: "user@flowdesk.local",
    role: "USER",
    department: "Engineering (วิศวกรรม/พัฒนา)",
    image: null,
  },
  MANAGER: {
    id: "usr-2",
    name: "วิภาดา สถิตย์ธรรม (Manager)",
    email: "manager@flowdesk.local",
    role: "MANAGER",
    department: "IT & Operations",
    image: null,
  },
  ADMIN: {
    id: "usr-3",
    name: "กิตติพงษ์ ผู้ดูแลระบบ (Admin)",
    email: "admin@flowdesk.local",
    role: "ADMIN",
    department: "Central Admin",
    image: null,
  },
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("USER");

  useEffect(() => {
    const saved = localStorage.getItem("flowdesk_preview_role") as UserRole;
    if (saved && (saved === "USER" || saved === "MANAGER" || saved === "ADMIN")) {
      setCurrentRole(saved);
    }
  }, []);

  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem("flowdesk_preview_role", role);
  };

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setRole: handleSetRole,
        currentUser: mockUsers[currentRole],
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
