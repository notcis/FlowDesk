import { REQUEST_STATUS_CONFIG, RequestStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = REQUEST_STATUS_CONFIG[status] || {
    label: status,
    color: "text-slate-700",
    bg: "bg-slate-100 border-slate-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors",
        config.color,
        config.bg,
        className
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", {
          "bg-amber-500": status === "PENDING_APPROVAL",
          "bg-blue-500": status === "APPROVED",
          "bg-indigo-500": status === "IN_PROGRESS",
          "bg-emerald-500": status === "RESOLVED",
          "bg-rose-500": status === "REJECTED",
          "bg-slate-400": status === "CANCELLED",
        })}
      />
      {config.label}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const isUrgent = priority === "URGENT";
  const isHigh = priority === "HIGH";

  const config = {
    LOW: { label: "ต่ำ", bg: "bg-slate-100 text-slate-700 border-slate-200" },
    MEDIUM: { label: "ปานกลาง", bg: "bg-sky-50 text-sky-800 border-sky-200" },
    HIGH: { label: "สูง", bg: "bg-orange-50 text-orange-800 border-orange-200" },
    URGENT: { label: "เร่งด่วน", bg: "bg-rose-50 text-rose-800 border-rose-300 font-bold animate-pulse" },
  }[priority] || { label: priority, bg: "bg-slate-100 text-slate-700 border-slate-200" };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs border font-medium",
        config.bg,
        className
      )}
    >
      {(isUrgent || isHigh) && <span className="mr-1">⚡</span>}
      {config.label}
    </span>
  );
}
