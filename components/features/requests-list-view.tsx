"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRole } from "@/components/shared/role-context";
import { getRequests, updateRequestStatus } from "@/lib/actions/request-actions";
import { QUERY_KEYS } from "@/lib/query-client";
import { StatusBadge, PriorityBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatThaiDate } from "@/lib/utils";
import {
  DEPARTMENTS,
  REQUEST_CATEGORIES,
  REQUEST_CATEGORY_CONFIG,
  REQUEST_PRIORITY,
  REQUEST_STATUS,
  RequestCategory,
  RequestPriority,
  RequestStatus,
} from "@/lib/constants";
import {
  Search,
  Filter,
  PlusCircle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Package,
  Laptop,
  Building,
  CreditCard,
  FileText,
  Check,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

export function RequestsListView() {
  const { currentRole, currentUser } = useRole();
  const queryClient = useQueryClient();

  // Filters state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RequestStatus | "ALL">("ALL");
  const [priority, setPriority] = useState<RequestPriority | "ALL">("ALL");
  const [category, setCategory] = useState<RequestCategory | "ALL">("ALL");
  const [department, setDepartment] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // TanStack Query for request list
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.requests.list({
      search,
      status,
      priority,
      category,
      department,
      page,
      roleView: currentRole,
      currentUserId: currentUser.id,
    }),
    queryFn: async () => {
      const res = await getRequests({
        search,
        status,
        priority,
        category,
        department,
        page,
        pageSize: 10,
        roleView: currentRole,
        currentUserId: currentUser.id,
      });
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });

  // Status mutation for Manager / Admin
  const statusMutation = useMutation({
    mutationFn: async ({ requestId, newStatus, notes }: { requestId: string; newStatus: RequestStatus; notes?: string }) => {
      const res = await updateRequestStatus(requestId, newStatus, currentUser, notes);
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: (res) => {
      setActionFeedback(res.message || "อัปเดตสถานะสำเร็จ");
      setTimeout(() => setActionFeedback(null), 4000);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.requests.all });
    },
  });

  const resetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setPriority("ALL");
    setCategory("ALL");
    setDepartment("ALL");
    setPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    status !== "ALL" ||
    priority !== "ALL" ||
    category !== "ALL" ||
    department !== "ALL";

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            รายการคำขอและงาน (Requests List)
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {currentRole === "USER"
              ? "ตรวจสอบและติดตามคำขอของคุณในระบบ"
              : "จัดการ ตรวจสอบ อนุมัติ และมอบหมายงานคำขอทั้งหมด"}
          </p>
        </div>
        <Link href="/requests/new">
          <Button className="gap-2 shadow-xs w-full sm:w-auto">
            <PlusCircle className="h-4 w-4" />
            สร้างคำขอใหม่
          </Button>
        </Link>
      </div>

      {/* Action feedback */}
      {actionFeedback && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{actionFeedback}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="border-slate-200 shadow-none dark:border-slate-800">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="ค้นหาเลขที่คำขอ, หัวข้อ หรือรายละเอียด..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Status Filter */}
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as RequestStatus | "ALL");
                setPage(1);
              }}
            >
              <option value="ALL">สถานะทั้งหมด</option>
              <option value={REQUEST_STATUS.PENDING_APPROVAL}>รออนุมัติ</option>
              <option value={REQUEST_STATUS.APPROVED}>อนุมัติแล้ว</option>
              <option value={REQUEST_STATUS.IN_PROGRESS}>กำลังดำเนินการ</option>
              <option value={REQUEST_STATUS.RESOLVED}>เสร็จสิ้น</option>
              <option value={REQUEST_STATUS.REJECTED}>ไม่อนุมัติ</option>
              <option value={REQUEST_STATUS.CANCELLED}>ยกเลิก</option>
            </Select>

            {/* Category Filter */}
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as RequestCategory | "ALL");
                setPage(1);
              }}
            >
              <option value="ALL">หมวดหมู่ทั้งหมด</option>
              {Object.entries(REQUEST_CATEGORIES).map(([key, val]) => (
                <option key={key} value={val}>
                  {REQUEST_CATEGORY_CONFIG[val].label}
                </option>
              ))}
            </Select>

            {/* Priority Filter */}
            <Select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value as RequestPriority | "ALL");
                setPage(1);
              }}
            >
              <option value="ALL">ความสำคัญทั้งหมด</option>
              <option value={REQUEST_PRIORITY.LOW}>ต่ำ</option>
              <option value={REQUEST_PRIORITY.MEDIUM}>ปานกลาง</option>
              <option value={REQUEST_PRIORITY.HIGH}>สูง</option>
              <option value={REQUEST_PRIORITY.URGENT}>เร่งด่วน</option>
            </Select>
          </div>

          {/* Department Filter & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">กรองแผนก:</span>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setPage(1);
                }}
                className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="ALL">ทุกแผนก</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 text-xs text-slate-500 hover:text-slate-900 gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                ล้างตัวกรองทั้งหมด
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <Card className="border-slate-200 shadow-none dark:border-slate-800">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : isError ? (
            <div className="py-12 text-center text-red-500">
              <AlertCircle className="mx-auto h-8 w-8 mb-2" />
              <p className="font-semibold">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
                ลองใหม่อีกครั้ง
              </Button>
            </div>
          ) : !data?.items.length ? (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
                ไม่พบคำขอที่ตรงกับเงื่อนไข
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองด้านบน
              </p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={resetFilters} className="mt-4 text-xs">
                  ล้างตัวกรอง
                </Button>
              )}
            </div>
          ) : (
            <div>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                  <thead className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                    <tr>
                      <th className="px-5 py-3.5">เลขที่ / หมวดหมู่</th>
                      <th className="px-5 py-3.5">หัวข้อคำขอ</th>
                      <th className="px-5 py-3.5">ผู้ขอ / แผนก</th>
                      <th className="px-5 py-3.5">ความสำคัญ</th>
                      <th className="px-5 py-3.5">สถานะ</th>
                      <th className="px-5 py-3.5">งบประมาณ</th>
                      <th className="px-5 py-3.5 text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/40">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800">
                              {getCategoryIcon(item.category)}
                            </span>
                            <div>
                              <p className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                {item.requestNumber}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {REQUEST_CATEGORY_CONFIG[item.category]?.label}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <p className="font-semibold text-slate-900 line-clamp-1 dark:text-white">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">
                            {item.requester?.name || "พนักงาน"}
                          </p>
                          <p className="text-[11px] text-slate-500">{item.department}</p>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <PriorityBadge priority={item.priority} />
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-xs font-medium">
                          {item.budget ? (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(item.budget)}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {(currentRole === "MANAGER" || currentRole === "ADMIN") &&
                              item.status === "PENDING_APPROVAL" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="success"
                                    className="h-8 px-2.5 text-xs gap-1"
                                    isLoading={statusMutation.isPending}
                                    onClick={() =>
                                      statusMutation.mutate({ requestId: item.id, newStatus: "APPROVED" })
                                    }
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                    อนุมัติ
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 px-2.5 text-xs gap-1"
                                    isLoading={statusMutation.isPending}
                                    onClick={() =>
                                      statusMutation.mutate({ requestId: item.id, newStatus: "REJECTED" })
                                    }
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                    ปฏิเสธ
                                  </Button>
                                </>
                              )}

                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2.5 text-xs gap-1"
                              onClick={() => setSelectedRequest(item.id === selectedRequest ? null : item.id)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              {selectedRequest === item.id ? "ปิด" : "ดู"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
                {data.items.map((item) => (
                  <div key={item.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-slate-100 dark:bg-slate-800">
                          {getCategoryIcon(item.category)}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {item.requestNumber}
                        </span>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>ผู้ขอ: <strong>{item.requester?.name || "พนักงาน"}</strong></span>
                      <span>แผนก: {item.department}</span>
                      {item.budget && (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          งบ: {formatCurrency(item.budget)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <PriorityBadge priority={item.priority} />

                      <div className="flex items-center gap-1.5">
                        {(currentRole === "MANAGER" || currentRole === "ADMIN") &&
                          item.status === "PENDING_APPROVAL" && (
                            <>
                              <Button
                                size="sm"
                                variant="success"
                                className="h-8 px-2 text-xs"
                                isLoading={statusMutation.isPending}
                                onClick={() =>
                                  statusMutation.mutate({ requestId: item.id, newStatus: "APPROVED" })
                                }
                              >
                                อนุมัติ
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 px-2 text-xs"
                                isLoading={statusMutation.isPending}
                                onClick={() =>
                                  statusMutation.mutate({ requestId: item.id, newStatus: "REJECTED" })
                                }
                              >
                                ปฏิเสธ
                              </Button>
                            </>
                          )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2.5 text-xs"
                          onClick={() => setSelectedRequest(item.id === selectedRequest ? null : item.id)}
                        >
                          {selectedRequest === item.id ? "ปิด" : "รายละเอียด"}
                        </Button>
                      </div>
                    </div>

                    {/* Expandable Details Drawer inside Card */}
                    {selectedRequest === item.id && (
                      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-2 dark:border-slate-700 dark:bg-slate-900 animate-in fade-in">
                        <p><strong>รายละเอียดคำขอ:</strong> {item.description}</p>
                        <p><strong>สร้างเมื่อ:</strong> {formatThaiDate(item.createdAt)}</p>
                        {item.assignee && (
                          <p><strong>ผู้รับผิดชอบงาน:</strong> {item.assignee.name} ({item.assignee.role})</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Expandable Modal/Drawer for Desktop if selected */}
              {selectedRequest && (
                <div className="hidden lg:block border-t border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/50">
                  {(() => {
                    const item = data.items.find((r) => r.id === selectedRequest);
                    if (!item) return null;
                    return (
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 max-w-3xl">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-bold text-sky-700 dark:text-sky-400">
                              {item.requestNumber}
                            </span>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line bg-white p-3 rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-6 text-xs text-slate-500">
                            <span>ผู้ส่งคำขอ: <strong>{item.requester?.name}</strong> ({item.requester?.email})</span>
                            <span>แผนก: <strong>{item.department}</strong></span>
                            <span>สร้างเมื่อ: {formatThaiDate(item.createdAt)}</span>
                            {item.budget && (
                              <span>งบประมาณที่ขอ: <strong className="text-emerald-600">{formatCurrency(item.budget)}</strong></span>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedRequest(null)}>
                          ปิดรายละเอียด ✕
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-xs text-slate-500 dark:border-slate-800">
                <div>
                  พบทั้งหมด <strong className="text-slate-900 dark:text-white">{data.total}</strong> รายการ (หน้า {data.page} จาก {data.totalPages})
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={data.page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-2 font-medium text-slate-700 dark:text-slate-300">
                    {data.page} / {data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={data.page >= data.totalPages}
                    onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
