"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "./role-context";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentRole } = useRole();

  const navItems = [
    {
      title: "แดชบอร์ดภาพรวม",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      title: "รายการคำขอ",
      href: "/requests",
      icon: ClipboardList,
      active: pathname === "/requests",
    },
    {
      title: "สร้างคำขอใหม่",
      href: "/requests/new",
      icon: PlusCircle,
      active: pathname === "/requests/new",
      highlight: true,
    },
  ];

  const adminItems = [
    {
      title: "จัดการระบบ (Admin)",
      href: "/admin",
      icon: ShieldCheck,
      active: pathname.startsWith("/admin"),
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 lg:hidden dark:border-slate-800">
          <span className="font-bold text-slate-900 dark:text-white">เมนูนำทาง</span>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Body */}
        <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4">
          <div className="space-y-6">
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                เมนูหลัก
              </p>
              <nav className="mt-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        item.active
                          ? "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200",
                        item.highlight && !item.active && "text-sky-600 dark:text-sky-400 font-semibold"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", item.active ? "text-sky-600 dark:text-sky-400" : "")} />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quick Status Filters */}
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                สถานะงานด่วน
              </p>
              <div className="mt-2 space-y-1">
                <Link
                  href="/requests?status=PENDING_APPROVAL"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  <span className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-amber-500" />
                    รอการอนุมัติ
                  </span>
                </Link>
                <Link
                  href="/requests?status=IN_PROGRESS"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  <span className="flex items-center gap-2.5">
                    <AlertTriangle className="h-4 w-4 text-indigo-500" />
                    กำลังดำเนินการ
                  </span>
                </Link>
                <Link
                  href="/requests?status=RESOLVED"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  <span className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    เสร็จสิ้น
                  </span>
                </Link>
              </div>
            </div>

            {/* Admin Section (Protected by Role) */}
            {currentRole === "ADMIN" && (
              <div>
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-rose-500">
                  สิทธิ์ผู้ดูแลระบบ
                </p>
                <nav className="mt-2 space-y-1">
                  {adminItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          item.active
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-semibold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                        )}
                      >
                        <Icon className="h-4 w-4 text-rose-600" />
                        {item.title}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}
          </div>

          {/* Role Status Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-950">
            <p className="font-semibold text-slate-700 dark:text-slate-300">สิทธิ์ปัจจุบัน:</p>
            <p className="mt-0.5 font-bold text-sky-600 dark:text-sky-400">
              {currentRole === "USER" && "USER (ผู้ใช้งานทั่วไป/พนักงาน)"}
              {currentRole === "MANAGER" && "MANAGER (หัวหน้างาน/ผู้อนุมัติ)"}
              {currentRole === "ADMIN" && "ADMIN (ผู้ดูแลระบบสูงสุด)"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {currentRole === "USER" && "• ส่งคำขอใหม่และติดตามผล"}
              {currentRole === "MANAGER" && "• อนุมัติ/ปฏิเสธ และมอบหมายงาน"}
              {currentRole === "ADMIN" && "• จัดการคำขอและสิทธิ์ทั้งหมด"}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
