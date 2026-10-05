"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRole } from "@/components/shared/role-context";
import { getRequests, getRequestStats, updateRequestStatus } from "@/lib/actions/request-actions";
import { QUERY_KEYS } from "@/lib/query-client";
import { StatusBadge, PriorityBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatThaiDate } from "@/lib/utils";
import { REQUEST_CATEGORY_CONFIG, RequestStatus } from "@/lib/constants";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Package,
  Laptop,
  Building,
  CreditCard,
  FileText,
  Check,
  XCircle,
} from "lucide-react";

export function DashboardView() {
  const { currentRole, currentUser } = useRole();
  const queryClient = useQueryClient();
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Queries
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: QUERY_KEYS.requests.stats(currentRole),
    queryFn: async () => {
      const res = await getRequestStats(currentRole, currentUser.id);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });

  const { data: recentData, isLoading: isLoadingRecent } = useQuery({
    queryKey: QUERY_KEYS.requests.list({ roleView: currentRole, pageSize: 5 }),
    queryFn: async () => {
      const res = await getRequests({
        roleView: currentRole,
        currentUserId: currentUser.id,
        pageSize: 5,
        page: 1,
      });
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });

  // Mutation for Approving / Rejecting
  const statusMutation = useMutation({
    mutationFn: async ({ requestId, newStatus }: { requestId: string; newStatus: RequestStatus }) => {
      const res = await updateRequestStatus(requestId, newStatus, currentUser);
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: (data) => {
      setActionMessage(data.message || "อัปเดตสถานะเรียบร้อยแล้ว");
      setTimeout(() => setActionMessage(null), 4000);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.requests.all });
    },
  });

  const stats = statsData || {
    total: 0,
    pendingApproval: 0,
    approved: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    urgentCount: 0,
    totalBudget: 0,
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "EQUIPMENT":
        return <Package className="h-4 w-4 text-sky-600" />;
      case "IT_SUPPORT":
        return <Laptop className="h-4 w-4 text-purple-600" />;
      case "FACILITY":
        return <Building className="h-4 w-4 text-emerald-600" />;
      case "EXPENSE":
        return <CreditCard className="h-4 w-4 text-amber-600" />;
      default:
        return <FileText className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            แดชบอร์ดภาพรวม (Dashboard)
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            ระบบบริหารจัดการคำขอและติดตามสถานะงานในทีม FlowDesk
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/requests">
            <Button variant="outline" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              รายการทั้งหมด
            </Button>
          </Link>
          <Link href="/requests/new">
            <Button className="gap-2 shadow-xs">
              <PlusCircle className="h-4 w-4" />
              สร้างคำขอใหม่
            </Button>
          </Link>
        </div>
      </div>

      {/* Role Alert / Notification Banner */}
      {actionMessage && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-emerald-600 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-4 dark:border-sky-900/50 dark:bg-sky-950/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white font-bold text-sm">
            {currentRole[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-sky-900 dark:text-sky-200">
              เข้าสู่ระบบในมุมมอง: <span className="underline">{currentRole}</span> ({currentUser.name})
            </p>
            <p className="text-xs text-sky-700 dark:text-sky-400 mt-0.5">
              {currentRole === "USER" && "คุณสามารถสร้างคำขอใหม่และตรวจสอบความคืบหน้าของงานที่คุณขอได้ที่นี่"}
              {currentRole === "MANAGER" && `มีคำขอ ${stats.pendingApproval} รายการที่รอการตรวจสอบและอนุมัติจากคุณ`}
              {currentRole === "ADMIN" && "คุณมีสิทธิ์เข้าถึง ดูแล จัดการข้อมูล และตรวจสอบกิจกรรมทั้งหมดในระบบ"}
            </p>
          </div>
        </div>
        {currentRole !== "USER" && stats.pendingApproval > 0 && (
          <Link href="/requests?status=PENDING_APPROVAL">
            <Button size="sm" variant="default" className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5 text-xs whitespace-nowrap">
              <Clock className="h-3.5 w-3.5" />
              ดูงานรออนุมัติ ({stats.pendingApproval})
            </Button>
          </Link>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Requests */}
        <Card className="hover:border-slate-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              คำขอทั้งหมด
            </CardTitle>
            <div className="rounded-md bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <ClipboardList className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
            )}
            <p className="mt-1 text-xs text-slate-500">
              งบรวมคำขอ: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(stats.totalBudget)}</span>
            </p>
          </CardContent>
        </Card>

        {/* Pending Approval */}
        <Card className="border-amber-200 bg-amber-50/20 hover:border-amber-300 transition-colors dark:border-amber-900/60 dark:bg-amber-950/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              รอการอนุมัติ
            </CardTitle>
            <div className="rounded-md bg-amber-100 p-2 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                {stats.pendingApproval}
              </div>
            )}
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              ต้องดำเนินการพิจารณา
            </p>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="hover:border-indigo-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              กำลังดำเนินการ
            </CardTitle>
            <div className="rounded-md bg-indigo-100 p-2 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
                {stats.inProgress}
              </div>
            )}
            <p className="mt-1 text-xs text-slate-500">
              อนุมัติแล้ว: {stats.approved} งาน
            </p>
          </CardContent>
        </Card>

        {/* Resolved */}
        <Card className="hover:border-emerald-300 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              เสร็จสิ้นแล้ว
            </CardTitle>
            <div className="rounded-md bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {stats.resolved}
              </div>
            )}
            <p className="mt-1 text-xs text-slate-500">
              งานเร่งด่วนคงค้าง: <span className={stats.urgentCount > 0 ? "font-bold text-rose-600" : ""}>{stats.urgentCount}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Shortcut Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(REQUEST_CATEGORY_CONFIG).map(([key, config]) => (
          <Link
            key={key}
            href={`/requests?category=${key}`}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-sky-300 transition-all text-center dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <div className="mb-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
              {getCategoryIcon(key)}
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {config.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Recent Requests Table Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <CardTitle className="text-base font-bold">คำขอล่าสุดในระบบ (Recent Requests)</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              แสดง 5 รายการล่าสุดที่มีการอัปเดต
            </CardDescription>
          </div>
          <Link href="/requests" className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 dark:text-sky-400">
            ดูทั้งหมด <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingRecent ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !recentData?.items.length ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">ไม่พบคำขอในขณะนี้</h3>
              <p className="mt-1 text-xs text-slate-500">เริ่มต้นด้วยการส่งคำขอใหม่เข้าสู่ระบบ</p>
              <div className="mt-4">
                <Link href="/requests/new">
                  <Button size="sm" className="gap-1.5 text-xs">
                    <PlusCircle className="h-4 w-4" /> สร้างคำขอแรก
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50/80 transition-colors gap-3 dark:hover:bg-slate-800/40"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-500">
                          {item.requestNumber}
                        </span>
                        <StatusBadge status={item.status} />
                        <PriorityBadge priority={item.priority} />
                      </div>
                      <h4 className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>ผู้ขอ: <strong className="text-slate-700 dark:text-slate-300">{item.requester?.name || "พนักงาน"}</strong></span>
                        <span>แผนก: {item.department}</span>
                        {item.budget && (
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            งบประมาณ: {formatCurrency(item.budget)}
                          </span>
                        )}
                        <span>{formatThaiDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions according to Role */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {(currentRole === "MANAGER" || currentRole === "ADMIN") && item.status === "PENDING_APPROVAL" && (
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="success"
                          className="h-8 px-2.5 text-xs gap-1"
                          isLoading={statusMutation.isPending}
                          onClick={() => statusMutation.mutate({ requestId: item.id, newStatus: "APPROVED" })}
                        >
                          <Check className="h-3.5 w-3.5" />
                          อนุมัติ
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 px-2.5 text-xs gap-1"
                          isLoading={statusMutation.isPending}
                          onClick={() => statusMutation.mutate({ requestId: item.id, newStatus: "REJECTED" })}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          ปฏิเสธ
                        </Button>
                      </div>
                    )}
                    <Link href={`/requests?search=${encodeURIComponent(item.requestNumber)}`}>
                      <Button size="sm" variant="outline" className="h-8 px-3 text-xs">
                        ดูรายละเอียด
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
