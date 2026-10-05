import { RequestsListView } from "@/components/features/requests-list-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "รายการคำขอและงาน",
  description: "ค้นหา กรอง และติดตามสถานะคำขอและงานทั้งหมดในระบบ",
};

export default function RequestsPage() {
  return <RequestsListView />;
}
