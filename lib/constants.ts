export const APP_CONFIG = {
  name: "FlowDesk",
  description: "ระบบจัดการคำขอและงานในทีม (Request & Task Workflow Management)",
  version: "1.0.0",
} as const;

export const DEFAULT_PAGE_SIZE = 10;

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/",
  REQUESTS: "/requests",
  REQUEST_NEW: "/requests/new",
  REQUEST_DETAIL: (id: string) => `/requests/${id}`,
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  LOGIN: "/login",
} as const;

export const USER_ROLES = {
  USER: "USER",
  MANAGER: "MANAGER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const REQUEST_STATUS = {
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;

export type RequestStatus = (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];

export const REQUEST_STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" | "warning" | "success" | "info"; color: string; bg: string }
> = {
  PENDING_APPROVAL: {
    label: "รออนุมัติ",
    badgeVariant: "warning",
    color: "text-amber-800 dark:text-amber-300",
    bg: "bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800",
  },
  APPROVED: {
    label: "อนุมัติแล้ว",
    badgeVariant: "info",
    color: "text-blue-800 dark:text-blue-300",
    bg: "bg-blue-100 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800",
  },
  IN_PROGRESS: {
    label: "กำลังดำเนินการ",
    badgeVariant: "default",
    color: "text-indigo-800 dark:text-indigo-300",
    bg: "bg-indigo-100 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800",
  },
  RESOLVED: {
    label: "เสร็จสิ้น",
    badgeVariant: "success",
    color: "text-emerald-800 dark:text-emerald-300",
    bg: "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800",
  },
  REJECTED: {
    label: "ไม่อนุมัติ",
    badgeVariant: "destructive",
    color: "text-rose-800 dark:text-rose-300",
    bg: "bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800",
  },
  CANCELLED: {
    label: "ยกเลิกแล้ว",
    badgeVariant: "outline",
    color: "text-slate-700 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800",
  },
};

export const REQUEST_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export type RequestPriority = (typeof REQUEST_PRIORITY)[keyof typeof REQUEST_PRIORITY];

export const REQUEST_PRIORITY_CONFIG: Record<
  RequestPriority,
  { label: string; color: string; bg: string }
> = {
  LOW: {
    label: "ต่ำ",
    color: "text-slate-700 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-800 border-slate-300",
  },
  MEDIUM: {
    label: "ปานกลาง",
    color: "text-sky-800 dark:text-sky-300",
    bg: "bg-sky-100 dark:bg-sky-950/60 border-sky-300",
  },
  HIGH: {
    label: "สูง",
    color: "text-orange-800 dark:text-orange-300",
    bg: "bg-orange-100 dark:bg-orange-950/60 border-orange-300",
  },
  URGENT: {
    label: "เร่งด่วนมาก",
    color: "text-rose-800 dark:text-rose-300",
    bg: "bg-rose-100 dark:bg-rose-950/60 border-rose-300",
  },
};

export const REQUEST_CATEGORIES = {
  EQUIPMENT: "EQUIPMENT",
  IT_SUPPORT: "IT_SUPPORT",
  FACILITY: "FACILITY",
  EXPENSE: "EXPENSE",
  GENERAL: "GENERAL",
} as const;

export type RequestCategory = (typeof REQUEST_CATEGORIES)[keyof typeof REQUEST_CATEGORIES];

export const REQUEST_CATEGORY_CONFIG: Record<
  RequestCategory,
  { label: string; icon: string; description: string }
> = {
  EQUIPMENT: {
    label: "ขอซื้อ/เบิกอุปกรณ์",
    icon: "Package",
    description: "ขอซื้ออุปกรณ์ทำงาน คอมพิวเตอร์ หรืออุปกรณ์เสริม",
  },
  IT_SUPPORT: {
    label: "แจ้งปัญหาไอที",
    icon: "Laptop",
    description: "ปัญหาการใช้งานระบบ อีเมล เครือข่าย หรือซอฟต์แวร์",
  },
  FACILITY: {
    label: "อาคาร/สถานที่/สิ่งอำนวยความสะดวก",
    icon: "Building",
    description: "ซ่อมบำรุงสถานที่ แอร์ ไฟฟ้า ห้องประชุม",
  },
  EXPENSE: {
    label: "เบิกจ่าย/งบประมาณ",
    icon: "CreditCard",
    description: "ขออนุมัติค่าใช้จ่าย ค่าเดินทาง ค่าบริการ",
  },
  GENERAL: {
    label: "คำขอทั่วไป",
    icon: "FileText",
    description: "เรื่องประสานงาน เอกสาร หรือคำขออื่นๆ ภายในองค์กร",
  },
};

export const DEPARTMENTS = [
  "Engineering (วิศวกรรม/พัฒนา)",
  "Product & Design (ผลิตภัณฑ์/ดีไซน์)",
  "Marketing (การตลาด)",
  "Sales (ฝ่ายขาย)",
  "Operations (ปฏิบัติการ)",
  "Human Resources (ฝ่ายบุคคล)",
  "Finance & Accounting (การเงิน/บัญชี)",
  "Customer Support (บริการลูกค้า)",
] as const;
