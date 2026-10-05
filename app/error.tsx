"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-rose-100 p-3 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
        เกิดข้อผิดพลาดในการโหลดข้อมูล
      </h2>
      <p className="mt-2 text-sm text-slate-500 max-w-md">
        ระบบไม่สามารถประมวลผลคำขอได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button onClick={() => reset()} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          ลองใหม่อีกครั้ง
        </Button>
      </div>
    </div>
  );
}
