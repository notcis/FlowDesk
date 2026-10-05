import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting FlowDesk Database Seeding...");

  // Upsert Users
  const user = await prisma.user.upsert({
    where: { email: "user@flowdesk.local" },
    update: {},
    create: {
      id: "usr-1",
      name: "สมชาย ชัยชนะ",
      email: "user@flowdesk.local",
      role: "USER",
      department: "Engineering (วิศวกรรม/พัฒนา)",
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@flowdesk.local" },
    update: {},
    create: {
      id: "usr-2",
      name: "วิภาดา สถิตย์ธรรม",
      email: "manager@flowdesk.local",
      role: "MANAGER",
      department: "IT & Operations",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@flowdesk.local" },
    update: {},
    create: {
      id: "usr-3",
      name: "กิตติพงษ์ ผู้ดูแลระบบ",
      email: "admin@flowdesk.local",
      role: "ADMIN",
      department: "Central Admin",
    },
  });

  console.log("✅ Seeded Users:", { user: user.email, manager: manager.email, admin: admin.email });

  // Sample Requests
  const req1 = await prisma.request.upsert({
    where: { requestNumber: "REQ-2026-0001" },
    update: {},
    create: {
      id: "req-1",
      requestNumber: "REQ-2026-0001",
      title: "ขอจัดซื้อเก้าอี้ Ergonomic สำหรับทีม Engineering",
      description: "เนื่องจากเก้าอี้เดิมชำรุดและพนักงานมีอาการปวดหลัง ขอจัดซื้อเก้าอี้เพื่อสุขภาพ 2 ตัวสำหรับทีม",
      category: "EQUIPMENT",
      priority: "HIGH",
      status: "PENDING_APPROVAL",
      department: "Engineering (วิศวกรรม/พัฒนา)",
      budget: 15900,
      requesterId: user.id,
      activities: {
        create: {
          actorId: user.id,
          action: "SUBMITTED",
          notes: "สร้างคำขอใหม่และส่งเพื่อรอการอนุมัติ",
        },
      },
    },
  });

  const req2 = await prisma.request.upsert({
    where: { requestNumber: "REQ-2026-0002" },
    update: {},
    create: {
      id: "req-2",
      requestNumber: "REQ-2026-0002",
      title: "จอ Monitor ห้องประชุมใหญ่เชื่อมต่อภาพไม่ติด",
      description: "จอทีวี 65 นิ้วในห้องประชุมใหญ่ Meeting Room A สัญญาณ HDMI ขาดๆ หายๆ ต้องการช่างเข้ามาตรวจเช็คด่วน",
      category: "IT_SUPPORT",
      priority: "URGENT",
      status: "IN_PROGRESS",
      department: "Operations (ปฏิบัติการ)",
      requesterId: user.id,
      assigneeId: manager.id,
      activities: {
        createMany: {
          data: [
            { actorId: user.id, action: "SUBMITTED", notes: "สร้างคำขอแจ้งปัญหาไอที" },
            { actorId: manager.id, action: "ASSIGNED", notes: "มอบหมายงานให้ทีม IT เข้าตรวจเช็คหน้างาน" },
          ],
        },
      },
      comments: {
        create: {
          userId: manager.id,
          content: "กำลังจัดช่างเทคนิคเข้าไปเปลี่ยนสายสัญญาณ HDMI วันนี้เวลา 14:00 น. ครับ",
        },
      },
    },
  });

  console.log("✅ Seeded Requests:", [req1.requestNumber, req2.requestNumber]);
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
