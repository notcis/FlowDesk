import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Center",
  description: "จัดการผู้ใช้งานและบทบาทในระบบ FlowDesk",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}
