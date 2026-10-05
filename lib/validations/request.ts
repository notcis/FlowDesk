import { z } from "zod";

export const createRequestSchema = z.object({
  title: z
    .string()
    .min(3, "หัวข้อต้องมีความยาวอย่างน้อย 3 ตัวอักษร")
    .max(100, "หัวข้อต้องมีความยาวไม่เกิน 100 ตัวอักษร"),
  description: z.string().min(10, "รายละเอียดต้องมีความยาวอย่างน้อย 10 ตัวอักษร"),
  category: z.enum(["EQUIPMENT", "IT_SUPPORT", "FACILITY", "EXPENSE", "GENERAL"] as const, {
    message: "กรุณาเลือกหมวดหมู่ที่ถูกต้อง",
  }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"] as const, {
    message: "กรุณาเลือกระดับความสำคัญที่ถูกต้อง",
  }),
  department: z.string().min(1, "กรุณาระบุแผนก"),
  budget: z.coerce.number().min(0, "งบประมาณต้องไม่ติดลบ").optional().nullable(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
