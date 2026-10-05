"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ActionResult, RequestDashboardStats, RequestFilterParams, RequestItem } from "@/types";
import { DEFAULT_PAGE_SIZE, RequestCategory, RequestPriority, RequestStatus, UserRole } from "@/lib/constants";

// In-memory mock store fallback when MySQL database is not connected yet
let mockRequests: RequestItem[] = [
  {
    id: "req-1",
    requestNumber: "REQ-2026-0001",
    title: "ขอจัดซื้อเก้าอี้ Ergonomic สำหรับทีม Engineering",
    description: "เนื่องจากเก้าอี้เดิมชำรุดและพนักงานมีอาการปวดหลัง ขอจัดซื้อเก้าอี้เพื่อสุขภาพ 2 ตัวสำหรับทีม",
    category: "EQUIPMENT",
    priority: "HIGH",
    status: "PENDING_APPROVAL",
    department: "Engineering (วิศวกรรม/พัฒนา)",
    budget: 15900,
    requesterId: "usr-1",
    requester: {
      id: "usr-1",
      name: "สมชาย ชัยชนะ (User)",
      email: "somchai@flowdesk.local",
      role: "USER",
      department: "Engineering (วิศวกรรม/พัฒนา)",
      image: null,
    },
    assigneeId: null,
    assignee: null,
    createdAt: new Date(Date.now() - 3600000 * 2),
    updatedAt: new Date(Date.now() - 3600000 * 2),
    activitiesCount: 1,
    commentsCount: 0,
    attachmentsCount: 1,
  },
  {
    id: "req-2",
    requestNumber: "REQ-2026-0002",
    title: "จอ Monitor ห้องประชุมใหญ่เชื่อมต่อภาพไม่ติด",
    description: "จอทีวี 65 นิ้วในห้องประชุมใหญ่ Meeting Room A สัญญาณ HDMI ขาดๆ หายๆ ต้องการช่างเข้ามาตรวจเช็คด่วน",
    category: "IT_SUPPORT",
    priority: "URGENT",
    status: "IN_PROGRESS",
    department: "Operations (ปฏิบัติการ)",
    budget: null,
    requesterId: "usr-1",
    requester: {
      id: "usr-1",
      name: "สมชาย ชัยชนะ (User)",
      email: "somchai@flowdesk.local",
      role: "USER",
      department: "Engineering (วิศวกรรม/พัฒนา)",
      image: null,
    },
    assigneeId: "usr-2",
    assignee: {
      id: "usr-2",
      name: "วิภาดา สถิตย์ธรรม (Manager)",
      email: "wiphada@flowdesk.local",
      role: "MANAGER",
      department: "IT & Operations",
      image: null,
    },
    createdAt: new Date(Date.now() - 3600000 * 18),
    updatedAt: new Date(Date.now() - 3600000 * 5),
    activitiesCount: 2,
    commentsCount: 2,
    attachmentsCount: 0,
  },
  {
    id: "req-3",
    requestNumber: "REQ-2026-0003",
    title: "ขอเบิกค่าคอร์สฝึกอบรม Next.js & AI Solutions",
    description: "คอร์สอบรมยกระดับทักษะทีมพัฒนาซอฟต์แวร์ ระยะเวลาอบรม 2 วัน พร้อมใบประกาศนียบัตร",
    category: "EXPENSE",
    priority: "MEDIUM",
    status: "APPROVED",
    department: "Engineering (วิศวกรรม/พัฒนา)",
    budget: 8500,
    requesterId: "usr-1",
    requester: {
      id: "usr-1",
      name: "สมชาย ชัยชนะ (User)",
      email: "somchai@flowdesk.local",
      role: "USER",
      department: "Engineering (วิศวกรรม/พัฒนา)",
      image: null,
    },
    assigneeId: "usr-2",
    assignee: {
      id: "usr-2",
      name: "วิภาดา สถิตย์ธรรม (Manager)",
      email: "wiphada@flowdesk.local",
      role: "MANAGER",
      department: "Engineering",
      image: null,
    },
    createdAt: new Date(Date.now() - 3600000 * 48),
    updatedAt: new Date(Date.now() - 3600000 * 12),
    activitiesCount: 3,
    commentsCount: 1,
    attachmentsCount: 1,
  },
  {
    id: "req-4",
    requestNumber: "REQ-2026-0004",
    title: "แอร์ห้องเซิร์ฟเวอร์มีน้ำหยด",
    description: "เครื่องปรับอากาศในห้อง Server Room 2 ชั้น 3 เริ่มมีน้ำหยด อาจเกิดความชื้นสะสมกับตู้แร็ค",
    category: "FACILITY",
    priority: "HIGH",
    status: "RESOLVED",
    department: "Operations (ปฏิบัติการ)",
    budget: 1200,
    requesterId: "usr-2",
    requester: {
      id: "usr-2",
      name: "วิภาดา สถิตย์ธรรม (Manager)",
      email: "wiphada@flowdesk.local",
      role: "MANAGER",
      department: "Operations",
      image: null,
    },
    assigneeId: "usr-3",
    assignee: {
      id: "usr-3",
      name: "กิตติพงษ์ ผู้ดูแลระบบ (Admin)",
      email: "admin@flowdesk.local",
      role: "ADMIN",
      department: "Central Admin",
      image: null,
    },
    createdAt: new Date(Date.now() - 3600000 * 72),
    updatedAt: new Date(Date.now() - 3600000 * 24),
    activitiesCount: 4,
    commentsCount: 3,
    attachmentsCount: 2,
  },
];

import { createRequestSchema } from "@/lib/validations/request";

export async function getRequests(
  params: RequestFilterParams = {}
): Promise<ActionResult<{ items: RequestItem[]; total: number; page: number; totalPages: number }>> {
  try {
    const page = params.page || 1;
    const pageSize = params.pageSize || DEFAULT_PAGE_SIZE;
    const search = params.search?.toLowerCase().trim();
    const status = params.status && params.status !== "ALL" ? params.status : undefined;
    const priority = params.priority && params.priority !== "ALL" ? params.priority : undefined;
    const category = params.category && params.category !== "ALL" ? params.category : undefined;
    const department = params.department && params.department !== "ALL" ? params.department : undefined;

    // Try Database first
    try {
      const where: Record<string, unknown> = {};
      if (search) {
        where.OR = [
          { title: { contains: search } },
          { description: { contains: search } },
          { requestNumber: { contains: search } },
        ];
      }
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (category) where.category = category;
      if (department) where.department = department;

      // Role filter
      if (params.roleView === "USER" && params.currentUserId) {
        where.requesterId = params.currentUserId;
      }

      const total = await prisma.request.count({ where });
      const dbItems = await prisma.request.findMany({
        where,
        include: {
          requester: { select: { id: true, name: true, email: true, role: true, department: true, image: true } },
          assignee: { select: { id: true, name: true, email: true, role: true, department: true, image: true } },
          _count: { select: { activities: true, comments: true, attachments: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      const formatted: RequestItem[] = dbItems.map((item) => ({
        id: item.id,
        requestNumber: item.requestNumber,
        title: item.title,
        description: item.description,
        category: item.category as RequestCategory,
        priority: item.priority as RequestPriority,
        status: item.status as RequestStatus,
        department: item.department,
        budget: item.budget,
        requesterId: item.requesterId,
        requester: item.requester as RequestItem["requester"],
        assigneeId: item.assigneeId,
        assignee: item.assignee as RequestItem["assignee"],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        activitiesCount: item._count.activities,
        commentsCount: item._count.comments,
        attachmentsCount: item._count.attachments,
      }));

      return {
        success: true,
        data: {
          items: formatted,
          total,
          page,
          totalPages: Math.max(1, Math.ceil(total / pageSize)),
        },
      };
    } catch {
      // Fallback to memory store if DB connection fails in local preview
      let filtered = [...mockRequests];

      if (search) {
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(search) ||
            r.description.toLowerCase().includes(search) ||
            r.requestNumber.toLowerCase().includes(search)
        );
      }
      if (status) filtered = filtered.filter((r) => r.status === status);
      if (priority) filtered = filtered.filter((r) => r.priority === priority);
      if (category) filtered = filtered.filter((r) => r.category === category);
      if (department) filtered = filtered.filter((r) => r.department === department);

      if (params.roleView === "USER" && params.currentUserId) {
        filtered = filtered.filter((r) => r.requesterId === params.currentUserId);
      }

      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const total = filtered.length;
      const startIndex = (page - 1) * pageSize;
      const paginated = filtered.slice(startIndex, startIndex + pageSize);

      return {
        success: true,
        data: {
          items: paginated,
          total,
          page,
          totalPages: Math.max(1, Math.ceil(total / pageSize)),
        },
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการโหลดรายการคำขอ",
    };
  }
}

export async function getRequestStats(roleView?: UserRole, currentUserId?: string): Promise<ActionResult<RequestDashboardStats>> {
  try {
    try {
      const where: Record<string, unknown> = {};
      if (roleView === "USER" && currentUserId) {
        where.requesterId = currentUserId;
      }

      const requests = await prisma.request.findMany({
        where,
        select: { status: true, priority: true, budget: true },
      });

      const stats: RequestDashboardStats = {
        total: requests.length,
        pendingApproval: requests.filter((r) => r.status === "PENDING_APPROVAL").length,
        approved: requests.filter((r) => r.status === "APPROVED").length,
        inProgress: requests.filter((r) => r.status === "IN_PROGRESS").length,
        resolved: requests.filter((r) => r.status === "RESOLVED").length,
        rejected: requests.filter((r) => r.status === "REJECTED").length,
        urgentCount: requests.filter((r) => r.priority === "URGENT" && r.status !== "RESOLVED" && r.status !== "REJECTED").length,
        totalBudget: requests.reduce((acc, curr) => acc + (curr.budget || 0), 0),
      };

      return { success: true, data: stats };
    } catch {
      let filtered = [...mockRequests];
      if (roleView === "USER" && currentUserId) {
        filtered = filtered.filter((r) => r.requesterId === currentUserId);
      }

      const stats: RequestDashboardStats = {
        total: filtered.length,
        pendingApproval: filtered.filter((r) => r.status === "PENDING_APPROVAL").length,
        approved: filtered.filter((r) => r.status === "APPROVED").length,
        inProgress: filtered.filter((r) => r.status === "IN_PROGRESS").length,
        resolved: filtered.filter((r) => r.status === "RESOLVED").length,
        rejected: filtered.filter((r) => r.status === "REJECTED").length,
        urgentCount: filtered.filter((r) => r.priority === "URGENT" && r.status !== "RESOLVED" && r.status !== "REJECTED").length,
        totalBudget: filtered.reduce((acc, curr) => acc + (curr.budget || 0), 0),
      };

      return { success: true, data: stats };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "ไม่สามารถคำนวณสถิติได้",
    };
  }
}

export async function createRequest(
  rawInput: unknown,
  actor: { id: string; name: string | null; email: string; role: UserRole; department: string }
): Promise<ActionResult<RequestItem>> {
  try {
    const parseResult = createRequestSchema.safeParse(rawInput);
    if (!parseResult.success) {
      const flattened = parseResult.error.flatten();
      return {
        success: false,
        message: "ข้อมูลไม่ถูกต้องตามรูปแบบ กรุณาตรวจสอบ",
        errors: flattened.fieldErrors,
      };
    }

    const data = parseResult.data;
    const year = new Date().getFullYear();
    const countNumber = (mockRequests.length + 1).toString().padStart(4, "0");
    const requestNumber = `REQ-${year}-${countNumber}`;

    const newRequest: RequestItem = {
      id: `req-${Date.now()}`,
      requestNumber,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: "PENDING_APPROVAL",
      department: data.department,
      budget: data.budget || null,
      requesterId: actor.id,
      requester: {
        id: actor.id,
        name: actor.name,
        email: actor.email,
        role: actor.role,
        department: actor.department,
        image: null,
      },
      assigneeId: null,
      assignee: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      activitiesCount: 1,
      commentsCount: 0,
      attachmentsCount: 0,
    };

    // Attempt to persist to Database
    try {
      const dbCreated = await prisma.request.create({
        data: {
          requestNumber,
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          status: "PENDING_APPROVAL",
          department: data.department,
          budget: data.budget,
          requesterId: actor.id,
          activities: {
            create: {
              actorId: actor.id,
              action: "SUBMITTED",
              notes: "สร้างคำขอใหม่และส่งเพื่อรอการอนุมัติ",
            },
          },
        },
        include: {
          requester: { select: { id: true, name: true, email: true, role: true, department: true, image: true } },
          assignee: { select: { id: true, name: true, email: true, role: true, department: true, image: true } },
        },
      });

      newRequest.id = dbCreated.id;
    } catch {
      // Fallback in-memory
      mockRequests.unshift(newRequest);
    }

    revalidatePath("/");
    revalidatePath("/requests");

    return {
      success: true,
      data: newRequest,
      message: `สร้างคำขอเลขที่ ${requestNumber} สำเร็จ`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการบันทึกคำขอ",
    };
  }
}

export async function updateRequestStatus(
  requestId: string,
  newStatus: RequestStatus,
  actor: { id: string; name: string | null; role: UserRole },
  notes?: string,
  assigneeId?: string
): Promise<ActionResult<{ requestId: string; status: RequestStatus }>> {
  try {
    if (actor.role !== "MANAGER" && actor.role !== "ADMIN") {
      return {
        success: false,
        message: "สิทธิ์ไม่เพียงพอ เฉพาะ Manager หรือ Admin เท่านั้นที่สามารถเปลี่ยนสถานะคำขอได้",
      };
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.request.update({
          where: { id: requestId },
          data: {
            status: newStatus,
            assigneeId: assigneeId !== undefined ? assigneeId : undefined,
          },
        });

        await tx.requestActivity.create({
          data: {
            requestId,
            actorId: actor.id,
            action: `STATUS_CHANGE_TO_${newStatus}`,
            notes: notes || `เปลี่ยนสถานะเป็น ${newStatus}`,
          },
        });
      });
    } catch {
      const target = mockRequests.find((r) => r.id === requestId);
      if (target) {
        target.status = newStatus;
        if (assigneeId !== undefined) {
          target.assigneeId = assigneeId;
        }
        target.updatedAt = new Date();
      }
    }

    revalidatePath("/");
    revalidatePath("/requests");
    revalidatePath(`/requests/${requestId}`);

    return {
      success: true,
      data: { requestId, status: newStatus },
      message: `อัปเดตสถานะเป็น ${newStatus} สำเร็จ`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการอัปเดตสถานะ",
    };
  }
}
