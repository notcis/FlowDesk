"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRole } from "@/components/shared/role-context";
import { createRequest } from "@/lib/actions/request-actions";
import { QUERY_KEYS } from "@/lib/query-client";
import {
  DEPARTMENTS,
  REQUEST_CATEGORIES,
  REQUEST_CATEGORY_CONFIG,
  REQUEST_PRIORITY,
  REQUEST_PRIORITY_CONFIG,
  RequestCategory,
  RequestPriority,
} from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Package,
  Laptop,
  Building,
  CreditCard,
  FileText,
  Paperclip,
} from "lucide-react";

export function CreateRequestForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentUser } = useRole();

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<RequestCategory>("EQUIPMENT");
  const [priority, setPriority] = useState<RequestPriority>("MEDIUM");
  const [department, setDepartment] = useState<string>(currentUser.department || DEPARTMENTS[0]);
  const [budget, setBudget] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      setFieldErrors({});
      setFormError(null);

      const parsedBudget = budget.trim() !== "" ? parseFloat(budget) : null;
      const payload = {
        title,
        description,
        category,
        priority,
        department,
        budget: parsedBudget,
      };

      const res = await createRequest(payload, {
        id: currentUser.id,
        name: currentUser.name || "พนักงาน",
        email: currentUser.email,
        role: currentUser.role,
        department: currentUser.department || department,
      });

      if (!res.success) {
        if (res.errors) {
          setFieldErrors(res.errors);
        }
        throw new Error(res.message);
      }

      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.requests.all });
      setSuccessInfo(`สร้างคำขอเลขที่ ${data.requestNumber} สำเร็จเรียบร้อย! กำลังนำคุณไปยังหน้ารายการ...`);
      setTimeout(() => {
        router.push("/requests");
      }, 1500);
    },
    onError: (err: Error) => {
      setFormError(err.message || "เกิดข้อผิดพลาดในการสร้างคำขอ");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "EQUIPMENT":
        return <Package className="h-5 w-5 text-sky-600" />;
      case "IT_SUPPORT":
        return <Laptop className="h-5 w-5 text-purple-600" />;
      case "FACILITY":
        return <Building className="h-5 w-5 text-emerald-600" />;
      case "EXPENSE":
        return <CreditCard className="h-5 w-5 text-amber-600" />;
      default:
        return <FileText className="h-5 w-5 text-slate-600" />;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back button and page title */}
      <div>
        <Link
          href="/requests"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          กลับไปหน้ารายการคำขอ
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          สร้างคำขอใหม่ (New Request)
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          กรอกรายละเอียดคำขอเพื่อส่งให้หัวหน้างานหรือผู้ดูแลระบบพิจารณาอนุมัติ
        </p>
      </div>

      {/* Success Notification */}
      {successInfo && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successInfo}</span>
        </div>
      )}

      {/* Form Error Banner */}
      {formError && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm font-semibold text-rose-800 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300 animate-in fade-in">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Form Container */}
      <Card className="border-slate-200 shadow-none dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">ข้อมูลคำขอ</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                ผู้ส่งคำขอ: <strong>{currentUser.name}</strong> ({currentUser.email})
              </CardDescription>
            </div>
            <span className="rounded-md bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
              สถานะเริ่มต้น: รออนุมัติ
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Cards Selector */}
            <div className="space-y-2">
              <Label required>หมวดหมู่คำขอ (Category)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(REQUEST_CATEGORIES).map(([key, catValue]) => {
                  const cfg = REQUEST_CATEGORY_CONFIG[catValue];
                  const isSelected = category === catValue;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setCategory(catValue)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-sky-600 bg-sky-50/80 ring-2 ring-sky-500/30 dark:bg-sky-950/50 dark:border-sky-500"
                          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="mt-0.5 p-2 rounded-lg bg-white shadow-2xs border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                        {getCategoryIcon(catValue)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {cfg.label}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {cfg.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Request Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title" required>
                หัวข้อคำขอ (Title)
              </Label>
              <Input
                id="title"
                placeholder="เช่น ขอจัดซื้อจอมอนิเตอร์ 27 นิ้วสำหรับเขียนโปรแกรม..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={Boolean(fieldErrors.title)}
                required
              />
              {fieldErrors.title && (
                <p className="text-xs text-rose-600 font-medium">{fieldErrors.title[0]}</p>
              )}
            </div>

            {/* Department & Priority in 2-cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="department" required>
                  แผนกของผู้ขอ (Department)
                </Label>
                <Select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="priority" required>
                  ระดับความสำคัญ (Priority)
                </Label>
                <Select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as RequestPriority)}
                >
                  {Object.entries(REQUEST_PRIORITY).map(([key, val]) => (
                    <option key={key} value={val}>
                      {REQUEST_PRIORITY_CONFIG[val].label} {val === "URGENT" ? "⚡ (เร่งด่วนที่สุด)" : ""}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Budget / Estimated Cost */}
            <div className="space-y-1.5">
              <Label htmlFor="budget">
                งบประมาณที่ขอ (Estimated Budget in THB)
                <span className="ml-1 text-xs text-slate-400 font-normal">(ทางเลือก ระบุหากเป็นการขอซื้อหรือเบิกจ่าย)</span>
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">
                  ฿
                </span>
                <Input
                  id="budget"
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="0"
                  step="any"
                />
              </div>
              {fieldErrors.budget && (
                <p className="text-xs text-rose-600 font-medium">{fieldErrors.budget[0]}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" required>
                รายละเอียดคำขอและเหตุผลความจำเป็น (Description)
              </Label>
              <Textarea
                id="description"
                rows={5}
                placeholder="อธิบายเหตุผล ประโยชน์ที่จะได้รับ สเปกอุปกรณ์ หรือรายละเอียดงานอย่างชัดเจน..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={Boolean(fieldErrors.description)}
                required
              />
              {fieldErrors.description && (
                <p className="text-xs text-rose-600 font-medium">{fieldErrors.description[0]}</p>
              )}
            </div>

            {/* Attachment Upload Area (UploadThing Ready) */}
            <div className="space-y-2">
              <Label>ไฟล์แนบหรือใบเสนอราคา (Attachments - UploadThing Ready)</Label>
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center hover:bg-slate-50 transition-colors dark:border-slate-800 dark:bg-slate-900/50">
                <div className="rounded-full bg-sky-100 p-2.5 text-sky-600 dark:bg-sky-950 dark:text-sky-300">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  รองรับเอกสาร PDF, รูปภาพ PNG, JPG, ใบเสนอราคา (ไม่เกิน 16MB)
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <Paperclip className="h-3.5 w-3.5" />
                  <span>ระบบตรวจสอบขนาดและความปลอดภัยไฟล์อัตโนมัติ</span>
                </div>
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link href="/requests" className="w-full sm:w-auto">
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  ยกเลิก
                </Button>
              </Link>
              <Button
                type="submit"
                className="w-full sm:w-auto min-w-[140px]"
                isLoading={createMutation.isPending}
                disabled={createMutation.isPending || !!successInfo}
              >
                ยืนยันส่งคำขอ
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
