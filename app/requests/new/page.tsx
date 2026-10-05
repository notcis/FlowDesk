import { CreateRequestForm } from "@/components/features/create-request-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "สร้างคำขอใหม่",
  description: "ส่งคำขอซื้ออุปกรณ์ แจ้งปัญหาไอที หรือคำขออื่นๆ ภายในองค์กร",
};

export default function NewRequestPage() {
  return <CreateRequestForm />;
}
