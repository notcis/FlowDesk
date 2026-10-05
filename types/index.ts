import { RequestCategory, RequestPriority, RequestStatus, UserRole } from "@/lib/constants";

export type ActionResult<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; message: string; errors?: Record<string, string[]> };

export interface UserSummary {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  department: string | null;
  image: string | null;
}

export interface RequestItem {
  id: string;
  requestNumber: string;
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
  status: RequestStatus;
  department: string;
  budget: number | null;
  requesterId: string;
  requester: UserSummary;
  assigneeId: string | null;
  assignee?: UserSummary | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  activitiesCount?: number;
  commentsCount?: number;
  attachmentsCount?: number;
}

export interface RequestFilterParams {
  search?: string;
  status?: RequestStatus | "ALL";
  priority?: RequestPriority | "ALL";
  category?: RequestCategory | "ALL";
  department?: string | "ALL";
  page?: number;
  pageSize?: number;
  roleView?: UserRole;
  currentUserId?: string;
}

export interface RequestDashboardStats {
  total: number;
  pendingApproval: number;
  approved: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  urgentCount: number;
  totalBudget: number;
}

export interface RequestActivityItem {
  id: string;
  requestId: string;
  actorId: string;
  actor: UserSummary;
  action: string;
  notes: string | null;
  createdAt: Date | string;
}
