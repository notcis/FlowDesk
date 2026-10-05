"use client";

import Link from "next/link";
import { useRole } from "./role-context";
import { UserRole } from "@/lib/constants";
import { LayoutDashboard, PlusCircle, Shield, User, Users, Menu } from "lucide-react";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { currentRole, setRole, currentUser } = useRole();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden dark:border-slate-700 dark:text-slate-200"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900 dark:text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white font-black text-sm">
            FD
          </div>
          <span className="text-lg">FlowDesk</span>
          <span className="hidden rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800 sm:inline-block dark:bg-sky-950 dark:text-sky-300">
            Internal Workflow
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Role Simulator Switcher */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950">
          <span className="hidden px-2 text-xs font-medium text-slate-500 md:inline">โหมดทดสอบ Role:</span>
          {(["USER", "MANAGER", "ADMIN"] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => setRole(role)}
              className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
                currentRole === role
                  ? "bg-white text-sky-700 shadow-sm dark:bg-slate-800 dark:text-sky-300"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {role === "USER" && "User"}
              {role === "MANAGER" && "Manager"}
              {role === "ADMIN" && "Admin"}
            </button>
          ))}
        </div>

        {/* Current User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-semibold text-xs dark:bg-slate-700 dark:text-slate-200">
            {currentRole === "ADMIN" ? (
              <Shield className="h-4 w-4 text-rose-600" />
            ) : currentRole === "MANAGER" ? (
              <Users className="h-4 w-4 text-sky-600" />
            ) : (
              <User className="h-4 w-4 text-emerald-600" />
            )}
          </div>
          <div className="hidden text-left lg:block">
            <p className="text-xs font-medium leading-none text-slate-900 dark:text-slate-100">{currentUser.name}</p>
            <p className="text-[11px] text-slate-500 leading-none mt-1">{currentUser.department}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
