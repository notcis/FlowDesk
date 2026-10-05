"use client";

import Link from "next/link";
import { useRole } from "@/components/shared/role-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, Users, Settings, Database, Activity, ArrowLeft } from "lucide-react";

export function AdminView() {
  const { currentRole, setRole } = useRole();

  if (currentRole !== "ADMIN") {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          ไม่มีสิทธิ์เข้าถึง (Access Restricted)
        </h2>
        <p className="text-sm text-slate-500">
          หน้านี้สงวนไว้สำหรับผู้ดูแลระบบ (ADMIN) เท่านั้น คุณกำลังอยู่ในบทบาท{" "}
          <strong className="text-slate-800 dark:text-slate-200">{currentRole}</strong>
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="default" onClick={() => setRole("ADMIN")} className="gap-2 text-xs">
            <ShieldCheck className="h-4 w-4" />
            สลับเป็น Role ADMIN เพื่อทดสอบ
          </Button>
          <Link href="/">
            <Button variant="outline" className="text-xs">
              กลับไปหน้าแรก
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const mockSystemUsers = [
    {
      id: "usr-1",
      name: "สมชาย ชัยชนะ",
      email: "user@flowdesk.local",
      role: "USER",
      department: "Engineering",
      requestsCount: 3,
    },
    {
      id: "usr-2",
      name: "วิภาดา สถิตย์ธรรม",
      email: "manager@flowdesk.local",
      role: "MANAGER",
      department: "IT & Operations",
      requestsCount: 1,
    },
    {
      id: "usr-3",
      name: "กิตติพงษ์ ผู้ดูแลระบบ",
      email: "admin@flowdesk.local",
      role: "ADMIN",
      department: "Central Admin",
      requestsCount: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
              Admin Only
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              ศูนย์จัดการระบบ (Administration Center)
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            ภาพรวมการตั้งค่าสิทธิ์ ผู้ใช้งาน และฐานข้อมูล FlowDesk
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> แดชบอร์ด
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500">ผู้ใช้งานทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 คน</div>
            <p className="text-xs text-slate-500 mt-1">1 User, 1 Manager, 1 Admin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500">ฐานข้อมูล (Prisma / MySQL)</CardTitle>
            <Database className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">เชื่อมต่อพร้อมใช้งาน</div>
            <p className="text-xs text-slate-500 mt-1">MySQL Database Engine Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase text-slate-500">การตรวจสอบสิทธิ์</CardTitle>
            <Activity className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Better Auth</div>
            <p className="text-xs text-slate-500 mt-1">RBAC: USER | MANAGER | ADMIN</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">รายชื่อผู้ใช้งานและบทบาทในองค์กร</CardTitle>
          <CardDescription className="text-xs">
            จัดการและตรวจสอบสิทธิ์ของผู้ใช้งานในระบบ
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                <tr>
                  <th className="px-5 py-3">ชื่อ - สกุล</th>
                  <th className="px-5 py-3">อีเมล</th>
                  <th className="px-5 py-3">แผนก</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">คำขอในระบบ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mockSystemUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs">{u.email}</td>
                    <td className="px-5 py-3.5 text-xs">{u.department}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                          u.role === "ADMIN"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : u.role === "MANAGER"
                            ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                            : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs">{u.requestsCount} คำขอ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
