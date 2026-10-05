import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-slate-100 p-3 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
        ไม่พบหน้าที่คุณต้องการ (404 Not Found)
      </h2>
      <p className="mt-2 text-sm text-slate-500 max-w-md">
        หน้าที่คุณกำลังค้นหาไม่มีอยู่ หรืออาจถูกย้ายตำแหน่งแล้ว
      </p>
      <div className="mt-6">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            กลับสู่หน้าหลัก
          </Button>
        </Link>
      </div>
    </div>
  );
}
